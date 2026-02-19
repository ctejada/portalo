import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SYSTEM_PREFIXES = ["/dashboard", "/login", "/signup", "/api", "/_next", "/favicon", "/sitemap", "/robots", "/manifest", "/sw"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Handle @username URLs: rewrite /@username to /username for Next.js routing
  // Case-insensitive match with lowercase normalization
  if (/^\/@[a-zA-Z0-9-]+$/.test(path)) {
    const username = path.slice(2).toLowerCase();
    return NextResponse.rewrite(new URL(`/${username}`, request.url));
  }

  // Redirect old bare /slug URLs to /@slug (301 for SEO)
  if (
    !SYSTEM_PREFIXES.some((p) => path.startsWith(p)) &&
    path !== "/" &&
    /^\/[a-z0-9-]+$/.test(path)
  ) {
    return NextResponse.redirect(
      new URL(`/@${path.slice(1)}`, request.url),
      301
    );
  }

  // Auth middleware for dashboard and auth pages
  const response = NextResponse.next({ request: { headers: request.headers } });

  if (
    path.startsWith("/dashboard") ||
    path === "/login" ||
    path === "/signup"
  ) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users away from dashboard
    if (!user && path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from auth pages
    if (user && (path === "/login" || path === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/((?!api|_next|static|favicon|sitemap|robots|manifest|sw).*)",
  ],
};
