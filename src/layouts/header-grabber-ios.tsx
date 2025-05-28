import { StyleProp, View, ViewStyle } from "react-native";
import { cn } from "@/utils/libs/tailwind";


export default function HeaderGrabberIos({
	style,
	className,
	noMarginBottom,
}: {
	noMarginBottom?: boolean;
	style?: StyleProp<ViewStyle>;
	className?: string;
}) {
	return (
		<View className={cn("bg-background", className)} style={style}>
			<View className={cn("w-10 h-1.5 mx-auto bg-primary mt-3 rounded-full", noMarginBottom && "mb-0")}/>
		</View>
	);
}
