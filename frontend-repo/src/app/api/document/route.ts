import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { ClientErrorResponse, SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/models/quizModel";
import getQuizId from "@/helpers/getQuizId";
import { getDocument, uploadDocument } from "@/helpers/documentHelper";
import en from "@/lang/en";

connect();

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const uploadFile = async (tokenData: TokenDataType | undefined) => {
    const file: any = formData.get("file");
    if (!file) {
      return NextResponse.json(ClientErrorResponse(400, "No files reveived."), { status: 400 });
    }
    const upload = await uploadDocument(file);

    return NextResponse.json(SuccessResponse(upload.$id), { status: 200 });
  };

  return await ServicesWrapper(request, uploadFile, {
    authorization: true,
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;

  const getFile = async (tokenData: TokenDataType | undefined) => {
    const file = await getDocument(id);

    if (!file) {
      return NextResponse.json(ClientErrorResponse(404, "Document not found"), { status: 404 });
    }

    return NextResponse.json(SuccessResponse(file), { status: 200 });
  };

  return await ServicesWrapper(request, getFile, {
    authorization: true,
    requiredBody: ["id"],
    reqBody: { id },
  });
}
