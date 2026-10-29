import { QueryKey } from "@tanstack/react-query";

import { FinancingCredit } from "@/types/financing-credit";
import { PaginatedResponse } from "@/types/response";
import { api } from "../_config";

export async function getFinancingCreditsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const response = await api.get<PaginatedResponse<FinancingCredit>>("/api/financing-credit", {
		params: filter,
	});
	return response.data;
}
