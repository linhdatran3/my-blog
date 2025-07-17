// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Tạo response
  const response = NextResponse.next();

  // Danh sách các domain được phép
  const allowedOrigins = [
    "https://my-blog-pearl-alpha.vercel.app",
    "https://my-blog.vercel.app",
    "http://localhost:3000",
  ];

  const origin = request.headers.get("origin");

  // Kiểm tra origin có trong danh sách cho phép không
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Hoặc cho phép tất cả origins (không khuyến khích cho production)
  // response.headers.set('Access-Control-Allow-Origin', '*')

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  // Xử lý preflight request
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: response.headers });
  }

  return response;
}

// Cấu hình matcher - áp dụng cho các route nào
export const config = {
  matcher: [
    // Áp dụng cho tất cả API routes
    "/api/:path*",
    // Hoặc chỉ áp dụng cho specific routes
    // '/api/users/:path*',
    // '/api/posts/:path*',
  ],
};
