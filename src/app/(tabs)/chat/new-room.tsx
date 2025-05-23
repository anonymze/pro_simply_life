import { Text, View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import { NewConversation } from "@/components/new-conversation";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { NewGroup } from "@/components/new-group";
import { useQuery } from "@tanstack/react-query";
import { AppUser, User } from "@/types/user";
import { Link } from "expo-router";
import { cn } from "@/utils/cn";
import React from "react";


export default function Page() {
	return withQueryWrapper<User>(
		{
			queryKey: ["app-users"],
			queryFn: getAppUsersQuery,
		},
		({ data }) => {
			const [nextStep, setNextStep] = React.useState(false);
			const scrollRef = React.useRef<ScrollView>(null);

			return (
				<BackgroundLayout className="p-4">
					<View className={cn("flex-row items-center justify-between bg-background pb-4 pt-4")}>
						<Link className="w-24 p-2" dismissTo href="../" asChild>
							<TouchableOpacity>
								<Text className="font-semibold text-sm text-primary">Annuler</Text>
							</TouchableOpacity>
						</Link>

						<Text className="font-bold text-lg">Nouveau groupe</Text>
						<TouchableOpacity
							disabled={true}
							className="w-24 items-end p-2"
							onPress={() => {
								if (nextStep) {
									// router.push(sheet.link);
								} else {
									setNextStep(true);
									scrollRef.current?.scrollToEnd({ animated: true });
								}
							}}
						>
							<Text className={cn("font-semibold text-sm text-primary", true && "text-primary/40")}>
								{nextStep ? "Suivant" : "Créer"}
							</Text>
						</TouchableOpacity>
					</View>
					<ScrollView
						ref={scrollRef}
						horizontal
						showsHorizontalScrollIndicator={false}
						scrollEnabled={false}
						decelerationRate={"fast"}
						contentContainerStyle={{ gap: 16 }}
					>
						<View style={{ width: Dimensions.get("window").width - 28 }}>
							<NewGroup data={data.docs} />
						</View>
						<View style={{ width: Dimensions.get("window").width - 28 }}>
							<NewConversation />
						</View>
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}
