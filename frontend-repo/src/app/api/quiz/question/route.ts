import { isValidEmail } from "@/helpers/utils";
import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";
import { isEmpty } from "lodash";
import Quiz from "@/models/quizModel";
import id from "@/lang/id";
import { encryptAES } from "@/helpers/cryptoAES";

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  const addQuestion = async (tokenData: TokenDataType | undefined) => {
    const userId = tokenData?.id;

    let isErrorValidation = false;

    const quizId = reqBody[0].quizId;

    if (reqBody === 0) {
      isErrorValidation = true;
    } else {
      reqBody?.forEach((question: any) => {
        if (
          isEmpty(question.quizId) ||
          isEmpty(question.question) ||
          isEmpty(question.answerKey) ||
          isEmpty(question.questionType) ||
          !question.timeLimit ||
          quizId !== question.quizId
        ) {
          isErrorValidation = true;
          return;
        }

        question.options?.forEach((option: any) => {
          if (isEmpty(option.optionLabel) || isEmpty(option.optionId)) {
            isErrorValidation = true;
            return;
          }
        });
      });

      if (isErrorValidation) {
        return NextResponse.json(ClientErrorResponse(401, "Invalid Request body."), {
          status: 401,
        });
      }

      const getQuizById = await Quiz.findOne({ _id: quizId, userId });

      if (!getQuizById) {
        return NextResponse.json(ClientErrorResponse(404, "Quiz not found."), {
          status: 404,
        });
      }

      const newQuestions = await Question.insertMany(reqBody);

      getQuizById.isQuestionCreated = true;

      await getQuizById.save();

      return NextResponse.json(SuccessResponse(newQuestions), { status: 200 });
    }
  };
  return await ServicesWrapper(request, addQuestion, {
    authorization: true,
    roleAccess: "admin",
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let quizId = searchParams.get("quizId");

  const getQuestion = async (tokenData: TokenDataType | undefined) => {
    quizId = quizId || (tokenData?.quizId as string);
    if (!quizId) {
      return NextResponse.json(ClientErrorResponse(401, "Invalid Request body."), {
        status: 401,
      });
    }
    let question;
    if (tokenData?.role === "answer") {
      question = await Question.find({ quizId: quizId, isDeleted: false }).select(
        "-answerKey -isDeleted -__v"
      );
    } else {
      question = await Question.find({ quizId: quizId, isDeleted: false });
    }

    if (isEmpty(question)) {
      return NextResponse.json(ClientErrorResponse(404, "Question not found"), { status: 404 });
    }

    let questions: any[] | string = question;

    if (tokenData?.role === "answer") {
      questions = encryptAES(JSON.stringify(question));
    }

    return NextResponse.json(SuccessResponse(questions), { status: 200 });
  };

  return await ServicesWrapper(request, getQuestion, {
    authorization: true,
  });
}

export async function PUT(request: NextRequest) {
  const reqBody = await request.json();

  const addQuestion = async (tokenData: TokenDataType | undefined) => {
    const userId = tokenData?.id;

    let isErrorValidation = false;

    const quizId = reqBody[0].quizId;

    if (reqBody === 0) {
      isErrorValidation = true;
    } else {
      reqBody?.forEach((question: any) => {
        if (
          isEmpty(question.quizId) ||
          isEmpty(question.question) ||
          isEmpty(question.answerKey) ||
          isEmpty(question.questionType) ||
          !question.timeLimit ||
          quizId !== question.quizId
        ) {
          isErrorValidation = true;
          return;
        }

        question.options?.forEach((option: any) => {
          if (isEmpty(option.optionLabel) || isEmpty(option.optionId)) {
            isErrorValidation = true;
            return;
          }
        });
      });

      if (isErrorValidation) {
        return NextResponse.json(ClientErrorResponse(401, "Invalid Request body."), {
          status: 401,
        });
      }

      const getQuizById = await Quiz.findOne({ _id: quizId, userId });

      if (!getQuizById) {
        return NextResponse.json(ClientErrorResponse(404, "Quiz not found."), {
          status: 404,
        });
      }

      let updatedQuestions: any = [];

      let deletedQuestions: any = [];

      const newInsertedQuestions = reqBody.map((question: any) => ({
        quizId: question.quizId,
        question: question.question,
        questionType: question.questionType,
        options: question.options,
        answerKey: question.answerKey,
        timeLimit: question.timeLimit,
        isDeleted: false,
      }));

      try {
        deletedQuestions = await Question.updateMany(
          { quizId: quizId },
          { isDeleted: true },
          { multi: true }
        );
        updatedQuestions = await Question.insertMany(newInsertedQuestions);
      } catch (err) {
        return NextResponse.json(ClientErrorResponse(500, "Internal Server Error"), {
          status: 500,
        });
      }

      return NextResponse.json(SuccessResponse({ newUpdated: updatedQuestions }), { status: 200 });
    }
  };
  return await ServicesWrapper(request, addQuestion, {
    authorization: true,
    roleAccess: "admin",
  });
}
