import { connect } from "@/db/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { ClientErrorResponse, SuccessResponse, UnknownErrorResponse } from "@/helpers/responseApi";
import jwt from "jsonwebtoken";
import { LangType, translate } from "@/lang/lang";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { encryptAES } from "@/helpers/cryptoAES";
import { EMAIL_TYPE, sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  const { t } = translate((request.cookies.get("Authorization")?.value as LangType) || "en");
  const reqBody = await request.json();
  const domain = request.url.split("/api")[0];

  const login = async () => {
    const { user, password, type = "email" } = reqBody;

    const query = type === "username" ? { username: user } : { email: user };

    // check if user already exist
    const userExist = await User.findOne(query);

    if (!userExist) {
      return NextResponse.json(ClientErrorResponse(401, t("error_login")), {
        status: 401,
      });
    }

    if (!userExist.isVerified && type === "email") {
      const date = new Date(Date.now() + 5 * 60 * 1000);
      if (date > new Date(userExist.verifyTokenExpiry)) {
        console.log("expired");
        try {
          await sendEmail({
            email: user,
            emailType: EMAIL_TYPE.VERIFY_EMAIL,
            userId: userExist._id,
            name: userExist.name,
            domain,
          });
        } catch (e) {
          console.log(e);
        }
      }

      return NextResponse.json(
        ClientErrorResponse(402, "Please check your email to verify this email."),
        {
          status: 402,
        }
      );
    }

    // check password is correct
    const validPassword = await bcryptjs.compare(password, userExist.password);
    if (!validPassword) {
      return NextResponse.json(ClientErrorResponse(401, t("error_login")), {
        status: 401,
      });
    }

    //  create token data
    const tokenData = {
      id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      username: userExist.username,
      role: "admin",
    };

    const encryptData = encryptAES(JSON.stringify(tokenData));

    const token = await jwt.sign(tokenData, process.env.SECRET_TOKEN as string, {
      expiresIn: "14h",
    });

    const response = NextResponse.json(SuccessResponse(undefined, t("success_login")), {
      status: 200,
    });

    response.cookies.set("Session", encryptData, {
      httpOnly: false,
      path: "/",
    });

    response.cookies.set("Authorization", token, {
      httpOnly: true,
      path: "/",
    });

    return response;
  };

  return await ServicesWrapper(request, login, { reqBody, requiredBody: ["user", "password"] });
}
