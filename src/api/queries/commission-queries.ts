import { Commission, CommissionMonthlyData } from "@/types/commission";
import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

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

	return response.data;
}

export async function getCommissionMonthlyDataQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, userId] = queryKey;

	const response = await api.get<CommissionMonthlyData>(`/api/commissions/extra/${userId}`);

	return response.data;
}

export async function getCommissionQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, commissionId] = queryKey;
	const response = await api.get<Commission>(`/api/commissions/${commissionId}`);
	return response.data;
}
