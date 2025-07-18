import { userServerApi } from "@/services/user";
import UserSection from "./components/user-section";
import { ServerDebug } from "./components/server-debug";

export default async function UserDemo() {
  const debugInfo = {
    env: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
  };

  try {
    const users = await userServerApi.getAll(60);

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
