import { connect } from "@/db/config";
import { NextRequest, NextResponse } from "next/server";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { LangType, translate } from "@/lang/lang";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import Grade from "@/models/gradeModel";
import { TokenDataType } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  const { t } = translate((request.cookies.get("Authorization")?.value as LangType) || "en");
  const reqBody = await request.json();
  const questionId = reqBody.questionId;
  const answer = reqBody.answer;

  const questionSubmit = async (tokenData: TokenDataType | undefined) => {
    const userGrade = await Grade.findOne({ userId: tokenData?.id, quizId: tokenData?.quizId });

    if (!userGrade) {
      return NextResponse.json(ClientErrorResponse(401, "Something wrong, please relogin."), {
        status: 401,
      });
    }
    const temporaryLastAnswerHistory = userGrade.lastAnswerHistory;
    const existingAnswers =
      temporaryLastAnswerHistory.answers?.filter((item: any) => item.questionId !== questionId) ||
      [];

    userGrade.lastAnswerHistory = {
      ...temporaryLastAnswerHistory,
      updatedAt: new Date(),
      attempt: userGrade.attempt + 1,
      answers: [...existingAnswers, { questionId, answer }],
    };

    userGrade.save();

    return NextResponse.json(SuccessResponse(userGrade.lastAnswerHistory), {
      status: 200,
    });
  };

  return await ServicesWrapper(request, questionSubmit, {
    authorization: true,
    roleAccess: "answer",
    reqBody,
    requiredBody: ["questionId", "answer"],
  });
}

export async function GET(request: NextRequest) {
  const questionSubmit = async (tokenData: TokenDataType | undefined) => {
    const userGrade = await Grade.findOne({ userId: tokenData?.id, quizId: tokenData?.quizId });

    if (!userGrade) {
      return NextResponse.json(ClientErrorResponse(401, "Something wrong, please relogin."), {
        status: 401,
      });
    }

    return NextResponse.json(SuccessResponse(userGrade.lastAnswerHistory), {
      status: 200,
    });
  };

  return await ServicesWrapper(request, questionSubmit, {
    authorization: true,
    roleAccess: "answer",
  });
}
