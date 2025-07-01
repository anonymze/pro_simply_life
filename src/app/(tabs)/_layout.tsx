import BookIconFill from "@/components/svg/book-fill-icon";
import BookIcon from "@/components/svg/book-icon";
import BriefcaseFillIcon from "@/components/svg/briefcase-fill-icon";
import BriefcaseIcon from "@/components/svg/briefcase-icon";
import HomeIcon from "@/components/svg/home-icon";
import MessagesFillIcon from "@/components/svg/messages-fill-icon";
import MessagesIcon from "@/components/svg/messages-icon";
import HeaderLayout from "@/layouts/headert-layout";
import { getStorageUserInfos } from "@/utils/store";
import { Redirect, Tabs } from "expo-router";
import { Pressable } from "react-native-gesture-handler";
import config from "tailwind.config";

export default function AppLayout() {
	const userInfos = getStorageUserInfos();

	if (!userInfos || !userInfos.token) {
		return <Redirect href="/login" />;
	}

	return (
		<Tabs
			// TODO
			initialRouteName="index"
			screenOptions={{
				headerShown: false,
				animation: "shift",
				tabBarActiveTintColor: config.theme.extend.colors.primary,
				tabBarLabelStyle: {
					fontSize: 10.5,
					marginTop: 4,
					fontWeight: "400",
				},
				// @ts-expect-error
				tabBarButton: (props) => <Pressable {...props} android_ripple={null} />,
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
					title: "Organigramme",
					headerShown: false,
					tabBarIcon: ({ color }) => {
						if (color === config.theme.extend.colors.primary) {
							return <BriefcaseFillIcon color={color} />;
						}
						return <BriefcaseIcon color={color} />;
					},
				}}
			/>
			<Tabs.Screen
				name="reservation"
				options={{
					title: "Réservation",
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="fidnet"
				options={{
					title: "Fidnet",
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="fundesys"
				options={{
					title: "Fundesys",
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="structured"
				options={{
					title: "Structured",
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="sports"
				options={{
					title: "sports",
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="commissions"
				options={{
					title: "Commissions",
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="event"
				options={{
					title: "Réservation",
					headerShown: false,
					href: null,
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
					headerShown: true,
					header: () => <HeaderLayout backgroundColor="bg-white" />,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="chat"
				options={{
					title: "Messages",
					tabBarIcon: ({ color }) => {
						if (color === config.theme.extend.colors.primary) {
							return <MessagesFillIcon color={color} />;
						}
						return <MessagesIcon color={color} />;
					},
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
	);
}
