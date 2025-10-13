import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import { Dimensions, ScrollView, Text, View } from "react-native";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardEmployee from "@/components/card/card-employee";
import BackgroundLayout from "@/layouts/background-layout";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
// import { Picker } from "@expo/ui/swift-ui";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import React from "react";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import { FlashList } from "@shopify/flash-list";
import { User } from "@/types/user";


export default function Page() {
	const { role } = useLocalSearchParams();
	const scrollRef = React.useRef<ScrollView>(null);

	const { data } = useQuery({
		queryKey: ["app-users", role],
		queryFn: getAppUsersQuery,
		enabled: !!role,
	});

	if (!data) return null;

	// sort and group users by first letter for FlashList sections
	const groupedUsers = React.useMemo(() => {
		const sorted = data.docs?.slice().sort((a, b) => a.firstname.localeCompare(b.firstname, "fr")) || [];

		const grouped = sorted.reduce(
			(acc, user) => {
				const letter = user.firstname[0].toUpperCase();
				if (!acc[letter]) acc[letter] = [];
				acc[letter].push(user);
				return acc;
			},
			{} as Record<string, User[]>,
		);

		return grouped;
	}, [data]);

	// Flatten grouped users into a single array with section headers
	const flattenedData = React.useMemo(() => {
		const items: ({ type: "header"; letter: string } | { type: "user"; user: User })[] = [];

		Object.keys(groupedUsers).forEach((letter) => {
			items.push({ type: "header", letter });
			groupedUsers[letter].forEach((user) => {
				items.push({ type: "user", user });
			});
		});

		return items;
	}, [groupedUsers]);

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
				ref={scrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEnabled={false}
				decelerationRate={"fast"}
				contentContainerStyle={{ gap: 16 }}
			>
				<View style={{ width: SCREEN_DIMENSIONS.width - 28, flex: 1 }}>
					<FlashList
						data={flattenedData}
						estimatedItemSize={80}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
						renderItem={({ item }) => {
							if (item.type === "header") {
								return (
									<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{item.letter}</Text>
								);
							}

							return (
								<View className="mb-2">
									<CardEmployee
										icon={
											<ImagePlaceholder
												contentFit="cover"
												placeholder={item.user?.photo?.blurhash}
												placeholderContentFit="cover"
												source={item.user?.photo?.url}
												style={{ width: 56, height: 56, borderRadius: 5 }}
											/>
										}
										user={item.user}
										link={{
											pathname: "/organigramme/role/organigramme/[organigramme]",
											params: {
												role,
												organigramme: item.user.id,
											},
										}}
									/>
								</View>
							);
						}}
						getItemType={(item) => item.type}
					/>
				</View>
				<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
					<Text>En cours de développement</Text>
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}
