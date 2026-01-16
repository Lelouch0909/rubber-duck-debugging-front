import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
    const isPublicFile = req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/);

    const isPublicRoute = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/c/");

    // Allow auth API routes, public files, and public routes
    if (isApiAuthRoute || isPublicFile || isPublicRoute) {
        return NextResponse.next();
    }

    // Redirect to signin if not logged in
    if (!isLoggedIn) {
        const signInUrl = new URL("/api/auth/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
