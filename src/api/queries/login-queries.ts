import { AppUser } from "@/types/user";

import { api } from "../_config";


export async function loginQuery({ email, password, expoPushToken }: { email: string; password: string; expoPushToken: string | null }) {
	const response = await api.post<AppUser>("/api/app-users/login", { email, password, expoPushToken });
	return response.data;
}

export async function forgotPasswordQuery(email: string) {
  const response = await api.post("/api/app-users/forgot-password", { email });
  return response.data;
}
