import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Event } from "@/types/event";

import { api } from "../_config";


export async function getEventsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Event>>("/api/agency-life", { params: filters });
	return response.data;
}

export async function getEventQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, eventId] = queryKey;
	const response = await api.get<Event>(`/api/agency-life/${eventId}`);
	return response.data;
}
