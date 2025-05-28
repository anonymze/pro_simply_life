import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react-native";
import { truncateText } from "@/utils/helper";
import { Text, View } from "react-native";
import config from "tailwind.config";


export default function CardEvent({
	eventStart,
	eventEnd,
	title,
	type,
	description,
	width,
}: {
	eventStart: Date;
	eventEnd: Date;
	title: string;
	type: string;
	description: string;
	width: number;
}) {
	return (
		<View className="h-[190] gap-4  rounded-2xl bg-white p-4" style={{ width: width }}>
			<View className="flex-row gap-4">
				<View className="h-32 w-24 items-center justify-center gap-1 rounded-xl bg-secondary">
					<Text className="font-bold text-3xl text-primary">{new Date(eventStart).getDate()}</Text>
					<Text className="text-primary">{new Date(eventStart).toLocaleDateString("fr-FR", { month: "long" })}</Text>
				</View>
				<View className="flex-shrink gap-2">
					<View className="mt-1 self-start rounded-[0.3rem] bg-darkGray px-1.5 py-1">
						<Text className="font-semibold text-xs text-primaryLight">{type}</Text>
					</View>
					<Text className="font-bold text-lg text-primary">{truncateText(title, 40)}</Text>
					<View className="flex-row items-center gap-2">
						<ClockIcon size={24} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
						<Text className="text-lg text-primary">
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
		</View>
	);
}

// import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
// import { Text, View } from "react-native";
// import { Image } from "expo-image";
// import React from "react";

// import { SkeletonPlaceholder } from "../skeleton-placeholder";

// export default function CardEvent({
// 	date,
// 	title,
// 	type,
// 	description,
// 	width,
// }: {
// 	date: string;
// 	title: string;
// 	type: string;
// 	description: string;
// 	width: number;
// }) {
// 	const [isLoading, setIsLoading] = React.useState(true);

// 	React.useEffect(() => {
// 		setTimeout(() => {
// 			setIsLoading(false);
// 		}, 1000);
// 	}, []);

// 	return (
// 		<>
// 			{isLoading ? (
// 				<Animated.View key="skeleton" exiting={FadeOut.duration(3000)}>
// 					<View className="h-[220] overflow-hidden rounded-2xl bg-[#1a1a1a]" style={{ width }}>
// 						<SkeletonPlaceholder height={70} width={width} />
// 						<SkeletonPlaceholder height={75} width={75} style={{ borderRadius: 16, marginTop: -38, marginLeft: 18 }} />
// 						<View className="mx-5 mt-4 gap-2">
// 							<SkeletonPlaceholder width={width / 3} height={20} style={{ borderRadius: 3 }} />
// 							<SkeletonPlaceholder width={width / 2} height={14} style={{ borderRadius: 2.5 }} />
// 							<SkeletonPlaceholder width={width - 40} height={34} style={{ borderRadius: 4 }} />
// 						</View>
// 					</View>
// 				</Animated.View>
// 			) : (
// 				<Animated.View key="content" entering={FadeIn.duration(500)}>
// 					<View className="h-[220] overflow-hidden rounded-2xl bg-[#1a1a1a]" style={{ width }}>
// 						<Image source={require("@/assets/images/phone.jpg")} style={{ width: width, height: 70 }} />

// 						<Image
// 							source={require("@/assets/images/freeman.jpg")}
// 							style={{ width: 75, height: 75, borderRadius: 16, marginTop: -38, marginLeft: 18 }}
// 						/>
// 						<View className="mx-5 mt-3.5 gap-1">
// 							<Text className="text-white font-bold text-xl">Ahmed Khna</Text>
// 							<Text className="text-darkGray">Mobile App developer</Text>
// 							<Text className="text-white font-medium">
// 								Skilled in developing user-friendly mobile apps for Android and iOs Platforms.
// 							</Text>
// 						</View>
// 					</View>
// 				</Animated.View>
// 			)}
// 		</>
// 	);
// }
