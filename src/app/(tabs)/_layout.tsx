import { BookOpenIcon, BriefcaseBusinessIcon, Grid2x2Icon, MessageCircleMoreIcon } from "lucide-react-native";
import { NotificationProvider } from "@/context/push-notifications";
import HeaderLayout from "@/layouts/headert-layout";
import { Redirect, Stack, Tabs } from "expo-router";
import { getStorageUserInfos } from "@/utils/store";
import config from "tailwind.config";
import React from "react";


export default function AppLayout() {
	const userInfos = React.useMemo(() => getStorageUserInfos(), []);

	if (!userInfos || !userInfos.token) {
		return <Redirect href="/login" />;
	}

	return (
		<NotificationProvider>
			<Tabs
				initialRouteName="index"
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: config.theme.extend.colors.primary,
					tabBarLabelStyle: {
						fontSize: 10,
						marginTop: 4,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					initialParams={{
						userJSON: JSON.stringify({
							firstname: userInfos.user.firstname,
							lastname: userInfos.user.lastname,
							photo: userInfos.user.photo,
							createdAt: userInfos.user.createdAt,
						}),
					}}
					options={{
						headerShown: false,
						tabBarIcon: ({ color }) => <Grid2x2Icon color={color} size={19} />,
						title: "Accueil",
					}}
				/>
				<Tabs.Screen
					name="organigramme"
					options={{
						title: "Valorem",
						headerShown: true,
						header: () => <HeaderLayout title="Organigramme" />,
						tabBarIcon: ({ color }) => <BriefcaseBusinessIcon color={color} size={20} />,
					}}
				/>
				<Tabs.Screen
					name="supplier-category"
					options={{
						title: "Fournisseurs",
						tabBarIcon: ({ color }) => <BookOpenIcon color={color} size={19} />,
					}}
				/>
				<Tabs.Screen
					name="contact"
					options={{
						header: () => <HeaderLayout title="Contacts" />,
						href: null,
					}}
				/>
				<Tabs.Screen
					name="chat"
					options={{
						title: "Messages",
						tabBarIcon: ({ color }) => <MessageCircleMoreIcon color={color} size={20} />,
					}}
				/>
				{/* <Tabs.Screen
					name="pdf"
					options={{
						header: () => <HeaderLayout title="Visionneuse PDF"  />,
						href: null,
					}}
				/> */}
			</Tabs>
		</NotificationProvider>
	);
}
