import HeaderGrabberIos from "@/layouts/header-grabber-ios";
import HeaderLayout from "@/layouts/headert-layout";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function SupplierLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
				fullScreenGestureEnabled: true,
				animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
			}}
		>
			<Stack.Screen
				name="[supplier]/index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				options={{
					presentation: "modal",
					header: () =>
						Platform.OS === "ios" ? (
							<HeaderGrabberIos className="bg-white" />
						) : (
							<HeaderLayout backgroundColor="bg-white" />
						),
					headerShown: true,
				}}
				name="[supplier]/pdf/[pdf]"
			/>
		</Stack>
	);
}
