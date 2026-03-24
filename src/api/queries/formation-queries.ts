import { Formation } from "@/types/formations";
import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";

export async function getFormationsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Formation>>("/api/formations", { params: filters });
	return response.data;
}
