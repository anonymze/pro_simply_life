import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { Sport } from "@/types/sport";
import { api } from "../_config";

export async function getSportsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const response = await api.get<PaginatedResponse<Sport>>(`/api/sports`);
	return response.data;
}

export async function getSportsCategoryQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const response = await api.get<Sport[]>(`/api/sports`);
	return response.data;
}

export async function getSportQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, sportId] = queryKey;
	const response = await api.get<Sport>(`/api/sports/${sportId}`);
	return response.data;
}
