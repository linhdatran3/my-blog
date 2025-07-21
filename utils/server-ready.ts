// utils/server-ready.ts
export function isServerReady(): boolean {
  if (typeof window !== "undefined") {
    // Client-side: check headers từ middleware
    const meta = document.querySelector('meta[name="server-ready"]');
    return meta?.getAttribute("content") === "true";
  }

  // Server-side: luôn return true vì middleware đã handle
  return true;
}

export async function waitForApiReady(
  endpoint: string,
  maxAttempts: number = 3,
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}`
    : "http://localhost:3000";

  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`🔄 Checking API readiness: ${endpoint} (attempt ${i + 1})`);

      const response = await fetch(`${baseUrl}/api/health`, {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      if (response.ok) {
        console.log(`✅ API ready on attempt ${i + 1}`);
        return true;
      }
    } catch (error) {
      console.log(`❌ API check failed (attempt ${i + 1}):`, error);
    }

    // Progressive delay: 500ms, 1000ms, 2000ms
    if (i < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }

  console.warn(`⚠️ API not ready after ${maxAttempts} attempts`);
  return false;
}
