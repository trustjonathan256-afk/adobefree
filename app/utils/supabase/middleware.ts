import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a supabase client for middleware
  // Note: We cannot await 'cookies()' here, we use request.cookies
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
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ROUTE PROTECTION
  const path = request.nextUrl.pathname;

  // 1. Protect /admin routes
  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.email !== "trustjonathan.ug@gmail.com") {
      return NextResponse.redirect(
        new URL("/login?error=Unauthorized: Admin access only", request.url),
      );
    }
  }

  // 2. Redirect /login to /admin if already logged in as admin
  if (path === "/login" && user?.email === "trustjonathan.ug@gmail.com") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
