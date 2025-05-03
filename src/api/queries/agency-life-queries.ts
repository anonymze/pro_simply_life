import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { AgencyLife } from "@/types/agency-life";

import { api } from "../_config";


export async function getAgencyLifeQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<AgencyLife>>("/api/agency-life", { params: filters });
	return response.data;
}
