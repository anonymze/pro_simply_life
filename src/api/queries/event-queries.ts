import { Event, EventStatus } from "@/types/event";
import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

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

export async function getEventStatusQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<EventStatus>(`/api/agency-life-status`, { params: filters });
	return response.data;
}

export async function createEventStatusQuery(params: Pick<EventStatus, "app_user" | "agency_life" | "status">) {
	const response = await api.post("/api/messages", {
		app_user: params.app_user,
		agency_life: params.agency_life,
		status: params.status,
	});
	return response.data;
}
