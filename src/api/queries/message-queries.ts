import { Message, MessageOptimistic } from "@/types/chat";
import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";

export async function getMessagesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, chatId, maxMessages] = queryKey;

	// be careful it's a custom route, so it will not handle every params
	const response = await api.get<PaginatedResponse<Message>>("/api/messages/by-room", {
		params: {
			where: {
				chat_room: {
					equals: chatId,
				},
			},
			sort: "-createdAt",
			limit: maxMessages,
		},
	});

	return response.data.docs;
}

export async function createMessageQuery(params: MessageOptimistic) {
	const response = await api.post("/api/messages", {
		app_user: params.app_user.id,
		chat_room: params.chat_room,
		message: params.message,
		file: params.file,
	});
	return response.data;
}

// use fetch for file upload polyfill
export const createMessageWithFilesQuery = async ({ file, app_user, chat_room }: MessageOptimistic) => {
	const formData = new FormData();

	if (!file) throw new Error("No file provided");

	file.forEach((file) => {
		formData.append("file", {
			uri: file?.uri,
			name: file?.fileName ?? "file.jpg",
			type: file?.mimeType ?? "image/jpeg",
		} as any);
	});

	formData.append("app_user", app_user.id);
	formData.append("chat_room", chat_room);

	const response = await fetch((process.env.EXPO_PUBLIC_API_URL || "") + "/api/messages/with-file", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) throw new Error(await response.text());
	return response.json();
};
