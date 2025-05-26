import { ArrowRight, CalendarIcon } from "lucide-react-native";
import { truncateText } from "@/utils/helper";
import { Text, View } from "react-native";


export default function CardEvent({
	date,
	title,
	type,
	description,
	width,
}: {
	date: string;
	title: string;
	type: string;
	description: string;
	width: number;
}) {
	return (
		<View className="h-[180] gap-4  rounded-2xl bg-primary p-4" style={{ width: width }}>
			<View className="flex-row items-center justify-between gap-2">
				<View className="rounded-[0.3rem] bg-primaryLight px-1.5 py-1">
					<Text className="text-xs font-semibold text-white">{type}</Text>
				</View>
				<View className="flex-row items-center gap-2">
					<CalendarIcon strokeWidth={2.5} size={14} color="white" />
					<Text className="text-xs font-semibold text-white">
						{new Date(date).toLocaleDateString("fr-FR", {
							day: "2-digit",
							month: "long",
							year: "numeric",
						})}
					</Text>
				</View>
			</View>
			<Text className="text-md font-bold text-white">{truncateText(title, 70)}</Text>
			<Text className="text-sm text-white">{truncateText(description, 90)}</Text>
			<View className="mt-auto flex-row items-center gap-2">
				<Text className="text-sm font-semibold text-white">En savoir plus</Text>
				<ArrowRight strokeWidth={2.5} size={16} color="white" />
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
