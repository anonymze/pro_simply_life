import { PaginatedResponse } from "@/types/response";
import { SupplierProduct } from "@/types/supplier";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getSupplierProductsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<SupplierProduct>>("/api/supplier-products", { params: filters });
	return response.data;
}
