import { userServerApi } from "@/services/user";
import UserSection from "./components/user-section";
import { serverLog } from "./api/debug/route";
import { ServerDebug } from "./components/server-debug";

export default async function UserDemo() {
  serverLog("🔍 Starting UserDemo");

  serverLog("Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  });

  const debugInfo = {
    env: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
  };

  try {
    serverLog("📞 Calling userServerApi.getAll()");

    const users = await userServerApi.getAll();

    serverLog("📊 API response:", {
      hasUsers: !!users,
      dataLength: users?.data?.length,
      type: typeof users,
      keys: Object.keys(users || {}),
    });

    return (
      <>
        <UserSection users={users?.data ?? []} />
        <ServerDebug data={debugInfo} label="Environment" />
        <ServerDebug data={users} label="API Response" />
      </>
    );
  } catch (error) {
    console.error("❌ Error in server component:", error);
    return (
      <>
        <UserSection users={[]} />
        <ServerDebug data={debugInfo} label="Environment" />
        <ServerDebug
          data={{ error: (error as { message: string }).message }}
          label="Error"
        />
      </>
    );
  }
}
