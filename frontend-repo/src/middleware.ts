import { NextResponse, NextRequest } from "next/server";

// const isTokenExpired = (token: string) => {
//   const decodedToken = JSON.parse(atob(token.split(".")[1]));
//   const currentTime = new Date().getTime() / 1000;

//   return decodedToken.exp < currentTime;
// };

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;
  // const lang = request.cookies.get("lang")?.value;
  // const isPublicPath = publicPath.includes(path);
  // const token = request.cookies.get("Authorization")?.value;
  // let decodedToken: any;
  // const uriLogin = [...answerRolePath, "/join"].includes(path) ? "/join" : "/login?expiry=true";

  // if (token) {
  //   decodedToken = JSON.parse(atob(token.split(".")[1]));
  // }

  // // set default language
  // if (!lang) {
  //   request.cookies.set("lang", "en");
  // }

  // // check if user is already logged in and trying to access login and password page
  // if (isPublicPath && token) {
  //   const uriHome = decodedToken && decodedToken?.role === "answer" ? "/join/quiz" : "/dashboard";

  //   console.log("isPublickPath", uriHome);
  //   return NextResponse.redirect(new URL(uriHome, request.nextUrl));
  // }

  // // check if token is expired
  // if (!isPublicPath && token) {
  //   if (isTokenExpired(token)) {
  //     const response = NextResponse.redirect(new URL(uriLogin, request.nextUrl));
  //     response.cookies.delete("Authorization");
  //     return response;
  //   }
  // }

  // // check if user is not logged in and trying to access private page
  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL(uriLogin, request.nextUrl));
  // }

  // if (decodedToken && decodedToken?.role === "answer") {
  //   if (!answerRolePath.includes(path)) {
  //     console.log(path, "this 404 answer role");
  //     return NextResponse.redirect(new URL("/404", request.nextUrl));
  //   }
  // }

  // if (decodedToken && decodedToken?.role === "admin") {
  //   if (answerRolePath.includes(path)) {
  //     return NextResponse.redirect(new URL("/404", request.nextUrl));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/profile", "/quiz/:path*", "/dashboard", "/join/:path*"],
};

const answerRolePath = ["/join/quiz", "/join/quiz/question"];

const publicPath = ["/login", "/signup", "/join"];
