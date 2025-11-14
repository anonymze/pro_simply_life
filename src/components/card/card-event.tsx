import { queryClient } from "@/api/_queries";
import { Event, eventLabel } from "@/types/event";
import { truncateText } from "@/utils/helper";
import { Link } from "expo-router";
import { ArrowRight, ClockIcon } from "lucide-react-native";
import React from "react";
import { DimensionValue, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import config from "tailwind.config";

import { SkeletonPlaceholder } from "../skeleton-placeholder";
import { MyTouchableScaleOpacity } from "../my-pressable";

export default function CardEvent({
	event,
	width,
	isLoading,
}: {
	event: Event;
	width: DimensionValue | undefined;
	isLoading: boolean;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["event", event.id], event);
	}, [event]);
	return (
		<>
			{isLoading ? (
				<Animated.View key="skeleton" exiting={FadeOut.duration(2000)}>
					<View className="h-[220px] gap-4  rounded-2xl bg-white p-4" style={{ width }}>
						<View className="flex-row gap-5">
							<View className="h-32 w-24 overflow-hidden rounded-xl">
								<SkeletonPlaceholder
									height={"100%"}
									width={100}
									shimmerColors={[config.theme.extend.colors.secondary, config.theme.extend.colors.secondaryLight]}
								/>
							</View>
							<View className="gap-3">
								<View className="mt-1">
									<SkeletonPlaceholder
										shimmerColors={["#E0E0E0", "#F0F0F0", "#E0E0E0"]}
										height={21}
										width={75}
										style={{ borderRadius: 3 }}
									/>
								</View>
								<SkeletonPlaceholder
									shimmerColors={["#E0E0E0", "#F0F0F0", "#E0E0E0"]}
									height={43}
									width={200}
									style={{ borderRadius: 3 }}
								/>
								<SkeletonPlaceholder
									shimmerColors={["#E0E0E0", "#F0F0F0", "#E0E0E0"]}
									height={22}
									width={130}
									style={{ borderRadius: 3 }}
								/>
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
				<Link
					href={{
						pathname: "/(tabs)/event/[event]",
						params: {
							event: event.id,
						},
					}}
					push
					asChild
				>
					<MyTouchableScaleOpacity onPressIn={onPress}>
						<Animated.View
							entering={FadeIn.duration(300)}
							className="h-[220px] gap-4 rounded-2xl bg-white p-4"
							style={{ width }}
						>
							<View className="flex-row gap-5">
								<View className="h-32 w-24 items-center justify-center gap-1 rounded-xl bg-secondary">
									<Text className="font-bold text-3xl text-primary">{new Date(event.event_start).getDate()}</Text>
									<Text className="text-primary">
										{new Date(event.event_start).toLocaleDateString("fr-FR", { month: "long" })}
									</Text>
								</View>
								<View className="flex-shrink justify-center gap-2">
									<View className="self-start rounded-[0.3rem] bg-darkGray px-1.5 py-1">
										<Text className="font-semibold text-xs text-primaryLight">{eventLabel[event.type]}</Text>
									</View>
									<Text className="font-bold text-base text-primary">{truncateText(event.title, 40)}</Text>
									<View className="flex-row items-center gap-2">
										<ClockIcon size={24} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
										<Text className="text-lg text-primaryLight">
											{new Date(event.event_start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}{" "}
											- {new Date(event.event_end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
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
					</MyTouchableScaleOpacity>
				</Link>
			)}
		</>
	);
}
