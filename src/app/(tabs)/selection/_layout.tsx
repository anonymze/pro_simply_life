import HeaderGrabberIos from "@/layouts/header-grabber-ios";
import HeaderLayout from "@/layouts/headert-layout";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function OrganigrammeLayout() {
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
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos className="bg-white" /> : <HeaderLayout backgroundColor="bg-white" />,
					headerShown: true,
				}}
				name="pdf/[pdf]"
			/>
			<Stack.Screen
				options={{
					headerShown: true,
					// gestureEnabled: false,
					header: () => <HeaderLayout backgroundColor="bg-white" />,
				}}
				name="[supplier]/index"
			/>
			<Stack.Screen
				options={{
					presentation: "modal",
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos className="bg-white" /> : <HeaderLayout backgroundColor="bg-white" />,
					headerShown: true,
				}}
				name="[supplier]/pdf/[pdf]"
			/>
			<Stack.Screen
				options={{
					// presentation: "modal",
					sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					presentation: Platform.OS === "ios" ? "formSheet" : "modal",
					// sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					headerShown: true,
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos noMarginBottom /> : <HeaderLayout  />,
				}}
				name="[supplier]/logs/[logs]"
			/>
			<Stack.Screen
				options={{
					// presentation: "modal",
					sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					presentation: Platform.OS === "ios" ? "formSheet" : "modal",
					// sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					headerShown: true,
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos noMarginBottom /> : <HeaderLayout  />,
				}}
				name="[supplier]/perso/[perso]"
			/>
		</Stack>
	);
}
