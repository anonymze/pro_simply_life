import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Commission } from "@/types/commission";

import { api } from "../_config";


export async function getCommissionsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Commission>>("/api/commission", { params: filters });
	return response.data;
}

export async function getCommissionQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, commissionId] = queryKey;
	const response = await api.get<Commission>(`/api/commission/${commissionId}`);
	return response.data;
}
