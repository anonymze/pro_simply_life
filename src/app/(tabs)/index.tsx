import { Text, View, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { CalendarIcon, NewspaperIcon, ArrowRight, MapPinnedIcon, KeyRoundIcon, } from "lucide-react-native";
import { MobileMediaQuery, TabletMediaQuery } from "@/utils/responsive";
import ProfileDashboard from "@/components/profile-dashboard";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useLocalSearchParams } from "expo-router";
import CardLink from "@/components/card/card-link";
import CardEvent from "@/components/card-event";
import Carousel from "@/components/carousel";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { User } from "@/types/user";
import { cn } from "@/utils/cn";
import React from "react";


const screenWidth = Dimensions.get("window").width;

export default function Page() {
	const { userJSON } = useLocalSearchParams<{ userJSON: string }>();
	const { firstname, lastname, photo, createdAt } = JSON.parse(userJSON) as Pick<
		User,
		"firstname" | "lastname" | "photo" | "createdAt"
	>;

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top", "right", "left"]}>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
			>
				<BackgroundLayout className="p-4">
					<ProfileDashboard firstname={firstname} lastname={lastname} photo={photo} createdAt={createdAt} />
					<Title title="Vie d'agence Valorem" />
					<Carousel data={[1,2,3,4,5,6,7,8,9,10]} />
					<Link href="/" push asChild className="mt-2 py-2 pr-2">
						<TouchableOpacity className=" flex-row items-center gap-2">
							<Text className="font-semiBold text-base text-defaultGray">Voir tous les évènements à venir</Text>
							<ArrowRight size={16} color={config.theme.extend.colors.defaultGray} />
						</TouchableOpacity>
					</Link>
					<Title title="Fonctionnalités" />
					<TabletMediaQuery screenWidth={screenWidth}>
						<View className="flex-row flex-wrap">
							{links.map((link) => (
								<View key={link.title} className="w-1/2 bg-background p-1.5">
									<CardLink icon={link.icon} title={link.title} description={link.description} link={link.link} />
								</View>
							))}
						</View>
					</TabletMediaQuery>
					<MobileMediaQuery screenWidth={screenWidth}>
						<View className="flex-row flex-wrap">
							{links.map((link) => (
								<View key={link.title} className="w-1/2 bg-background p-1">
									<CardLink icon={link.icon} title={link.title} description={link.description} link={link.link} />
								</View>
							))}
						</View>
					</MobileMediaQuery>
				</BackgroundLayout>
			</ScrollView>
		</SafeAreaView>
	);
}

const links = [
	{
		icon: <NewspaperIcon size={24} color={config.theme.extend.colors.secondaryDark} />,
		title: "Fundesys",
		description: "Newsletter hebdomadaire",
		link: "/",
	},
	{
		icon: <NewspaperIcon size={24} color={config.theme.extend.colors.secondaryDark} />,
		title: "Fidnet",
		description: "Newsletter hebdomadaire",
		link: "/",
	},
	{
		icon: <KeyRoundIcon size={24} color={config.theme.extend.colors.secondaryDark} />,
		title: "Bureaux",
		description: "Réservation de bureaux",
		link: "/",
	},
	{
		icon: <CalendarIcon size={24} color={config.theme.extend.colors.secondaryDark} />,
		title: "Évènements",
		description: "Dates à ne pas manquer",
		link: "/",
	},

	{
		icon: <MapPinnedIcon size={24} color={config.theme.extend.colors.secondaryDark} />,
		title: "Contacts",
		description: "Carte des contacts utiles",
		link: "/contact",
	},
];
