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
		<View className="h-[180] gap-4  rounded-2xl bg-primary p-4" style={{ width }}>
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


// // import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
// // import { LinearGradient } from 'expo-linear-gradient';
// import { View } from "react-native";


// // const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

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
// 	return (
// 		<View className="h-[180] overflow-hidden rounded-2xl bg-[#1a1a1a]" style={{ width }}>
// 			<View className="h-20 w-full bg-[#262626]"></View>
// 			<View className="-mt-8 ml-5 size-16 rounded-xl bg-[#262626]"></View>
// 			<View className="mx-5 mt-3.5 gap-1">
// 				<View className="h-4 w-1/3 rounded-[0.2rem] bg-[#262626]"></View>
// 				<View className="h-3 w-1/2 rounded-[0.15rem] bg-[#262626]"></View>
// 				{/* <ShimmerPlaceholder
// 					style={{ 
// 						height: 24, 
// 						width: '100%', 
// 						borderRadius: 3,
// 						backgroundColor: '#262626'
// 					}}
// 					shimmerColors={['#262626', '#666666', '#262626']}
// 					visible={false}
// 				/> */}
// 			</View>
// 		</View>
// 	);
// }
