import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken, TokenDataType } from "./getDataFromToken";
import { ClientErrorResponse, UnknownErrorResponse } from "./responseApi";
import { errorCheckRequiredReqBody } from "./errorCheckRequiredReqBody";

export const ServicesWrapper = async (
  request: NextRequest,
  promise: (tokenData: TokenDataType | undefined) => any,
  optional?: {
    authorization?: boolean;
    requiredBody?: string[];
    reqBody?: { [key: string]: any };
    roleAccess?: "all" | "admin" | "answer";
  }
) => {
  let tokenData: any;
  const access = optional?.roleAccess || "all";
  if (optional?.authorization) {
    try {
      tokenData = getDataFromToken(request);
    } catch (error: any) {
      return NextResponse.json(ClientErrorResponse(403, "Unauthorized access."), { status: 403 });
    }
  }

  if (optional?.authorization && access === "admin" && tokenData?.role === "answer") {
    return NextResponse.json(ClientErrorResponse(403, "Unauthorized access."), { status: 403 });
  }

  if (optional?.authorization && access === "answer" && tokenData?.role === "admin") {
    return NextResponse.json(ClientErrorResponse(403, "Unauthorized access."), { status: 403 });
  }

  if (!optional?.reqBody && optional?.requiredBody) {
    throw new Error("reqBody is required when requiredBody is provided.");
  }

  if (optional?.requiredBody && optional?.reqBody) {
    const error = errorCheckRequiredReqBody(optional?.reqBody, optional.requiredBody);
    if (error) {
      return NextResponse.json(ClientErrorResponse(400, error), { status: 400 });
    }
  }

  try {
    return await promise(tokenData);
  } catch (error: any) {
    return NextResponse.json(UnknownErrorResponse(error), { status: 500 });
  }
};
