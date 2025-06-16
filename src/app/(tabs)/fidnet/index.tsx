import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardNewsletter from "@/components/card/card-newsletter";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { getFidnetsQuery } from "@/api/queries/fidnet";
import { View, Text, ScrollView } from "react-native";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["fidnets"],
			queryFn: getFidnetsQuery,
		},
		({ data }) => {
			// sort and group suppliers by first letter
			const groupedFidnet = React.useMemo(
				() =>
					data.docs
						.slice()
						.sort((a, b) => (a.date > b.date ? -1 : 1))
						.reduce(
							(acc, fidnet) => {
								const date = new Date(fidnet.date).toLocaleDateString("fr-FR", {
									month: "long",
									year: "numeric",
								});
								if (!acc[date]) acc[date] = [];
								acc[date].push(fidnet);
								return acc;
							},
							{} as Record<string, typeof data.docs>,
						),
				[data],
			);

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Fidnet" />
					<Text className="mb-5 text-sm text-defaultGray">Newsletter hebdomadaire</Text>

					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						style={{ backgroundColor: config.theme.extend.colors.background }}
						contentContainerStyle={{ paddingBottom: 10 }}
					>
						<View className="gap-2">
							{Object.keys(groupedFidnet).map((date) => (
								<View key={date} className="gap-2">
									<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{date}</Text>
									{groupedFidnet[date].map((fidnet) => (
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
											key={fidnet.id}
											newsletter={fidnet}
											link={{
												pathname: `/fidnet/[fidnet]`,
												params: {
													fidnet: fidnet.id,
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
		},
	)();
}
