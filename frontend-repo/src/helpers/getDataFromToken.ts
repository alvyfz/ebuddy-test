import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type TokenDataType = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "answer";
  quizId?: string;
  username?: string;
};

export const getDataFromToken = (request: NextRequest): TokenDataType => {
  try {
    const token = request.cookies.get("Authorization")?.value || "";
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN as string) as TokenDataType;

    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
