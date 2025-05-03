import { NotificationProvider } from "@/context/push-notifications";
import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import { Stack, Redirect, Link, router } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import HeaderLayout from "@/layouts/headert-layout";
import { getStorageUserInfos } from "@/utils/store";
import { truncateText } from "@/utils/helper";
import { userHierarchy } from "@/types/user";
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
						headerTitle: "Conversations",
						headerRight: () => {
							if (userHierarchy[userInfos.user.role] > 0) return null;

							return (
								<TouchableOpacity
									onPress={() => {
										router.push("/chat/new-room");
									}}
								>
									<PlusCircleIcon size={24} color="#000" />
								</TouchableOpacity>
							);
						},
						headerLeft: () => (
							<Link dismissTo href="/">
								<ArrowLeftIcon size={24} color="#000" />
							</Link>
						),
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
						presentation: Platform.OS === "ios" ? "formSheet" : undefined,
						sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
						header: () => <HeaderLayout title="Nouvelle conversation" />,
					}}
				/>
			</Stack>
		</NotificationProvider>
	);
}
