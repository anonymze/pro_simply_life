import { PaginatedResponse } from "@/types/response";
import { ContactCategory } from "@/types/contact";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";

export async function getContactCategoriesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<ContactCategory>>("/api/contact-categories", { params: filters });
	return response.data;
}
