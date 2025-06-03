import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardEmployee from "@/components/card/card-employee";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	const { role } = useLocalSearchParams();

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
			<Title title={role === "employee" ? "Employés" : "Indépendants"} />
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
		</BackgroundLayout>
	);
}
