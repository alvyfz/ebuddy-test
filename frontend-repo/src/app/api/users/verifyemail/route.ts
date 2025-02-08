import { ClientErrorResponse, SuccessResponse, UnknownErrorResponse } from "@/helpers/responseApi";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  try {
    const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return NextResponse.json(ClientErrorResponse(403, "Invalid token."), { status: 403 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(SuccessResponse(undefined, "Email success verify."), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(UnknownErrorResponse(error), { status: 500 });
  }
}
