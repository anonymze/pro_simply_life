import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { AppUser } from "@/types/user";

import { api } from "../_config";


export async function getAppUsersQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<AppUser>>("/api/app-users", { params: filters });
	return response.data;
}
