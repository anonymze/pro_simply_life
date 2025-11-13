import { queryClient } from "@/api/_queries";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import { getChatRoomQuery, updateChatRoomQuery } from "@/api/queries/chat-room-queries";
import { NewGroup } from "@/components/new-group";
import BackgroundLayout from "@/layouts/background-layout";
import { User } from "@/types/user";
import { cn } from "@/utils/cn";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import { getStorageUserInfos } from "@/utils/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const appUser = getStorageUserInfos();
	const { chat: chatId } = useLocalSearchParams();
	const { data: chatRoom } = useQuery({
		queryKey: ["chat-room", chatId],
		queryFn: getChatRoomQuery,
		enabled: !!chatId,
	});

	const initialSelectedIds = React.useMemo(
		() => new Set(chatRoom?.guests?.map((guest) => guest.id) ?? []),
		[chatRoom?.guests]
	);

	const [selectedIds, dispatch] = React.useReducer(selectionReducer, initialSelectedIds);

	if (!appUser) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Erreur</Text>
			</View>
		);
	}

	const { data, isError, isLoading } = useQuery({
		queryKey: ["app-users"],
		queryFn: getAppUsersQuery,
		select: (data) => data.docs.filter((user) => user.id !== appUser.user.id),
	});

	const mutationUpdate = useMutation({
		mutationFn: updateChatRoomQuery,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chat-room", chatId] });
			router.back();
			router.back();
		},
		onError: (error) => {
			Alert.alert("Erreur", "Une erreur inconnue est survenue.");
			router.back();
		},
	});

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Erreur</Text>
			</View>
		);
	}

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<View className={cn("flex-row items-center justify-between bg-background pb-4")}>
				<View className="w-24 p-2">
					<TouchableOpacity
						hitSlop={10}
						onPress={() => {
							return router.back();
						}}
					>
						<Text className="font-semibold text-sm text-backgroundChat">Annuler</Text>
					</TouchableOpacity>
				</View>

				<Text className="font-bold text-lg text-primary">Nouveau groupe</Text>

				<TouchableOpacity
					disabled={selectedIds.size === 0}
					className="w-24 items-end p-2"
					onPress={() => {
						mutationUpdate.mutate({
							chatRoomId: chatId as string,
							users: Array.from(selectedIds),
						});
					}}
				>
					<Text
						className={cn("font-semibold text-sm text-backgroundChat", selectedIds.size === 0 && "text-primary/40")}
					>
						Ajouter
					</Text>
				</TouchableOpacity>
			</View>

			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
				</View>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					decelerationRate={"fast"}
					contentContainerStyle={{ gap: 16 }}
				>
					<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
						<NewGroup data={data ?? []} dispatch={dispatch} selectedIds={selectedIds} />
					</View>
				</ScrollView>
			)}
		</BackgroundLayout>
	);
}

export type ActionReducer =
	| { type: "ADD"; ids: User["id"][] }
	| { type: "REMOVE"; ids: User["id"][] }
	| { type: "CLEAR" };

function selectionReducer(state: Set<User["id"]>, action: ActionReducer): Set<User["id"]> {
	const newSet = new Set(state);

	switch (action.type) {
		case "ADD":
			action.ids.forEach((id) => newSet.add(id));
			break;
		case "REMOVE":
			action.ids.forEach((id) => newSet.delete(id));
			break;
		case "CLEAR":
			newSet.clear();
			break;
	}

	return newSet;
}
