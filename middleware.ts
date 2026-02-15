import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);

  const token = request.cookies.get("token")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

//   if (token && isLoginPage) {
//     return NextResponse.redirect(new URL("/qc", request.url));
//   }

  return NextResponse.next();
}

// 👇 ใส่ตรงนี้
export const config = {
  matcher: ["/:path*"],
};
