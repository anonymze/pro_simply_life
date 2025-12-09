import HeaderGrabberIos from "@/layouts/header-grabber-ios";
import HeaderLayout from "@/layouts/headert-layout";
import { Platform } from "react-native";
import { Stack } from "expo-router";


export default function FidnetLayout() {
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
				name="pdf/[pdf]"
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
				name="image/[image]"
			/>
		</Stack>
	);
}
