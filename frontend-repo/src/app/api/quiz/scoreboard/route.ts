import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/models/quizModel";
import { isEmpty } from "lodash";
import Grade from "@/models/gradeModel";

connect();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const quizId = searchParams.get("quizId");

  const sort = !isEmpty(searchParams.get("sort"))
    ? (searchParams.get("sort") as "asc" | "desc")
    : "desc";
  const sortBy = !isEmpty(searchParams.get("sortBy"))
    ? (searchParams.get("sortBy") as string)
    : "finalScore";

  const getQuizDetail = async (tokenData: TokenDataType | undefined) => {
    const grades = await Grade.find({
      quizId,
      isDeleted: false,
    })
      .select("-lastAnswerHistory -__v -createdAt -updatedAt -isDeleted")
      .sort({ [sortBy]: sort });

    if (!grades.length) {
      return NextResponse.json(ClientErrorResponse(404, "Scoreboard not found"), { status: 404 });
    }

    return NextResponse.json(SuccessResponse(grades), { status: 200 });
  };

  return await ServicesWrapper(request, getQuizDetail, {
    authorization: true,
    roleAccess: "admin",
    reqBody: { quizId },
    requiredBody: ["quizId"],
  });
}
