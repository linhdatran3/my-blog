export function isBuildTime(): boolean {
  // Vercel build vs runtime check
  if (process.env.VERCEL) {
    // Nếu có VERCEL_URL = đang runtime, không phải build
    if (process.env.VERCEL_URL) {
      console.log("🚀 Vercel runtime detected, making API calls");
      return false;
    } else {
      console.log("🔧 Vercel build detected, skipping API calls");
      return true;
    }
  }

  // CI environments
  if (
    (process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true") &&
    process.env.NODE_ENV !== "test"
  ) {
    console.log("🔧 CI build detected, skipping API calls");
    return true;
  }

  return false;
}
