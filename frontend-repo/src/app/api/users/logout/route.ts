import { SuccessResponse, UnknownErrorResponse } from "@/helpers/responseApi";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const response = NextResponse.json(SuccessResponse(200, "Logout sucessfully."), {
      status: 200,
    });

    response.cookies.set("Session", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    response.cookies.set("Authorization", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(UnknownErrorResponse(error), { status: 500 });
  }
}
