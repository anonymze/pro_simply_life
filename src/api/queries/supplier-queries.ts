import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Supplier } from "@/types/supplier";

import { api } from "../_config";

export async function getSuppliersQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Supplier>>("/api/suppliers", { params: filters });
	return response.data;
}
