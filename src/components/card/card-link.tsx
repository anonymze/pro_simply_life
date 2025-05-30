import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { truncateText } from "@/utils/helper";
import { Link, LinkProps } from "expo-router";
import { cn } from "@/utils/cn";
import React from "react";


const windowWidth = Dimensions.get("window").width;

export default function CardLinkTablet({
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
			<TouchableOpacity className="rounded-2xl gap-1 items-center" hitSlop={5}>
				<View className={cn("size-24 items-center justify-center  rounded-2xl bg-primaryUltraLight", backgroundIcon)}>{icon}</View>
				<Text className={cn("font-semibold text-primary mt-2", windowWidth < 380 && "text-[0.89rem]")}>{truncateText(title, 12)}</Text>
				{/* <Text className="text font-medium text-lightGray text-center">{truncateText(description, 10)}</Text> */}
			</TouchableOpacity>
		</Link>
	);
}
