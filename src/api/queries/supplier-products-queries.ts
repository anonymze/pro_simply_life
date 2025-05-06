import { PaginatedResponse } from "@/types/response";
import { SupplierProduct } from "@/types/supplier";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getSupplierProductsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<SupplierProduct>>("/api/supplier-products", { params: filters });
	return response.data;
}

export async function getSupplierProductQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, supplierProductId] = queryKey;
	const response = await api.get<SupplierProduct>(`/api/supplier-products/${supplierProductId}`);
	return response.data;
}
