export const ENDPOINTS = {
  users: "/users",
};

export const getQueryKeyByEndpoint = (endpoint: string) => {
  return endpoint.split("/") ?? [];
};
