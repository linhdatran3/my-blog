import { userServerApi } from "@/services/user";
import UserSection from "./components/user-section";

export default async function UserDemo() {
  console.log("🔍 Server component executing...");

  try {
    const users = await userServerApi.getAll(60);

    console.log("📊 Server API response:", {
      users: users,
      dataLength: users?.data?.length,
      hasData: !!users?.data,
      type: typeof users,
    });

    return <UserSection users={users?.data ?? []} />;
  } catch (error) {
    console.error("❌ Error in server component:", error);
    return <UserSection users={[]} />;
  }
}
