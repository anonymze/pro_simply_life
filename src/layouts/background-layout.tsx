import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { cn } from "@/utils/libs/tailwind";


export default function BackgroundLayout({ children, style, className }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; className?: string }) {
	return <View className={cn("flex-1 bg-background", className)} style={style}>{children}</View>;
}

// used for components that need native style
export const stylesLayout = StyleSheet.create({
	full: {
		width: "100%",
		height: "100%",
	},
	container: {
		flex: 1,
	},
	containerCentered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
