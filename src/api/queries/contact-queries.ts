import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Contact } from "@/types/contact";

import { api } from "../_config";

export async function getContactsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Contact>>("/api/contacts", { params: filters });
	return response.data;
}
