import { PaginatedResponse, SuccessCreateResponse } from "@/types/response";
import { APIOmittedParams } from "@/types/payload";
import { QueryKey } from "@tanstack/react-query";
import { ChatRoom } from "@/types/chat";
import { User } from "@/types/user";

import { api } from "../_config";


export async function getChatRoomsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<ChatRoom>>("/api/chat-rooms", {
		params: {
			limit: 0,
		},
	});
	return response.data;
}

export async function getChatRoomQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, chatRoomId] = queryKey;
	const response = await api.get<ChatRoom>(`/api/chat-rooms/${chatRoomId}`);
	return response.data;
}

export async function createChatRoomQuery(
	params: Pick<ChatRoom, "name" | "description" | "color"> & { app_user: User["id"]; guests: User["id"][] },
) {
	const response = await api.post<SuccessCreateResponse<ChatRoom>>("/api/chat-rooms", params);
	return response.data;
}

export async function deleteChatRoomQuery(chatRoomId: ChatRoom["id"]) {
	const response = await api.delete(`/api/chat-rooms/${chatRoomId}`);
	return response.data;
}

export async function leaveChatRoomQuery({
	chatRoomId,
	userId,
}: {
	chatRoomId: ChatRoom["id"];
	userId: User["id"];
}) {
	const response = await api.delete(`/api/chat-rooms/leave/${chatRoomId}/${userId}`);
	return response.data;
}

export async function updateChatRoomQuery({
	chatRoomId,
	users,
}: {
	chatRoomId: ChatRoom["id"];
	users: User["id"][];
}) {
	const response = await api.patch(`/api/chat-rooms/${chatRoomId}/add`, {
	  users
	});
	return response.data;
}
