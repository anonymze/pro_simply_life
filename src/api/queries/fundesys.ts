import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Fundesys } from "@/types/fundesys";

import { api } from "../_config";


export async function getFundesysesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Fundesys>>("/api/fundesys", { params: filters });
	return response.data;
}

export async function getFundesysQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, fundesysId] = queryKey;
	const response = await api.get<Fundesys>(`/api/fundesys/${fundesysId}`);
	return response.data;
}
