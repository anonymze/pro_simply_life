import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ArrowRight, ClockIcon } from "lucide-react-native";
import { Dimensions, Text, View } from "react-native";
import { truncateText } from "@/utils/helper";
import config from "tailwind.config";
import { cn } from "@/utils/cn";
import React from "react";

import { SkeletonPlaceholder } from "../skeleton-placeholder";


const windowWidth = Dimensions.get("window").width;

export default function CardEvent({
	title,
	type,
	description,
	eventStart,
	eventEnd,
	width,
}: {
	eventStart: Date;
	eventEnd: Date;
	title: string;
	type: string;
	description: string;
	width: number;
}) {
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}, []);

	return (
		<>
			{isLoading ? (
				<Animated.View key="skeleton" exiting={FadeOut.duration(2000)}>
					<View className="h-[190px] gap-4  rounded-2xl bg-white p-4" style={{ width }}>
						<View className="flex-row gap-5">
							<View className="h-32 w-24 overflow-hidden rounded-xl">
								<SkeletonPlaceholder height={"100%"} width={100} shimmerColors={["#E0E0E0", "#F0F0F0", "#E0E0E0"]} />
							</View>
							<View className="gap-3">
								<View className="mt-1">
									<SkeletonPlaceholder height={21} width={75} style={{ borderRadius: 3 }} />
								</View>
								<SkeletonPlaceholder height={43} width={200} style={{ borderRadius: 3 }} />
								<SkeletonPlaceholder height={22} width={130} style={{ borderRadius: 3 }} />
							</View>
						</View>
						<View className="mt-1 border-t border-darkGray" />
						<View className="mt-auto flex-row items-center gap-2">
							<Text className="font-semibold text-primary">En savoir plus</Text>
							<ArrowRight strokeWidth={2.5} size={16} color={config.theme.extend.colors.primary} />
						</View>
					</View>
				</Animated.View>
			) : (
				<Animated.View entering={FadeIn.duration(300)} className="h-[190px] gap-4 rounded-2xl bg-white p-4" style={{ width: width }}>
					<View className="flex-row gap-5">
						<View className="h-32 w-24 items-center justify-center gap-1 rounded-xl bg-secondary">
							<Text className="font-bold text-3xl text-primary">{new Date(eventStart).getDate()}</Text>
							<Text className="text-primary">
								{new Date(eventStart).toLocaleDateString("fr-FR", { month: "long" })}
							</Text>
						</View>
						<View className="flex-shrink gap-2">
							<View className="mt-1 self-start rounded-[0.3rem] bg-darkGray px-1.5 py-1">
								<Text className="font-semibold text-xs text-primaryLight">{type}</Text>
							</View>
							<Text className="font-bold text-primary text-base">{truncateText(title, 40)}</Text>
							<View className="flex-row items-center gap-2">
								<ClockIcon size={24} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
								<Text className="text-lg text-primaryLight">
									{new Date(eventStart).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} -{" "}
									{new Date(eventEnd).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
								</Text>
							</View>
						</View>
					</View>
					<View className="mt-1 border-t border-darkGray" />
					<View className="mt-auto flex-row items-center gap-2">
						<Text className="font-semibold text-primary">En savoir plus</Text>
						<ArrowRight strokeWidth={2.5} size={16} color={config.theme.extend.colors.primary} />
					</View>
				</Animated.View>
			)}
		</>
	);
}
