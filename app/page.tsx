import { userApi } from "@/services/user";
import UserSection from "./components/user-section";

export default async function UserDemo() {
  try {
    const users = await userApi.getAll();

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
