import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";
import { isEmpty } from "lodash";
import id from "@/lang/id";

connect();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get("type") as "all" | "one") ?? "one";
  const id = searchParams.get("id");
  const quizId = searchParams.get("quizId");

  const deleteQuestion = async (tokenData: TokenDataType | undefined) => {
    if ((type === "one" && isEmpty(id)) || (type === "all" && isEmpty(quizId))) {
      return NextResponse.json(ClientErrorResponse(401, "Invalid Request body."), {
        status: 401,
      });
    }

    let response = null;

    if (type === "one") {
      response = await Question.deleteOne({ _id: id });
    }

    if (type === "all") {
      response = await Question.deleteMany({ quizId: quizId, isDeleted: true });
    }

    return NextResponse.json(SuccessResponse(response), { status: 200 });
  };

  return await ServicesWrapper(request, deleteQuestion, {
    authorization: true,
    requiredBody: ["type"],
    reqBody: { type },
    roleAccess: "admin",
  });
}
