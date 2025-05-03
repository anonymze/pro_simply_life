import { StyleSheet, View } from "react-native";
import { cn } from "@/utils/libs/tailwind";

export default function BackgroundLayout({ children, className }: { children: React.ReactNode; className?: string }) {
	return <View className={cn("flex-1 bg-background", className)}>{children}</View>;
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
