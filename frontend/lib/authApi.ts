import api from "./api";
import { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types";

interface ApiWrapper<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<ApiWrapper<AuthResponse>>("/auth/login", payload);
    return res.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<ApiWrapper<AuthResponse>>("/auth/register", payload);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  user: async (): Promise<User> => {
    const res = await api.get<ApiWrapper<User>>("/auth/user");
    return res.data.data;
  },

  refresh: async (): Promise<void> => {
    await api.post("/auth/refresh");
  },
};
