import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import CardEmployee from "@/components/card/card-employee";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
// import { Picker } from "@expo/ui/swift-ui";
import Title from "@/components/ui/title";
import { LegendList } from "@legendapp/list";
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

	const sections = React.useMemo(
		() =>
			Object.keys(groupedUsers!).map((letter) => ({
				letter,
				users: groupedUsers![letter],
			})),
		[groupedUsers],
	);

	return (
		<BackgroundLayout className="flex-1 px-4">
			<View className="iems-center flex-row justify-between">
				<Title title={role === "employee" ? "Staff" : "Indépendants"} />
			</View>

			<LegendList
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
				estimatedItemSize={235}
				data={sections}
				renderItem={({ item: section }) => (
					<View key={section.letter} className="gap-2">
						<Text className="mb-2 font-semibold text-base text-defaultGray">
							{section.letter}
						</Text>
						{section.users.map((user) => (
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
									pathname: "/organigramme/[organigramme]",
									params: {
										organigramme: user.id,
									},
								}}
							/>
						))}
					</View>
				)}
			/>
		</BackgroundLayout>
	);
}
