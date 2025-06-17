import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardNewsletter from "@/components/card/card-newsletter";
import CardCommission from "@/components/card/card-commission";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { getFidnetsQuery } from "@/api/queries/fidnet";
import { FlashList } from "@shopify/flash-list";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";
import React from "react";


interface FlatListItem {
	type: "header" | "item";
	date?: string;
	[key: string]: any;
}

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["fidnets"],
			queryFn: getFidnetsQuery,
		},
		({ data }) => {
			// Convert grouped data to flat array for FlatList
			const flatData = React.useMemo(() => {
				const addedDates = new Set<string>();

				return data.docs
					.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
					.reduce((acc, fidnet) => {
						const date = new Date(fidnet.date).toLocaleDateString("fr-FR", {
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

			const renderItem = ({ item }: { item: any }) => {
				if (item.type === "header") {
					return <Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{item.date}</Text>;
				}

				return (
					<CardCommission
						key={item.id}
						commission={item}
						link={{
							pathname: `/commissions/[commission]`,
							params: {
								commission: item.id,
							},
						}}
					/>
				);
			};

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Mes commissions" />

					<FlashList
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
		},
	)();
}
