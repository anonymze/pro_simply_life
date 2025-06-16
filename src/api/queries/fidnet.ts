import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Fidnet } from "@/types/fidnet";

import { api } from "../_config";


export async function getFidnetsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Fidnet>>("/api/fidnet", { params: filters });
	return response.data;
}

export async function getFidnetQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, fidnetId] = queryKey;
	const response = await api.get<Fidnet>(`/api/fidnet/${fidnetId}`);
	return response.data;
}
