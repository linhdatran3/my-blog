// app/api/test-db/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test connection
    await prisma.$connect();

    // Count users
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: "Connected successfully",
      userCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: error,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
