import { isEmpty } from "lodash";

export const errorCheckRequiredReqBody = (reqBody: any, requiredBody: string[]) => {
  const error: string[] = [];
  requiredBody.forEach((key) => {
    if (isEmpty(reqBody[key]) && !Array.isArray(reqBody[key]) && typeof reqBody[key] !== "number") {
      error.push(key);
    }
  });
  return error.length > 0 ? `Missing required fields: ${error.join(", ")}` : null;
};
