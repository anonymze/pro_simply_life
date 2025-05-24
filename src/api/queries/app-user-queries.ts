import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { User } from "@/types/user";

import { api } from "../_config";


export async function getAppUsersQuery({ queryKey }: { queryKey: QueryKey }) {
	const [,] = queryKey;
	const response = await api.get<PaginatedResponse<User>>("/api/app-users", {
		params: {
			// where: {
			// 	id: {
			// 		not_equals: appUserId,
			// 	},
			// },
			// disable pagination
			limit: 0
		},
	});
	return response.data;
}

export async function getAppUserQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, userId] = queryKey;
	const response = await api.get<User>(`/api/app-users/${userId}`);
	return response.data;
}
