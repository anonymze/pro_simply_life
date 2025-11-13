import { Text, TouchableOpacity, View } from "react-native";
import { Link, LinkProps } from "expo-router";
import React from "react";
import { MyTouchableScaleOpacity } from "../my-pressable";


export default function CardLinkTablet({
	icon,
	title,
	description,
	link,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	link: LinkProps["href"];
}) {
	return (
		<Link href={link} push asChild>
			<MyTouchableScaleOpacity className="flex-1 flex-shrink items-startt gap-2 rounded-xl bg-white p-3 shadow-sm shadow-defaultGray/10">
				<View className="size-16 rounded-lg bg-primaryUltraLight items-center justify-center">{icon}</View>
				<View className="flex-1">
					<Text className="text-primary text-lg font-semibold">{title}</Text>
					<Text className="text-sm text-defaultGray">{description}</Text>
				</View>
			</MyTouchableScaleOpacity>
		</Link>
	);
}
