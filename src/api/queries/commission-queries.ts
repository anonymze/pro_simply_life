import { CommissionMonthlyAndYearlyData } from "@/types/commission";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";

// export async function getCommissionsQuery({ queryKey }: { queryKey: QueryKey }) {
// 	const [, userId] = queryKey;

// 	const response = await api.get<PaginatedResponse<Commission>>("/api/commissions", {
// 		params: {
// 			where: {
// 				app_user: {
// 					equals: userId,
// 				},
// 			},
// 			limit: 0,
// 		},
// 	});

// 	return response.data;
// }

export async function getCommissionMonthlyAndYearlyDataQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, userId] = queryKey;

	const response = await api.get<CommissionMonthlyAndYearlyData>(`/api/commissions/extra/${userId}`);

	return response.data;
}

// export async function getCommissionQuery({ queryKey }: { queryKey: QueryKey }) {
// 	const [, commissionId] = queryKey;
// 	const response = await api.get<Commission>(`/api/commissions/${commissionId}`);
// 	return response.data;
// }
