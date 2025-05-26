import HeaderLayout from "@/layouts/headert-layout";
import { Platform } from "react-native";
import { Stack } from "expo-router";


export default function ChatLayout() {
	return (
		<Stack
			screenOptions={{
				gestureEnabled: true,
				fullScreenGestureEnabled: true,
				animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="new-room"
				options={{
					headerShown: false,
					sheetGrabberVisible: true,
					presentation: "modal",
				}}
			/>
			<Stack.Screen
				name="[chat]/index"
				options={{
					header: (props) => <HeaderLayout backgroundColor="bg-white" title={props.options.title} />,
				}}
			/>
			<Stack.Screen
				name="[chat]/details"
				options={{
					presentation: "modal",
					sheetGrabberVisible: true,
					header: () => <HeaderLayout />,
					headerShown: Platform.OS === "ios" ? false : true,
				}}
			/>
		</Stack>
	);
}
