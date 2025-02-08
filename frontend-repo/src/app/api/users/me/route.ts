import { connect } from "@/db/config";
import { TokenDataType } from "@/helpers/getDataFromToken";
import { SuccessResponse } from "@/helpers/responseApi";
import { ServicesWrapper } from "@/helpers/ServicesWrapper";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  const getUserData = async (tokenData: TokenDataType | undefined) => {
    const userId = tokenData?.id;
    const userData = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json(SuccessResponse(userData), { status: 200 });
  };

  return await ServicesWrapper(request, getUserData, { authorization: true });
}
