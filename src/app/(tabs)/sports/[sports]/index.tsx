import { queryClient } from "@/api/_queries";
import { getSportsCategoryQuery } from "@/api/queries/sport-queries";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Sport } from "@/types/sport";
import { cn } from "@/utils/libs/tailwind";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

interface FlatListItem {
	typed: "header" | "item";
	typeTitle?: string;
	[key: string]: any;
}

export default function Page() {
	const { sports: sportCategory, category } = useLocalSearchParams();

	const { data: sports } = useQuery({
		queryKey: ["sports", sportCategory],
		queryFn: getSportsCategoryQuery,
		enabled: !!sportCategory,
	});

	if (!sports) return null;

	// Convert grouped data to flat array for FlatList
	const flatData = React.useMemo(() => {
		const addedSport = new Set<string>();

		return sports
			.sort((a, b) => a.type.localeCompare(b.type, "fr"))
			.reduce((acc, sport) => {
				const typeTitle = sport.type;

				if (!addedSport.has(typeTitle)) {
					acc.push({ typed: "header", typeTitle });
					addedSport.add(typeTitle);
				}

				acc.push({ typed: "item", ...sport });

				return acc;
			}, [] as FlatListItem[]);
	}, [sports]);

	const renderItem = ({ item }: { item: any }) => {
		if (item.typed === "header") {
			return <Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{item.typeTitle}</Text>;
		}

		return <Card sport={item} sportCategory={sportCategory.toString()} />;
	};

	return (
		<BackgroundLayout className={cn("px-4 pb-4")}>
			<Title title={category.toString()} />

			<FlashList
				data={flatData}
				renderItem={renderItem}
				estimatedItemSize={67}
				keyExtractor={(item) => (item.typed === "header" ? item.typeTitle : item.id)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 10 }}
				ItemSeparatorComponent={() => <View className="h-2.5" />}
			/>
		</BackgroundLayout>
	);
}

const Card = ({ sport, sportCategory }: { sport: Sport; sportCategory: string }) => {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["sport", sport.id], sport);
	}, [sport]);

	return (
		<Link
			href={{
				pathname: "/(tabs)/sports/[sports]/[sport]",
				params: { sports: sportCategory, sport: sport.id },
			}}
			push
			asChild
		>
			<TouchableOpacity
				onPressIn={onPress}
				className="my-1 w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<Text className="flex-shrink font-semibold text-lg text-primary">
					{sport.firstname} {sport.lastname}
				</Text>
				<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} />
			</TouchableOpacity>
		</Link>
	);
};
