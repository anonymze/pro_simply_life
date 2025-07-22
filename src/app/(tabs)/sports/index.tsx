import { queryClient } from "@/api/_queries";
import { getSportsQuery } from "@/api/queries/sport-queries";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Sport } from "@/types/sport";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { Link } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import config from "tailwind.config";

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["sports"],
			queryFn: getSportsQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Sport et Patrimoine" className="mb-6" />

					<Card
						sports={data.docs.filter((item) => item.category === "fiscal")}
						category={"fiscal"}
						categoryLabel={"Fiscalité"}
					/>
					<Card
						sports={data.docs.filter((item) => item.category === "international")}
						category={"international"}
						categoryLabel={"International"}
					/>
				</BackgroundLayout>
			);
		},
	)();
}

const Card = ({
	sports,
	category,
	categoryLabel,
}: {
	sports: Sport[];
	category: Sport["category"];
	categoryLabel: string;
}) => {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["sports", category], sports);
	}, [sports]);

	return (
		<Link
			href={{
				pathname: "/(tabs)/sports/[sports]",
				params: { sports: category, category: categoryLabel },
			}}
			push
			asChild
		>
			<TouchableOpacity
				onPressIn={onPress}
				className="my-1 w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<Text className="flex-shrink font-semibold text-lg text-primary">{categoryLabel}</Text>
				<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} />
			</TouchableOpacity>
		</Link>
	);
};
