import { NextResponse, NextRequest } from "next/server";

const isTokenExpired = (token: string) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTime = new Date().getTime() / 1000;

  return decodedToken.exp < currentTime;
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const lang = request.cookies.get("lang")?.value;
  const isPublicPath = publicPath.includes(path);
  const token = request.cookies.get("Authorization")?.value;
  let decodedToken: any;

  if (token) {
    decodedToken = JSON.parse(atob(token.split(".")[1]));
  }

  // check if user is already logged in and trying to access login and password page
  if (isPublicPath && token) {
    const pathDashboard = "/dashboard";

    return NextResponse.redirect(new URL(pathDashboard, request.nextUrl));
  }

  // check if token is expired
  if (!isPublicPath && token) {
    if (isTokenExpired(token)) {
      const response = NextResponse.redirect(new URL("/login", request.nextUrl));
      response.cookies.delete("Authorization");
      return response;
    }
  }

  // check if user is not logged in and trying to access private page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard"],
};

const publicPath = ["/login"];
