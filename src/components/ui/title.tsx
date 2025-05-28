import { Text } from "react-native";
import { cn } from "@/utils/cn";


export default function Title({ title, className }: { title: string; className?: string }) {
	return <Text className={cn("mb-4 mt-7 text-primary text-xl font-bold", className)}>{title}</Text>;
}
