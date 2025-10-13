import { queryClient } from "@/api/_queries";
import { getSportsQuery } from "@/api/queries/sport-queries";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Sport } from "@/types/sport";
import { USER_DEV_ID, USER_LEONIE_ID, USER_MATHIEU_ID } from "@/utils/helper";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { getStorageUserInfos } from "@/utils/store";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowRightIcon, FileSpreadsheetIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const appUser = getStorageUserInfos();
	return withQueryWrapper(
		{
			queryKey: ["sports"],
			queryFn: getSportsQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="pt-safe px-4">
					{appUser?.user.id === USER_LEONIE_ID ||
					appUser?.user.id === USER_MATHIEU_ID ||
					appUser?.user.id === USER_DEV_ID ? (
						<View className="flex-row items-center justify-between">
							<Title title="Sport et Patrimoine" />
							<TouchableOpacity
								className="p-3"
								hitSlop={5}
								onPress={async () => {
									const webUrl =
										"https://www.notion.so/2712a4ea516080558c9efd6591efc4f5?v=2712a4ea516080f98116000c3a3eedb1&source=copy_link";
									await WebBrowser.openBrowserAsync(webUrl);
								}}
							>
								<View className="size-10 items-center justify-center rounded-full bg-white shadow-sm shadow-defaultGray/20">
									<FileSpreadsheetIcon size={22} color={config.theme.extend.colors.primary} />
								</View>
							</TouchableOpacity>
						</View>
					) : (
						<Title title="Sport et Patrimoine" className="mb-6" />
					)}

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
