import { NotificationProvider } from "@/context/push-notifications";
import BriefcaseIcon from "@/components/briefcase-icon";
import BookIconFill from "@/components/book-fill-icon";
import MessagesIcon from "@/components/messages-icon";
import HeaderLayout from "@/layouts/headert-layout";
import { getStorageUserInfos } from "@/utils/store";
import HomeIcon from "@/components/home-icon";
import BookIcon from "@/components/book-icon";
import { Redirect, Tabs } from "expo-router";
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
						fontSize: 10.5,
						marginTop: 4,
						fontWeight: "400",
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
						tabBarIcon: ({ color }) => {
							return <HomeIcon color={color} fill={color === config.theme.extend.colors.primary ? color : "none"} />;
						},
						title: "Accueil",
					}}
				/>
				<Tabs.Screen
					name="organigramme"
					options={{
						title: "Groupe Valorem",
						headerShown: true,
						header: () => <HeaderLayout title="Organigramme" backButton={false} />,
						tabBarIcon: ({ color }) => <BriefcaseIcon color={color} />,
					}}
				/>
				<Tabs.Screen
					name="supplier-category"
					options={{
						title: "Fournisseurs",
						tabBarIcon: ({ color }) => {
							if (color === config.theme.extend.colors.primary) {
								return <BookIconFill color={color} />;
							}
							return <BookIcon color={color} />;
						},
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
						tabBarIcon: ({ color }) => <MessagesIcon color={color} />,
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
