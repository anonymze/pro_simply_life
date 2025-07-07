import { Supplier } from "@/types/supplier";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";

// export async function getSuppliersQuery({ queryKey }: { queryKey: QueryKey }) {
// 	const [, filters] = queryKey;
// 	const response = await api.get<PaginatedResponse<Supplier>>("/api/suppliers", { params: filters });
// 	return response.data;
// }

export async function getSupplierQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, supplierId] = queryKey;
	const response = await api.get<Supplier>(`/api/suppliers/${supplierId}`);
	return response.data;
}
