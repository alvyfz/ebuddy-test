import { connect } from "@/db/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { ClientErrorResponse, SuccessResponse, UnknownErrorResponse } from "@/helpers/responseApi";
// import { EMAIL_TYPE, sendEmail } from "@/helpers/mailer";
import { LangType, translate } from "@/lang/lang";
import { isValidEmail, isValidUsername } from "@/helpers/utils";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { EMAIL_TYPE, sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  const { t } = translate((request.cookies.get("Authorization")?.value as LangType) || "en");
  const reqBody = await request.json();
  const domain = request.url.split("/api")[0];

  const signup = async () => {
    const { user, name, password, type = "email" } = reqBody;

    if (type === "email" && !isValidEmail(user)) {
      return NextResponse.json(ClientErrorResponse(401, "invalid value of email!"), {
        status: 400,
      });
    }

    if (type === "username" && !isValidUsername(user)) {
      return NextResponse.json(ClientErrorResponse(401, "invalid value of username!"), {
        status: 400,
      });
    }

    const query = type === "username" ? { username: user } : { email: user };

    // check if user already exist
    const userExist = await User.findOne(query);

    if (userExist) {
      return NextResponse.json(ClientErrorResponse(401, t("error_signup_401")), { status: 401 });
    }

    //has password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      name,
      password: hashedPassword,
      isAdmin: true,
      ...query,
    });

    const savedUser = await newUser.save();

    if (type === "email") {
      try {
        await sendEmail({
          email: user,
          emailType: EMAIL_TYPE.VERIFY_EMAIL,
          userId: savedUser._id,
          name,
          domain,
        });
      } catch (e) {
        console.log(e);
      }
    }

    return NextResponse.json(
      SuccessResponse({ ...savedUser._doc, password: undefined }, t("success_signup"))
    );
  };

  return await ServicesWrapper(request, signup, {
    reqBody,
    requiredBody: ["user", "password", "name"],
  });
}
