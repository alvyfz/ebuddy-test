import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/models/quizModel";

connect();

export async function GET(request: NextRequest) {
  const update = async (tokenData: TokenDataType | undefined) => {
    // const quizez = await Quiz.updateMany({}, { isQuestionCreated: false }, { multi: true });
    // console.log(quizez);
    // return NextResponse.json(SuccessResponse(quizez), { status: 200 });
  };

  return await ServicesWrapper(request, update, {
    authorization: false,
  });
}
