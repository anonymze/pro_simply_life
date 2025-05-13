import HeaderLayout from "@/layouts/headert-layout";
import { truncateText } from "@/utils/helper";
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
					header: () => <HeaderLayout backButton={false} title="Conversations" sheet={{ link: "/chat/new-room" }} />,
				}}
			/>
			<Stack.Screen
				name="new-room"
				options={{
					headerShown: Platform.OS === "ios" ? false : true,
					sheetGrabberVisible: true,
					presentation: Platform.OS === "ios" ? "formSheet" : "modal",
					sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					header: () => <HeaderLayout />,
				}}
			/>
			<Stack.Screen
				name="[chat]"
				options={{
					header: (props) => <HeaderLayout title={truncateText(props.options.title || "", 22)} />,
				}}
			/>
		</Stack>
	);
}
