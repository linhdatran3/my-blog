// app/api/debug-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    vercel: !!process.env.VERCEL,
    vercelUrl: !!process.env.VERCEL_URL,
    ci: process.env.CI,
    nodeEnv: process.env.NODE_ENV,
    nextPhase: process.env.NEXT_PHASE,
    timestamp: new Date().toISOString(),
  });
}
