import { ApiResponse } from "@/types";
import { isBuildTime } from "@/utils/function";
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = (() => {
  // Build time - skip
  if (isBuildTime()) return "";

  // Production
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL}`
      : "https://my-blog-pearl-alpha.vercel.app/";
  }

  console.log(
    "process.env.NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL
  );
  console.log("process.env.VERCEL_URL", process.env.VERCEL_URL);

  // Development
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
})();

// Base fetch function
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (isBuildTime()) {
    // Validate endpoint exists in our API
    // validateEndpoint(endpoint);

    // Log for monitoring
    console.warn(`⚠️ BUILD-TIME SKIP: ${endpoint}`);

    // Return typed fallback
    // return createValidatedFallback<T>(endpoint);
    return {} as T;
  }

  const url = `${BASE_URL}/api${endpoint}`;
  console.log(`🌐 Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new ApiError(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    // Log for monitoring/debugging
    console.error(`🚨 API Error [${endpoint}]:`, {
      error: error instanceof Error ? error.message : error,
      status: error instanceof ApiError ? error.status : undefined,
      timestamp: new Date().toISOString(),
      endpoint,
      options,
    });

    // Re-throw để components có thể handle
    if (error instanceof ApiError) {
      throw error;
    }

    // Network/other errors
    throw new ApiError("Network error or server unavailable");
  }
}

// Export simple functions
export const api = {
  // Generic functions
  get: <T>(endpoint: string) => fetchAPI<ApiResponse<T>>(endpoint),
  post: <T>(endpoint: string, data: T) =>
    fetchAPI<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: T) =>
    fetchAPI<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: T) =>
    fetchAPI<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) => fetchAPI<void>(endpoint, { method: "DELETE" }),
};

// Server-side với caching
export const serverApi = {
  get: <T>(endpoint: string, revalidate?: number) => {
    // KHÔNG check isBuildTime() trong server API calls
    console.log("🔄 Server API call:", endpoint);
    const options: RequestInit = { method: "GET" };
    if (revalidate) {
      options.next = { revalidate };
    } else {
      options.cache = "no-store";
    }
    return fetchAPI<ApiResponse<T>>(endpoint, options);
  },
};
