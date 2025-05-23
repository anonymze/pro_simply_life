import { Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import { NewConversation } from "@/components/new-conversation";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { NewGroup } from "@/components/new-group";
import { router } from "expo-router";
import { User } from "@/types/user";
import { cn } from "@/utils/cn";
import React from "react";


export default function Page() {
	return withQueryWrapper<User>(
		{
			queryKey: ["app-users"],
			queryFn: getAppUsersQuery,
		},
		({ data }) => {
			const [hasSelection, setHasSelection] = React.useState(false);
			const [nextStep, setNextStep] = React.useState(false);
			const scrollRef = React.useRef<ScrollView>(null);

			return (
				<BackgroundLayout className="p-4">
					<View className={cn("flex-row items-center justify-between bg-background pb-4 pt-4")}>
						<View className="w-24 p-2" >
							<TouchableOpacity onPress={() => {
								if (!nextStep) return router.back();
								setNextStep(false);
								scrollRef.current?.scrollTo({ y: 0, animated: true });
							}}>
								<Text className="font-semibold text-sm text-primary">
									{nextStep ? "Retour" : "Annuler"}
								</Text>
							</TouchableOpacity>
						</View>

						<Text className="font-bold text-lg">Nouveau groupe</Text>

						{!nextStep ? (
						<TouchableOpacity
							disabled={!hasSelection}
							className="w-24 items-end p-2"
							onPress={() => {
								setNextStep(true);
								scrollRef.current?.scrollToEnd({ animated: true });
							}}
						>
							<Text className={cn("font-semibold text-sm text-primary", !hasSelection && "text-primary/40")}>
								{nextStep ? "Créer" : "Suivant"}
								</Text>
							</TouchableOpacity>
						): (
							<View className="w-24 items-end p-2" />
						)}
					</View>
					<Content data={data.docs} scrollRef={scrollRef} onSelectionChange={setHasSelection} />
				</BackgroundLayout>
			);
		},
	)();
}

const Content = React.memo(
	({
		data,
		scrollRef,
		onSelectionChange,
	}: {
		data: User[];
		scrollRef: React.RefObject<ScrollView | null>;
		onSelectionChange: (hasSelection: boolean) => void;
	}) => (
		<ScrollView
			ref={scrollRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			scrollEnabled={false}
			decelerationRate={"fast"}
			contentContainerStyle={{ gap: 16 }}
		>
			<View style={{ width: Dimensions.get("window").width - 28 }}>
				<NewGroup data={data} onSelectionChange={onSelectionChange} />
			</View>
			<View style={{ width: Dimensions.get("window").width - 28 }}>
				<NewConversation />
			</View>
		</ScrollView>
	),
);
