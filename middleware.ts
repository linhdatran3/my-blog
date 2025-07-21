// middleware.ts (ở root của project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const serverStartTime = Date.now();
const WARMUP_DELAY = 2000; // 2 seconds

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware cho API routes, static files, và internal Next.js routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/__nextjs")
  ) {
    return NextResponse.next();
  }

  // Check if server has warmed up enough
  const serverUptime = Date.now() - serverStartTime;
  const isServerReady = serverUptime > WARMUP_DELAY;

  const response = NextResponse.next();

  // Add headers để components có thể check
  response.headers.set("x-server-ready", String(isServerReady));
  response.headers.set("x-server-uptime", String(serverUptime));
  response.headers.set("x-timestamp", new Date().toISOString());

  // Nếu server chưa ready và là page request, delay thêm
  if (!isServerReady && !pathname.startsWith("/api/")) {
    console.log(`⏳ Server warming up, adding delay...`);

    // Delay thêm để server ready
    await new Promise((resolve) =>
      setTimeout(resolve, WARMUP_DELAY - serverUptime),
    );

    response.headers.set("x-server-ready", "true");
    response.headers.set("x-warmup-applied", "true");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
