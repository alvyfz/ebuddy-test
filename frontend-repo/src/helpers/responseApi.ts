export const UnknownErrorResponse = (err: any) => ({
  isSuccess: false,
  message: err?.message || "Unknown error.",
  code: err?.code || err?.status || 500,
});

export const ClientErrorResponse = (code: number, message: string) => ({
  isSuccess: false,
  message: message,
  code: code,
});

export const SuccessResponse = (payload: any, message?: string) => ({
  isSuccess: true,
  message: message || "success",
  payload,
  code: 200,
});
