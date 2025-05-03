import { deleteChatRoomQuery, getChatRoomsQuery } from "@/api/queries/chat-room-queries";
import { ChevronRightIcon, LockIcon, TrashIcon } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { getMessagesQuery } from "@/api/queries/message-queries";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { FlatList } from "react-native-gesture-handler";
import { PaginatedResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import { getStorageUserInfos } from "@/utils/store";
import { userHierarchy } from "@/types/user";
import { queryClient } from "@/api/_queries";
import { ChatRoom } from "@/types/chat";
import { Link } from "expo-router";
import React from "react";


export const MAX_MESSAGES = 25;

export default function Page() {
	return withQueryWrapper<ChatRoom>(
		{
			queryKey: ["chat-rooms"],
			queryFn: getChatRoomsQuery,
		},
		({ data }) => {
			const userInfos = getStorageUserInfos();
			const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
			const mutationChatRoom = useMutation({
				mutationFn: deleteChatRoomQuery,
				// when mutate is called:
				onMutate: async (chatRoomId) => {
					// cancel any outgoing refetches
					// (so they don't overwrite our optimistic update)
					await queryClient.cancelQueries({ queryKey: ["chat-rooms"] });

					// snapshot the previous value
					const previousChatRooms = queryClient.getQueryData(["chat-rooms"]);

					// optimistically update to the new value
					queryClient.setQueryData(["chat-rooms"], (old: PaginatedResponse<ChatRoom>) => {
						return {
							...old,
							docs: old.docs.filter((chatRoom) => chatRoom.id !== chatRoomId),
						};
					});

					// return old messages before optimistic update for the context in onError
					return previousChatRooms;
				},
				// if the mutation fails,
				// use the context returned from onMutate to roll back
				onError: (err, chatRoomId, context) => {
					queryClient.setQueryData(["chat-rooms"], context);
				},
				// always refetch after error or success:
				onSettled: () => queryClient.invalidateQueries({ queryKey: ["chat-rooms"] }),
			});

			const prefetchMessages = React.useCallback(async (chatId: string) => {
				await queryClient.prefetchQuery({
					queryKey: ["messages", chatId, MAX_MESSAGES],
					queryFn: getMessagesQuery,
				});
			}, []);

			return (
				<React.Fragment>
					<FlatList
						data={data.docs}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View className="flex-row items-center justify-between gap-4">
								{userHierarchy[userInfos?.user?.role!] < 1 && (
									<TouchableOpacity
										onPress={() => {
											Alert.alert(
												i18n[languageCode]("CHAT_ROOM_DELETE"),
												i18n[languageCode]("CHAT_ROOM_DELETE_CONFIRMATION"),
												[
													{ text: i18n[languageCode]("CANCEL"), style: "cancel" },
													{
														text: i18n[languageCode]("DELETE"),
														style: "destructive",
														onPress: () => mutationChatRoom.mutate(item.id),
													},
												],
											);
										}}
									>
										<TrashIcon size={24} color="#000" />
									</TouchableOpacity>
								)}
								<Link
									href={{
										pathname: "/chat/[chat]",
										params: { chat: item.id },
									}}
									className="flex-1"
								>
									<View className="w-full flex-row items-center justify-between gap-4 rounded-xl bg-black p-5">
										<ItemTitleAndDescription name={item.name} description={item.description} private={item.private} />
										<ChevronRightIcon size={24} color="#fff" />
									</View>
								</Link>
							</View>
						)}
						contentInsetAdjustmentBehavior="automatic"
						contentContainerStyle={{
							gap: 20,
							padding: 20,
						}}
						onViewableItemsChanged={({ viewableItems }) => {
							// prefetch messages for visible chat rooms
							for (const item of viewableItems) {
								if (!item.isViewable) continue;
								prefetchMessages(item.item.id);
							}
						}}
						viewabilityConfig={{
							itemVisiblePercentThreshold: 75, // item is considered visible when 75% visible
						}}
					/>
				</React.Fragment>
			);

			// <LegendList
			// 		initialScrollIndex={data.docs.length - 1}
			// 		alignItemsAtEnd={true}
			// 		data={data.docs}
			// 		renderItem={({ item }) => (
			// 			<Link
			// 				style={{ marginTop: 20 }}
			// 				href={{
			// 					pathname: "/chat/[chat]",
			// 					params: { chat: item.id },
			// 				}}
			// 			>
			// 				<View
			// 					style={{
			// 						gap: 6,
			// 						padding: 16,
			// 						width: "100%",
			// 						borderRadius: 16,
			// 						alignItems: "center",
			// 						flexDirection: "row",
			// 						backgroundColor: "#000",
			// 						justifyContent: "space-between",
			// 					}}
			// 				>
			// 					<ItemTitleAndDescription name={item.name} description={item.description} private={item.private} />
			// 					<ChevronRightIcon size={24} color="#fff" />
			// 				</View>
			// 			</Link>
			// 		)}
			// 		estimatedItemSize={data.docs.length}
			// 		keyExtractor={(item) => item.id}
			// 		recycleItems={false}
			// 		maintainScrollAtEnd={true}
			// 		maintainScrollAtEndThreshold={0.1}
			// 		contentInsetAdjustmentBehavior="automatic"
			// 		contentContainerStyle={{ padding: 20 }}
			// 	/>
		},
	)();
}

function ItemTitle({ name, private: isPrivate }: Pick<ChatRoom, "name" | "private">) {
	return (
		<View className="flex-row items-center gap-4">
			<Text className="text-lg text-white">{name}</Text>
			{isPrivate && <LockIcon size={20} color="#fff" />}
		</View>
	);
}

function ItemTitleAndDescription({
	name,
	description,
	private: isPrivate,
}: Pick<ChatRoom, "name" | "description" | "private">) {
	return (
		<View className="flex-shrink gap-2">
			<ItemTitle name={name} private={isPrivate} />
			<Text className="flex-shrink text-sm text-white">{description}</Text>
		</View>
	);
}
