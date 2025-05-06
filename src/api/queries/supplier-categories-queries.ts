import { PaginatedResponse } from "@/types/response";
import { SupplierCategory } from "@/types/supplier";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getSupplierCategoriesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<SupplierCategory>>("/api/supplier-categories", { params: filters });
	return response.data;
}

export async function getSupplierCategoryQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, supplierCategoryId] = queryKey;
	const response = await api.get<SupplierCategory>(`/api/supplier-categories/${supplierCategoryId}`);
	return response.data;
}
