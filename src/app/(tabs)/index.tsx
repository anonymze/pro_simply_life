import BriefcaseFillIcon from "@/components/svg/briefcase-fill-icon";
import { Link, LinkProps, useLocalSearchParams } from "expo-router";
import BuildingFillIcon from "@/components/svg/building-fill-icon";
import EventsFillIcon from "@/components/svg/events-fill-icon";
import { useNotification } from "@/context/push-notifications";
import ProfileDashboard from "@/components/profile-dashboard";
import { View, TouchableOpacity, Text } from "react-native";
import BookFillIcon from "@/components/svg/book-fill-icon";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import CardEvent from "@/components/card/card-event";
import { MapPinnedIcon } from "lucide-react-native";
import CardLink from "@/components/card/card-link";
import Carousel from "@/components/carousel";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { User } from "@/types/user";


export default function Page() {
	const { expoPushToken, notification } = useNotification();
	const { userJSON } = useLocalSearchParams<{ userJSON: string }>();
	const { firstname, lastname, photo, createdAt } = JSON.parse(userJSON) as Pick<
		User,
		"firstname" | "lastname" | "photo" | "createdAt"
	>;

	return (
		<BackgroundLayout className="pt-safe mt-4 px-4">
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 10 }}
			>
				<ProfileDashboard firstname={firstname} lastname={lastname} photo={photo} createdAt={createdAt} />

				<Title title="Fonctionnalités" />
				<View className="flex-row flex-wrap gap-y-4 rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10">
					{links.map((link) => (
						<View key={link.title} className="w-1/3 items-center">
							<CardLink
								icon={link.icon}
								title={link.title}
								description={link.description}
								link={link.link}
								backgroundIcon={link.backgroundIcon}
							/>
						</View>
					))}
				</View>
				<View className="mb-4 mt-7 flex-row items-center justify-between">
					<Title title="Vie d'agence Valorem" className="mb-0 mt-0" />
					<Link href="/" asChild>
						<TouchableOpacity hitSlop={10}>
							<Text className="font-semibold text-primaryLight">Voir tout</Text>
						</TouchableOpacity>
					</Link>
				</View>
				<Carousel data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
					{(data, cardWidth) => {
						return data.map((item) => (
							<CardEvent
								key={item}
								date="2025-05-05"
								title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero officia!"
								type="Masterclass"
								description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero officia!"
								width={cardWidth}
							/>
						));
					}}
				</Carousel>
			</ScrollView>
		</BackgroundLayout>
	);
}

const links: {
	icon: React.ReactNode;
	title: string;
	description: string;
	link: LinkProps["href"];
	backgroundIcon: string;
}[] = [
	{
		icon: <BookFillIcon color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Fournisseurs",
		description: "Newsletter",
		link: "/",
		backgroundIcon: "bg-[#E0F2FE]",
	},
	{
		icon: <BriefcaseFillIcon color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Organigramme",
		description: "Organigramme",
		link: "/",
		backgroundIcon: "bg-[#EBE9FE]",
	},

	{
		icon: <BuildingFillIcon color={config.theme.extend.colors.primary} width={44} height={44} />,
		title: "Bureaux",
		description: "Réservation",
		link: "/",
		backgroundIcon: "bg-[#ECFAF5]",
	},
	{
		icon: <EventsFillIcon color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Évènements",
		description: "Vie d'agence",
		link: "/",
		backgroundIcon: "bg-[#FFEAD5]",
	},
	{
		icon: <MapPinnedIcon size={40} color={config.theme.extend.colors.primary} />,
		title: "Contacts",
		description: "Carte",
		link: "/contact",
		backgroundIcon: "bg-[#E0EAFF]",
	},
];
