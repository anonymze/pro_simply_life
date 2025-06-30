import { cn } from "@/utils/cn";
import { truncateText } from "@/utils/helper";
import { Link, LinkProps } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const windowWidth = Dimensions.get("window").width;

export default function CardLink({
	icon,
	title,
	description,
	link,
	backgroundIcon,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	link: LinkProps["href"];
	backgroundIcon: string;
}) {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="items-center gap-1 rounded-2xl" hitSlop={5}>
				<View className={cn("size-24 items-center justify-center rounded-2xl bg-primaryUltraLight", backgroundIcon)}>
					{icon}
				</View>
				<Text className={cn("mt-2 font-semibold text-primary", windowWidth < 405 && "text-sm")}>
					{truncateText(title, 12)}
				</Text>
				{/* <Text className="text font-medium text-lightGray text-center">{truncateText(description, 10)}</Text> */}
			</TouchableOpacity>
		</Link>
	);
}
