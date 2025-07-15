import { userServerApi } from "@/services/user";
import UserSection from "./components/user-section";

export default async function UserDemo() {
  const users = await userServerApi.getAll(60); // cache 60s

  return <UserSection users={users?.data ?? []} />;
}
