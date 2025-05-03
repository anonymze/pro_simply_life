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
			</Stack>
		</NotificationProvider>
	);
}
