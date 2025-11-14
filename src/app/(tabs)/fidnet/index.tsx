import { getFidnetsQuery } from "@/api/queries/fidnet";
import CardNewsletter from "@/components/card/card-newsletter";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Fidnet } from "@/types/fidnet";
import { PaginatedResponse } from "@/types/response";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { LegendList } from "@legendapp/list";
import { Link } from "expo-router";
import { KeyRoundIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

interface FlatListItem {
	type: "header" | "item";
	date?: string;
	[key: string]: any;
}

const FidnetContent = ({ data }: { data: PaginatedResponse<Fidnet> }) => {
	// Convert grouped data to flat array for FlatList
	const flatData = React.useMemo(() => {
		const addedDates = new Set<string>();

		return data.docs
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.reduce((acc, fidnet) => {
				const date = new Date(fidnet.date).toLocaleDateString("fr-FR", {
					month: "long",
					year: "numeric",
				});

				if (!addedDates.has(date)) {
					acc.push({ type: "header", date });
					addedDates.add(date);
				}

				acc.push({ type: "item", ...fidnet });

				return acc;
			}, [] as FlatListItem[]);
	}, [data]);

	const renderItem = React.useCallback(({ item }: { item: any }) => {
		if (item.type === "header") {
			return <Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{item.date}</Text>;
		}

		return (
			<CardNewsletter
				queryKey="fidnet"
				icon={
					<ImagePlaceholder
						transition={0}
						contentFit="contain"
						source={require("@/assets/icons/fidnet.svg")}
						style={{ width: 36, height: 36, borderRadius: 4 }}
					/>
				}
				key={item.id}
				newsletter={item}
				link={{
					pathname: `/fidnet/[fidnet]`,
					params: {
						fidnet: item.id,
					},
				}}
			/>
		);
	}, []);

	return (
		<BackgroundLayout className="pt-safe px-4">
			<View className="flex-row items-center justify-between">
				<Title title="Fidnet" />
				<Link href="/(tabs)/fidnet/logs" asChild>
					<TouchableOpacity className="p-3" hitSlop={5}>
						<View className="size-10 items-center justify-center rounded-full bg-white shadow-sm shadow-defaultGray/20">
							<KeyRoundIcon size={20} color={config.theme.extend.colors.primary} />
						</View>
					</TouchableOpacity>
				</Link>
			</View>
			<Text className="mb-5 text-sm text-defaultGray">Newsletter hebdomadaire</Text>

			<LegendList
				data={flatData}
				renderItem={renderItem}
				estimatedItemSize={100}
				keyExtractor={(item) => (item.type === "header" ? item.date : item.id)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 10 }}
				ItemSeparatorComponent={() => <View className="h-2.5" />}
			/>
		</BackgroundLayout>
	);
};

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["fidnets"],
			queryFn: getFidnetsQuery,
		},
		FidnetContent,
	)();
}
