import { getFundesysesQuery } from "@/api/queries/fundesys";
import CardNewsletter from "@/components/card/card-newsletter";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { LegendList } from "@legendapp/list";
import React from "react";
import { Text, View } from "react-native";

interface FlatListItem {
	type: "header" | "item";
	date?: string;
	[key: string]: any;
}

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["fundesys"],
			queryFn: getFundesysesQuery,
		},
		({ data }) => {
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

			const renderItem = ({ item }: { item: any }) => {
				if (item.type === "header") {
					return <Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{item.date}</Text>;
				}

				return (
					<CardNewsletter
						queryKey="fundesys"
						icon={
							<ImagePlaceholder
								transition={0}
								contentFit="contain"
								source={require("@/assets/images/fundesys.png")}
								style={{ width: 36, height: 36, borderRadius: 4 }}
							/>
						}
						// key={item.id}
						newsletter={item}
						link={{
							pathname: `/fundesys/[fundesys]`,
							params: {
								fundesys: item.id,
							},
						}}
					/>
				);
			};

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Fundesys" />
					<Text className="mb-5 text-sm text-defaultGray">Newsletter hebdomadaire</Text>

					<LegendList
						data={flatData}
						renderItem={renderItem}
						estimatedItemSize={80}
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
