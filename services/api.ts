import { ApiResponse } from "@/types";
// import { isBuildTime } from "@/utils/function";
import { waitForApiReady } from "@/utils/server-ready";
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = (() => {
  // Build time - skip
  // if (isBuildTime()) return "";

  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: luôn dùng absolute URL
    if (process.env.NODE_ENV === "production") {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return "http://localhost:3000";
  }

  // Client-side
  return "";
})();

// Base fetch function
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // if (isBuildTime()) {
  //   // Validate endpoint exists in our API
  //   // validateEndpoint(endpoint);

  //   // Log for monitoring
  //   console.warn(`⚠️ BUILD-TIME SKIP: ${endpoint}`);

  //   // Return typed fallback
  //   // return createValidatedFallback<T>(endpoint);
  //   return {} as T;
  // }

  const url = `${BASE_URL}/api${endpoint}`;

  // Nếu server-side, check API readiness trước
  if (typeof window === "undefined") {
    const isReady = await waitForApiReady(endpoint);
    if (!isReady) {
      console.warn(
        `⚠️ Proceeding with API call despite readiness check failure`,
      );
    }
  }

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
        errorData,
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
  get: async <T>(endpoint: string, revalidate?: number) => {
    console.warn("🔄 Server API call:", endpoint);

    const options: RequestInit = {
      method: "GET",
      cache: revalidate ? undefined : "no-store",
    };

    if (revalidate) {
      options.next = { revalidate };
    }

    // Retry logic với exponential backoff
    let lastError: Error;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await fetchAPI<ApiResponse<T>>(endpoint, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `❌ Server API attempt ${attempt} failed:`,
          lastError.message,
        );

        if (attempt < 3) {
          const delay = 1000 * attempt; // 1s, 2s
          console.warn(`⏳ Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  },
};
