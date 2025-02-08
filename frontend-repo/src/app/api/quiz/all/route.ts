import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/models/quizModel";
import { isEmpty } from "lodash";

connect();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = !isEmpty(searchParams.get("search")) ? searchParams.get("search") : "";
  const sort = !isEmpty(searchParams.get("sort"))
    ? (searchParams.get("sort") as "asc" | "desc")
    : "desc";
  const sortBy = !isEmpty(searchParams.get("sortBy"))
    ? (searchParams.get("sortBy") as string)
    : "createdAt";
  const size = !isEmpty(searchParams.get("size"))
    ? parseInt(searchParams.get("size") as string)
    : 10;
  const page = !isEmpty(searchParams.get("page"))
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const getQuizDetail = async (tokenData: TokenDataType | undefined) => {
    const skip = size * (page - 1);
    const quiz = await Quiz.find({
      userId: tokenData?.id,
    })
      .sort({ [sortBy]: sort })
      .or([
        { _id: { $regex: search, $options: "i" } },
        { quizName: { $regex: search, $options: "i" } },
      ])
      .limit(size)
      .skip(skip);

    if (!quiz.length) {
      return NextResponse.json(ClientErrorResponse(404, "Quiz not found"), { status: 404 });
    }

    return NextResponse.json(SuccessResponse(quiz), { status: 200 });
  };

  return await ServicesWrapper(request, getQuizDetail, {
    authorization: true,
    roleAccess: "admin",
  });
}
