import { userApi } from "@/services/user";
import { ENDPOINTS, getQueryKeyByEndpoint } from "@/utils/endpoints";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: getQueryKeyByEndpoint(ENDPOINTS.users),
    queryFn: userApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getQueryKeyByEndpoint(ENDPOINTS.users),
      }),
  });
}
