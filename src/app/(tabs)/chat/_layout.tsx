import HeaderLayout from "@/layouts/headert-layout";
import { getStorageUserInfos } from "@/utils/store";
import { truncateText } from "@/utils/helper";
import { userHierarchy } from "@/types/user";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import React from "react";


export default function ChatLayout() {
	const userInfos = React.useMemo(() => getStorageUserInfos(), []);

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
					header: () => <HeaderLayout backButton={false} title="Conversations" sheet={userHierarchy[userInfos?.user?.role ?? "visitor"] < 1 ? { link: "/chat/new-room" } : undefined} />,
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
