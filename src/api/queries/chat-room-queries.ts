import { PaginatedResponse, SuccessCreateResponse } from "@/types/response";
import { APIOmittedParams } from "@/types/payload";
import { QueryKey } from "@tanstack/react-query";
import { ChatRoom } from "@/types/chat";

import { api } from "../_config";

export async function getChatRoomsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<ChatRoom>>("/api/chat-rooms", { params: filters });
	return response.data;
}

export async function createChatRoomQuery(params: APIOmittedParams<ChatRoom>) {
	const response = await api.post<SuccessCreateResponse<ChatRoom>>("/api/chat-rooms", params);
	return response.data;
}

export async function deleteChatRoomQuery(chatRoomId: ChatRoom["id"]) {
	const response = await api.delete(`/api/chat-rooms/${chatRoomId}`);
	return response.data;
}
