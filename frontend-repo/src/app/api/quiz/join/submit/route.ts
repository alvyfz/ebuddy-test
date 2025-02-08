import { connect } from "@/db/config";
import { NextRequest, NextResponse } from "next/server";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import Grade from "@/models/gradeModel";
import { TokenDataType } from "@/helpers/getDataFromToken";
import Question from "@/models/questionModel";
import Quiz from "@/models/quizModel";

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const questionId = reqBody.questionId;
  const answer = reqBody.answer;

  const questionSubmit = async (tokenData: TokenDataType | undefined) => {
    const [userGrade, questions]: any[] = await Promise.all([
      Grade.findOne({ userId: tokenData?.id, quizId: tokenData?.quizId }),
      Question.find({ quizId: tokenData?.quizId, isDeleted: false }),
    ]);

    let isErrorQuestion = false;
    let finalScore = 0;

    if (!userGrade || !questions) {
      return NextResponse.json(ClientErrorResponse(401, "Something wrong, please relogin."), {
        status: 401,
      });
    }

    const temporaryLastAnswerHistory = userGrade.lastAnswerHistory;
    const existingAnswers = temporaryLastAnswerHistory?.answers.filter(
      (item: any) => item.questionId !== questionId
    );

    const finalAnswer = [...existingAnswers, { questionId, answer }];

    if (finalAnswer.length !== questions.length) {
      return NextResponse.json(
        ClientErrorResponse(401, "Your answers doesnt match with the Questions."),
        {
          status: 401,
        }
      );
    }

    const result = finalAnswer.map((item) => {
      const question = questions.find((q: any) => q._id.toString() === item.questionId);
      if (!question) {
        isErrorQuestion = true;
        return;
      }

      let isCorrect = true;

      if (question.answerKey.length !== item.answer.length) {
        isCorrect = false;
      }

      item.answer.forEach((answer: string) => {
        if (!question.answerKey.includes(answer)) {
          isCorrect = false;
        }
      });

      if (isCorrect) {
        finalScore++;
      }

      return {
        questionId: item.questionId,
        answer: item.answer,
        isCorrect,
      };
    });

    if (isErrorQuestion) {
      return NextResponse.json(
        ClientErrorResponse(401, "Your answers doesnt match with the Questions."),
        {
          status: 401,
        }
      );
    }

    userGrade.finalScore = (finalScore / questions.length) * 100;
    userGrade.attempt = userGrade.attempt + 1;
    userGrade.answers = result;
    userGrade.lastAnswerHistory = { updatedAt: new Date(), answers: [], attempt: null };

    userGrade.save();

    const quiz = await Quiz.findOne({ _id: tokenData?.quizId });

    quiz.userAttempts = [
      ...quiz.userAttempts,
      { userId: tokenData?.id, attempt: userGrade.attempt, username: tokenData?.username },
    ];

    return NextResponse.json(SuccessResponse(userGrade), {
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
