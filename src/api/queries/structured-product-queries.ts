import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { StructuredProduct } from "@/types/structured-product";
import { api } from "../_config";

export async function getStructuredProductsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filter] = queryKey;
	const today = new Date().toISOString().split('T')[0];
	const response = await api.get<PaginatedResponse<StructuredProduct>>(`/api/structured`, {
		params: {
			where: {
				end_comm: {
					greater_than_equal: today
				}
			}
		}
	});
	return response.data;
}

export async function getStructuredProductQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, structuredId] = queryKey;
	const response = await api.get<StructuredProduct>(`/api/structured/${structuredId}`);
	return response.data;
}
