import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import CardEmployee from "@/components/card/card-employee";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
// import { Picker } from "@expo/ui/swift-ui";
import Title from "@/components/ui/title";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import React from "react";
import config from "tailwind.config";

export default function Page() {
	const { role } = useLocalSearchParams();
	const scrollRef = React.useRef<ScrollView>(null);

	const { data } = useQuery({
		queryKey: ["app-users", role],
		queryFn: getAppUsersQuery,
		enabled: !!role,
	});

	if (!data) return null;

	// sort and group suppliers by first letter
	const groupedUsers = React.useMemo(
		() =>
			data.docs
				?.slice()
				.sort((a, b) => a.firstname.localeCompare(b.firstname, "fr"))
				.reduce(
					(acc, user) => {
						const letter = user.firstname[0].toUpperCase();
						if (!acc[letter]) acc[letter] = [];
						acc[letter].push(user);
						return acc;
					},
					{} as Record<string, typeof data.docs>,
				),
		[data],
	);

	return (
		<BackgroundLayout className="px-4">
			<View className="iems-center flex-row justify-between">
				<Title title={role === "employee" ? "Staff" : "Indépendants"} />
				{/* <Picker
					style={{
						width: 150,
						alignSelf: "center",
						marginTop: 8,
					}}
					variant="segmented"
					options={["Liste", "Carte"]}
					selectedIndex={null}
					onOptionSelected={({ nativeEvent: { index } }) => {
						if (index === 0) {
							scrollRef.current?.scrollTo({ x: 0, animated: true });
						} else {
							scrollRef.current?.scrollToEnd();
						}
					}}
				/> */}
			</View>

			<ScrollView
				scrollViewRef={scrollRef as React.RefObject<ScrollView>}
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEnabled={false}
				decelerationRate={"fast"}
				contentContainerStyle={{ gap: 16 }}
			>
				<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						style={{ backgroundColor: config.theme.extend.colors.background }}
						contentContainerStyle={{ paddingBottom: 16 }}
					>
						<View className="mt-2 gap-2">
							{Object.keys(groupedUsers!).map((letter) => (
								<View key={letter} className="gap-2">
									<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{letter}</Text>
									{groupedUsers?.[letter].map((user) => (
										<CardEmployee
											icon={
												<ImagePlaceholder
													contentFit="cover"
													placeholder={user?.photo?.blurhash}
													placeholderContentFit="cover"
													source={user?.photo?.url}
													style={{ width: 56, height: 56, borderRadius: 5 }}
												/>
											}
											key={user.id}
											user={user}
											link={{
												pathname: "/organigramme/role/organigramme/[organigramme]",
												params: {
													role,
													organigramme: user.id,
												},
											}}
										/>
									))}
								</View>
							))}
						</View>
					</ScrollView>
				</View>
				<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
					<Text>En cours de développement</Text>
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}
