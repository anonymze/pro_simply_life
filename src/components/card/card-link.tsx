import Animated, { useSharedValue, withDelay, withRepeat, withTiming, useAnimatedStyle, interpolate, } from "react-native-reanimated";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Link, LinkProps } from "expo-router";
import { Service } from "@/routes/services";
import React, { useEffect } from "react";
import { Image } from "expo-image";


export default function CardLink({
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
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 rounded-lg bg-secondaryLight items-center justify-center">{icon}</View>
				<View className="flex-1">
					<Text className="text-dark text-lg font-semibold">{title}</Text>
					<Text className="text-sm text-defaultGray">{description}</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
}
