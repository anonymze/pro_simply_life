import { Supplier } from "@/types/supplier";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";
import { PaginatedResponse } from "@/types/response";


export async function getSupplierQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, supplierId] = queryKey;
	const response = await api.get<Supplier>(`/api/suppliers/${supplierId}`);
	return response.data;
}

export async function getSuppliersSelectionQuery({ queryKey }: { queryKey: QueryKey }) {
  const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Supplier>>(`/api/suppliers/selection`, {
		params: filters,
	});
	return response.data;
}
