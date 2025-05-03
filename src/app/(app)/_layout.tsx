import { NotificationProvider } from "@/context/push-notifications";
import HeaderLayout from "@/layouts/headert-layout";
import { getStorageUserInfos } from "@/utils/store";
import { truncateText } from "@/utils/helper";
import { Stack, Redirect } from "expo-router";
import { Platform } from "react-native";
import React from "react";

export default function AppLayout() {
	const userInfos = React.useMemo(() => getStorageUserInfos(), []);

	if (!userInfos || !userInfos.token) {
		return <Redirect href="/login" />;
	}

	return (
		<NotificationProvider>
			<Stack
				initialRouteName="index"
				screenOptions={{
					headerShown: true,
					gestureDirection: "horizontal",
					gestureEnabled: true,
					fullScreenGestureEnabled: true,
					gestureResponseDistance: {
						start: 0,
						end: 120,
					},
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="contact"
					options={{
						gestureEnabled: false,
						header: () => <HeaderLayout title="Contacts" />,
					}}
				/>
				<Stack.Screen
					name="chat/index"
					options={{
						header: () => <HeaderLayout title="Conversations" sheet={{ link: "/chat/new-room" }} />,
					}}
				/>
				<Stack.Screen
					name="chat/[chat]"
					// Set title to empty string to prevent showing [chat] in the header while chat room title is being fetched
					options={{
						header: (props) => {
							return <HeaderLayout title={truncateText(props.options.title || "", 22)} />;
						},
					}}
				/>
				<Stack.Screen
					name="chat/new-room"
					options={{
						presentation: Platform.OS === "ios" ? "formSheet" : "formSheet",
						sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : [0.6, 1],
						header: () => <HeaderLayout title="Nouvelle conversation" />,
					}}
				/>
				<Stack.Screen
					name="pdf"
					options={{
						header: () => <HeaderLayout title="Visionneuse PDF" />,
					}}
				/>
			</Stack>
		</NotificationProvider>
	);
}
