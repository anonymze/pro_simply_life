import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import { NewConversation } from "@/components/new-conversation";
import { NewGroup } from "@/components/new-group";
import BackgroundLayout from "@/layouts/background-layout";
import { User } from "@/types/user";
import { cn } from "@/utils/cn";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import { getStorageUserInfos } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import config from "tailwind.config";

export default function Page() {
    const insets = useSafeAreaInsets();
	const appUser = getStorageUserInfos();
	const [selectedIds, dispatch] = React.useReducer(selectionReducer, new Set());
	const [nextStep, setNextStep] = React.useState(false);
	const scrollRef = React.useRef<ScrollView>(null);

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

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Erreur</Text>
			</View>
		);
	}

	return (
	<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" && "pt-0")} style={{ paddingTop: insets.top }}>
			<View className={cn("flex-row items-center justify-between bg-background pb-4")}>
				<View className="w-24 p-2">
					<TouchableOpacity
						hitSlop={10}
						onPress={() => {
							if (!nextStep) return router.back();
							setNextStep(false);
							scrollRef.current?.scrollTo({ y: 0, animated: true });
						}}
					>
						<Text className="font-semibold text-sm text-backgroundChat">{nextStep ? "Retour" : "Annuler"}</Text>
					</TouchableOpacity>
				</View>

				<Text className="font-bold text-lg text-primary">Nouveau groupe</Text>

				{!nextStep ? (
					<TouchableOpacity
						disabled={selectedIds.size === 0}
						className="w-24 items-end p-2"
						onPress={() => {
							setNextStep(true);
							scrollRef.current?.scrollToEnd({ animated: true });
						}}
					>
						<Text
							className={cn("font-semibold text-sm text-backgroundChat", selectedIds.size === 0 && "text-primary/40")}
						>
							{nextStep ? "Créer" : "Suivant"}
						</Text>
					</TouchableOpacity>
				) : (
					<View className="w-24 items-end p-2" />
				)}
			</View>
			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
				</View>
			) : (
				<ScrollView
					scrollViewRef={scrollRef as React.RefObject<ScrollView>}
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					decelerationRate={"fast"}
					contentContainerStyle={{ gap: 16 }}
				>
					<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
						<NewGroup data={data ?? []} dispatch={dispatch} selectedIds={selectedIds} />
					</View>
					<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
						<NewConversation currentUser={appUser.user} selectedIds={Array.from(selectedIds)} />
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
