import { CalendarIcon, NewspaperIcon, ArrowRight, MapPinnedIcon, KeyRoundIcon } from "lucide-react-native";
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { MobileMediaQuery, TabletMediaQuery } from "@/utils/responsive";
import ProfileDashboard from "@/components/profile-dashboard";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useLocalSearchParams } from "expo-router";
import { AppleWidget } from "@/components/apple-widget";
import CardEvent from "@/components/card/card-event";
import CardLink from "@/components/card/card-link";
import Carousel from "@/components/carousel";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { User } from "@/types/user";


const sampleData = [
	{
		id: "1",
		title: "📱 Nouvelle évènement",
		subtitle: "Découvrez la team de choc du Groupe Valorem !",
		background: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
	},
	{
		id: "2",
		title: "⚡ Mise à jour du quantium Valorem",
		subtitle: "Participez à la mise à jour du quantium",
		background: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
	},
	{
		id: "3",
		title: "📸 Shooting photos de l'équipe",
		subtitle: "Apportez votre meilleur costume !",
		background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
	},
	{
		id: "4",
		title: "Groupe Valorem Invitation",
		subtitle: "Participez à l'invitation du Groupe Valorem",
		background: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
	},
	{
		id: "5",
		title: "🌤️ Météo du jour",
		subtitle: "Prévisions météo à Toulouse",
		background: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
	},
];

const screenWidth = Dimensions.get("window").width;

export default function Page() {
	const { userJSON } = useLocalSearchParams<{ userJSON: string }>();
	const { firstname, lastname, photo, createdAt } = JSON.parse(userJSON) as Pick<
		User,
		"firstname" | "lastname" | "photo" | "createdAt"
	>;

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top", "right", "left"]}>
			<BackgroundLayout className="px-4 pt-4">
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 10 }}
				>
					<ProfileDashboard firstname={firstname} lastname={lastname} photo={photo} createdAt={createdAt} />
					<Title title="Vie d'agence Valorem" />
					{/* <Carousel data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
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
					</Carousel> */}
					<View className="mt-4">
						<AppleWidget items={sampleData} />
					</View>
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
				</ScrollView>
			</BackgroundLayout>
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
