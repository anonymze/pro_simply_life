import { QueryKey } from "@tanstack/react-query";

import { PrivateEquity } from "@/types/private-equity";
import { PaginatedResponse } from "@/types/response";
import { api } from "../_config";

export async function getPrivateEquitiesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const response = await api.get<PaginatedResponse<PrivateEquity>>(`/api/private-equity`, {
		params: filter,
	});
	return response.data;
}

export async function getPrivateEquityQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, privateEquityId] = queryKey;
	const response = await api.get<PrivateEquity>(`/api/private-equity/${privateEquityId}`);
	return response.data;
}
