export enum PATH_API {
  SIGNUP = "/api/users/signup",
  LOGIN = "/api/users/login",
  LOGOUT = "/api/users/logout",
  DETAIL_USER = "/api/users/me",
  QUIZ = "/api/quiz",
  ALL_QUIZ = "/api/quiz/all",
  DOCUMENT = "/api/document",
  QUESTION = "/api/quiz/question",
  DELETE_QUESTION = "/api/quiz/question/delete",
  JOIN_QUIZ = "/api/quiz/join",
  JOIN_QUIZ_HISTORY = "/api/quiz/join/history",
  VERIFY_EMAIL = "/api/users/verifyemail",
  JOIN_QUIZ_SUBMIT = "/api/quiz/join/submit",
}

export enum METHOD {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
}
