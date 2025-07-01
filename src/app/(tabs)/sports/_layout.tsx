import HeaderLayout from "@/layouts/headert-layout";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function FundesysLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
				fullScreenGestureEnabled: true,
				animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen
				name="[sports]/index"
				options={{
					// headerBackButtonMenuEnabled: false,
					header: () => <HeaderLayout />,
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="[sports]/[sport]"
				options={{
					// headerBackButtonMenuEnabled: false,
					header: () => <HeaderLayout />,
					headerShown: true,
				}}
			/>
		</Stack>
	);
}
