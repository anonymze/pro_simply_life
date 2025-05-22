import { deleteChatRoomQuery, getChatRoomsQuery } from "@/api/queries/chat-room-queries";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { getMessagesQuery } from "@/api/queries/message-queries";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { LockIcon, PlusIcon } from "lucide-react-native";
import { FlatList } from "react-native-gesture-handler";
import EmployeesIcon from "@/components/emloyees-icon";
import MessagesIcon from "@/components/messages-icon";
import { PaginatedResponse } from "@/types/response";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { getStorageUserInfos } from "@/utils/store";
import * as ContextMenu from "zeego/context-menu";
import { HrefObject, Link } from "expo-router";
import { userHierarchy } from "@/types/user";
import { queryClient } from "@/api/_queries";
import Title from "@/components/ui/title";
import { ChatRoom } from "@/types/chat";
import { logout } from "@/utils/auth";
import config from "tailwind.config";
import { Image } from "expo-image";
import React from "react";


export const MAX_MESSAGES = 25;

export default function Page() {
	return withQueryWrapper<ChatRoom>(
		{
			queryKey: ["chat-rooms"],
			queryFn: getChatRoomsQuery,
		},
		({ data }) => {
			const userInfos = React.useMemo(() => getStorageUserInfos(), []);
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
				<BackgroundLayout className="pt-safe">
					<View className="flex-row items-center justify-between px-4">
						<Title title="Messages" />
						{userHierarchy[userInfos?.user?.role ?? "visitor"] < 1 && (
							<Link href="/chat/new-room" asChild>
								<TouchableOpacity className="rounded-full bg-primaryUltraLight p-2.5">
									<PlusIcon size={18} color={config.theme.extend.colors.primary} />
								</TouchableOpacity>
							</Link>
						)}
					</View>
					<FlatList
						className="px-4 pt-5"
						showsVerticalScrollIndicator={false}
						data={data.docs}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => {
							if (userHierarchy[userInfos?.user?.role ?? "visitor"] < 1) {
								return (
									<DropdownMenu.Root>
										{/* @ts-expect-error */}
										<DropdownMenu.Trigger action="longpress">
											<Card
												icon={<EmployeesIcon color={config.theme.extend.colors.secondaryDark} />}
												title={item.name}
												description={item.description ?? ""}
												link={{
													pathname: "/chat/[chat]",
													params: { chat: item.id, title: item.name },
												}}
											/>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Item key="delete" onSelect={() => mutationChatRoom.mutate(item.id)}>
												<DropdownMenu.ItemTitle>Supprimer</DropdownMenu.ItemTitle>
												<DropdownMenu.ItemIcon
													// androidIconName="arrow_down_float"
													ios={{
														name: "trash",
														pointSize: 18,
														paletteColors: [
															{
																dark: "red",
																light: "red",
															},
														],
													}}
												/>
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								);
							}

							return (
								<Card
									icon={<MessagesIcon color={config.theme.extend.colors.secondaryDark} />}
									title={item.name}
									description={item.description ?? ""}
									link={{
										pathname: "/chat/[chat]",
										params: { chat: item.id, title: item.name },
									}}
								/>
							);
						}}
						// contentInsetAdjustmentBehavior="automatic"
						contentContainerStyle={{
							gap: 10,
							paddingBottom: 16,
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
				</BackgroundLayout>
			);
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

const Card = ({
	link,
	icon,
	title,
	description,
}: {
	link: HrefObject;
	icon: any;
	title: string;
	description: string;
}) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-full bg-secondaryLight">{icon}</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-dark">{title}</Text>
					<Text className="text-sm text-defaultGray">{description}</Text>
				</View>
				<View className="mr-3 size-5 items-center justify-center rounded-full bg-primary">
					<Text className="font-semibold text-xs text-white">1</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
};
