import { PaginatedResponse } from "@/types/response";
import { Reservation } from "@/types/reservation";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getReservationsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Reservation>>("/api/reservations", { params: filters });
	return response.data;
}

export async function getReservation({ queryKey }: { queryKey: QueryKey }) {
	const [, reservationId] = queryKey;
	const response = await api.get<Reservation>(`/api/reservations/${reservationId}`);
	return response.data;
}

export async function createReservation(params: Omit<Reservation, "id" | "createdAt" | "updatedAt"> ) {
	const response = await api.post("/api/reservations", {
		...params,
		app_user: params.app_user.id,
	});
	return response.data;
}