import { ICreateUser, IUser } from "@/types";
import { api, serverApi } from "./api";
import { ENDPOINTS } from "@/utils/endpoints";

// Client-side (hooks sẽ dùng)
export const userApi = {
  getAll: () => api.get<IUser[]>(ENDPOINTS.users),
  getById: (id: string) => {
    if (!id) throw new Error("User ID is required");
    return api.get<IUser>(`users/${id}`);
  },
  create: (data: ICreateUser) => {
    // Validation ở client
    if (!data.email || !data.name) {
      throw new Error("Email and name are required");
    }
    return api.post<ICreateUser>(ENDPOINTS.users, data);
  }, //   update: (id: string, data: UpdateUserInput) => api.put<IUser>(`users/${id}`, data),
  //   patch: (id: string, data: Partial<UpdateUserInput>) => api.patch<IUser>(`users/${id}`, data),
  delete: (id: string) => api.delete(`users/${id}`),
  search: (query: string) =>
    api.get<IUser[]>(`users?search=${encodeURIComponent(query)}`),
};

export const userServerApi = {
  getAll: async (revalidate?: number) => {
    try {
      console.log("Get all");
      const res = await serverApi.get<IUser[]>(ENDPOINTS.users, revalidate);
      return res;
    } catch (error) {
      console.log("error", error);
    }
  },
  getById: (id: string, revalidate?: number) =>
    serverApi.get<IUser>(`users/${id}`, revalidate),
};
