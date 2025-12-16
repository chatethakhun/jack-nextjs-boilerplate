
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";


const SIGN_IN_URL = '/auth/sign-in'



export default async function middleware(request: NextRequest) {

  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(en|th)/, "") || "/";

  const session = await auth()
  // ดึง locale จาก pathname หรือใช้ default

  console.log({ session })

  // มี session แล้วเข้า login/signup → redirect ไป apps
  if (
    session &&
    (pathnameWithoutLocale === SIGN_IN_URL || pathnameWithoutLocale === "/auth/sign-up")
  ) {
    return NextResponse.redirect(new URL(`/apps`, request.url));
  }

  // Protected routes ต้อง login
  if (
    !session &&
    (pathnameWithoutLocale.startsWith("/apps") ||
      pathnameWithoutLocale.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(th|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};