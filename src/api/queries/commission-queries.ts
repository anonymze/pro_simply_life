import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Commission } from "@/types/commission";

import { api } from "../_config";

export async function getCommissionsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, userId] = queryKey;

	const response = await api.get<PaginatedResponse<Commission>>("/api/commissions", {
		params: {
			where: {
				app_user: {
					equals: userId,
				},
			},
			limit: 0,
		},
	});

	console.log(response.data);
	return response.data;
}

export async function getCommissionQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, commissionId] = queryKey;
	const response = await api.get<Commission>(`/api/commissions/${commissionId}`);
	return response.data;
}
