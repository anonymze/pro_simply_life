import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardNewsletter from "@/components/card/card-newsletter";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { getFundesysQuery } from "@/api/queries/fundesys";
import { View, Text, ScrollView } from "react-native";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["fundesyses"],
			queryFn: getFundesysQuery,
		},
		({ data }) => {
			// sort and group suppliers by first letter
			const groupedFundesys = React.useMemo(
				() =>
					data.docs
						.slice()
						.sort((a, b) => (a.date > b.date ? -1 : 1))
						.reduce(
							(acc, fundesys) => {
								const date = new Date(fundesys.date).toLocaleDateString("fr-FR", {
									month: "long",
									year: "numeric",
								});
								if (!acc[date]) acc[date] = [];
								acc[date].push(fundesys);
								return acc;
							},
							{} as Record<string, typeof data.docs>,
						),
				[data],
			);

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Fundesys" />
					<Text className="mb-5 text-sm text-defaultGray">Newsletter hebdomadaire</Text>

					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						style={{ backgroundColor: config.theme.extend.colors.background }}
						contentContainerStyle={{ paddingBottom: 10 }}
					>
						<View className="gap-2">
							{Object.keys(groupedFundesys).map((date) => (
								<View key={date} className="gap-2">
									<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{date}</Text>
									{groupedFundesys[date].map((fundesys) => (
										<CardNewsletter
											queryKey="fundesys"
											icon={
												<ImagePlaceholder
													transition={0}
													source={require("@/assets/images/fundesys.png")}
													style={{ width: "100%", height: "100%", borderRadius: 5 }}
												/>
											}
											key={fundesys.id}
											newsletter={fundesys}
											link={{
												pathname: `/fundesys/[fundesys]`,
												params: {
													fundesys: fundesys.id,
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
