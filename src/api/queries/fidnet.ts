import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Fidnet } from "@/types/fidnet";

import { api } from "../_config";


export async function getFidnetQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Fidnet>>("/api/fidnet", { params: filters });
	return response.data;
}
