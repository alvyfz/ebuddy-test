import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/models/quizModel";
import getQuizId from "@/helpers/getQuizId";
import { getDocument, uploadDocument } from "@/helpers/documentHelper";
import en from "@/lang/en";
import nextConfig from "../../../../next.config";
import { isEmpty } from "lodash";

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  const addQuiz = async (tokenData: TokenDataType | undefined) => {
    const { quizName, members, attempt, coverImageId, startDate, endDate } = reqBody;

    const userId = tokenData?.id;
    const newQuiz = new Quiz({
      _id: getQuizId(),
      quizName,
      listOfMembers: members,
      userId,
      attempt: attempt ?? null,
      coverImageId: coverImageId ?? "",
      coverImageURL: coverImageId
        ? nextConfig?.env?.APPWRITE_STORAGE_ENDPOINT?.replace("<id>", coverImageId)
        : "",
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      userAttempt: [],
    });

    const savedQuiz = await newQuiz.save();

    return NextResponse.json(SuccessResponse(savedQuiz), { status: 200 });
  };

  return await ServicesWrapper(request, addQuiz, {
    authorization: true,
    requiredBody: ["quizName", "members"],
    reqBody: reqBody,
    roleAccess: "admin",
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const getQuizDetail = async (tokenData: TokenDataType | undefined) => {
    const quiz = await Quiz.findOne({ _id: id });
    if (!quiz) {
      return NextResponse.json(ClientErrorResponse(404, "Quiz not found"), { status: 404 });
    }

    if (!isEmpty(quiz.coverImageId) && isEmpty(quiz.coverImageURL)) {
      quiz.coverImageURL = nextConfig?.env?.APPWRITE_STORAGE_ENDPOINT?.replace(
        "<id>",
        quiz.coverImageId
      );
    }

    return NextResponse.json(SuccessResponse(quiz), { status: 200 });
  };

  return await ServicesWrapper(request, getQuizDetail, {
    authorization: true,
    requiredBody: ["id"],
    reqBody: { id },
    roleAccess: "all",
  });
}

export async function PUT(request: NextRequest) {
  const reqBody = await request.json();

  const updateQuiz = async (tokenData: TokenDataType | undefined) => {
    const { quizName, members, attempt, id } = reqBody;

    const getQuizById = await Quiz.findOne({ _id: id, userId: tokenData?.id });

    if (!getQuizById) {
      return NextResponse.json(ClientErrorResponse(404, "Quiz not found."), { status: 404 });
    }

    getQuizById.quizName = quizName;
    getQuizById.listOfMembers = members;
    getQuizById.attempt = attempt ?? null;
    getQuizById.updatedAt = new Date();

    const savedQuiz = await getQuizById.save();

    return NextResponse.json(SuccessResponse(savedQuiz), { status: 200 });
  };

  return await ServicesWrapper(request, updateQuiz, {
    authorization: true,
    requiredBody: ["quizName", "members", "id"],
    reqBody,
    roleAccess: "admin",
  });
}
