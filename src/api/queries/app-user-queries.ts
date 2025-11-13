import { PaginatedResponse } from "@/types/response";
import { User, UserContact } from "@/types/user";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";

export async function getAppUsersQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, role] = queryKey;
	const response = await api.get<PaginatedResponse<User>>("/api/app-users", {
		params: {
			where: {
				role: {
					equals: role,
				},
			},
			// disable pagination
			limit: 0,
		},
	});
	return response.data;
}

export async function getAppUsersContactsQuery({ queryKey }: { queryKey: QueryKey }) {
	const response = await api.get<PaginatedResponse<UserContact>>("/api/app-users/contacts");
	return response.data;
}

export async function getAppUserQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, userId] = queryKey;
	const response = await api.get<User>(`/api/app-users/${userId}`);
	return response.data;
}

export async function updateAppUserToken(userId: User["id"] | undefined, token: User["notifications_token"]) {
	const response = await api.post(`/api/app-users/update-token`, { userId, token });
	return response.data;
}
