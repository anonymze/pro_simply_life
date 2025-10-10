import { QueryKey } from "@tanstack/react-query";

import { PaginatedResponse } from "@/types/response";
import { Selection } from "@/types/selection";
import { api } from "../_config";

export async function getSelectionsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const response = await api.get<PaginatedResponse<Selection>>(`/api/selection/`, {
		params: filter,
	});
	return response.data;
}
