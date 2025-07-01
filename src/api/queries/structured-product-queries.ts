import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { StructuredProduct } from "@/types/structured-product";
import { api } from "../_config";

export async function getStructuredProductsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const response = await api.get<PaginatedResponse<StructuredProduct>>(`/api/structured`);
	return response.data;
}
