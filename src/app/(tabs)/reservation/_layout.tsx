import HeaderGrabberIos from "@/layouts/header-grabber-ios";
import HeaderLayout from "@/layouts/headert-layout";
import { Platform } from "react-native";
import { Stack } from "expo-router";


export default function ReservationLayout() {
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
				name="details/[details]"
				options={{
					presentation: "modal",
					sheetGrabberVisible: true,
					header: () => (Platform.OS === "ios" ? <HeaderGrabberIos /> : <HeaderLayout />),
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="[date]"
				options={{
					headerShown: Platform.OS === "ios" ? true : false,
					presentation: "modal",
					header: () => <HeaderGrabberIos />,
				}}
			/>
		</Stack>
	);
}
