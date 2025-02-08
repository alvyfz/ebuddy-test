import { connect } from "@/db/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import jwt from "jsonwebtoken";
import { LangType, translate } from "@/lang/lang";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import Quiz from "@/models/quizModel";
import Grade from "@/models/gradeModel";
import { encryptAES } from "@/helpers/cryptoAES";

connect();

export async function POST(request: NextRequest) {
  const { t } = translate((request.cookies.get("Authorization")?.value as LangType) || "en");
  const reqBody = await request.json();

  const login = async () => {
    const { user, name, quizId } = reqBody;

    let userExist;
    const quiz = await Quiz.findOne({ _id: quizId });

    if (!quiz) {
      return NextResponse.json(ClientErrorResponse(401, "Quiz not found."), {
        status: 401,
      });
    }

    if (
      quiz.isDeleted ||
      !quiz.isQuestionCreated ||
      (quiz.startDate &&
        quiz.endDate &&
        (new Date(quiz.startDate) > new Date() || new Date(quiz.endDate) < new Date()))
    ) {
      return NextResponse.json(ClientErrorResponse(401, "Quiz is not available."), {
        status: 401,
      });
    }

    if (quiz.listOfMembers.length > 0 && !quiz.listOfMembers.includes(user)) {
      return NextResponse.json(
        ClientErrorResponse(
          401,
          "You are not allowed to join this quiz. Please enter the username as registered in the quiz."
        ),
        {
          status: 401,
        }
      );
    }

    // check if user already exist
    userExist = await User.findOne({ usernameAnswered: user, quizId });

    if (!userExist) {
      userExist = await new User({
        usernameAnswered: user,
        name,
        quizId,
      });
    } else {
      userExist.name = name;
    }

    quiz.userJoins.push({ username: user, userId: userExist._id, joinAt: new Date() });

    await quiz.save();
    userExist = await userExist.save();

    const userGrade = await Grade.findOne({ userId: userExist._id, quizId });

    if (!userGrade) {
      const newGrade = await new Grade({
        userId: userExist._id,
        quizId: quizId,
        username: user,
        grade: null,
        isDeleted: false,
        attempt: 0,
      });
      newGrade.save();
    }

    //  create token data
    const tokenData = {
      id: userExist._id,
      name: userExist.name,
      username: userExist.usernameAnswered,
      quizId: userExist.quizId,
      role: "answer",
    };

    const encryptData = encryptAES(JSON.stringify(tokenData));

    const token = await jwt.sign(tokenData, process.env.SECRET_TOKEN as string, {
      expiresIn: "5h",
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

  return await ServicesWrapper(request, login, {
    reqBody,
    requiredBody: ["user", "name", "quizId"],
  });
}
