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
