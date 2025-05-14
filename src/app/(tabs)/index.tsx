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
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { User } from "@/types/user";
import { cn } from "@/utils/cn";
import React from "react";


const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 38;
const cardWidth = screenWidth - horizontalPadding;

export default function Page() {
	const { userJSON } = useLocalSearchParams<{ userJSON: string }>();
	const { firstname, lastname, photo, createdAt } = JSON.parse(userJSON) as Pick<
		User,
		"firstname" | "lastname" | "photo" | "createdAt"
	>;

	const [currentIndex, setCurrentIndex] = React.useState(0);

	const handleScrollEnd = React.useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const offsetX = event.nativeEvent.contentOffset.x;
			const index = Math.round(offsetX / cardWidth);
			setCurrentIndex(~~index);
		},
		[cardWidth],
	);

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
					<ScrollView
						onScroll={handleScrollEnd}
						horizontal
						showsHorizontalScrollIndicator={false}
						className="-mr-4"
						decelerationRate={0.1}
						snapToOffsets={[
							0,
							cardWidth + 16,
							cardWidth * 2 + 16 * 2,
							cardWidth * 3 + 16 * 3,
							cardWidth * 4 + 16 * 4,
							cardWidth * 5 + 16 * 5,
						]}
						contentContainerStyle={{ paddingRight: 24, gap: 16 }} // keep right padding for last card
						scrollEventThrottle={200}
					>
						<CardEvent
							date="2025-05-05"
							title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							type="Masterclass"
							description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							width={cardWidth}
						/>
						<CardEvent
							date="2025-05-05"
							title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							type="Masterclass"
							description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							width={cardWidth}
						/>
						<CardEvent
							date="2025-05-05"
							title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							type="Masterclass"
							description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							width={cardWidth}
						/>
						<CardEvent
							date="2025-05-05"
							title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							type="Masterclass"
							description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							width={cardWidth}
						/>
						<CardEvent
							date="2025-05-05"
							title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							type="Masterclass"
							description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							width={cardWidth}
						/>
						<CardEvent
							date="2025-05-05"
							title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							type="Masterclass"
							description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
							width={cardWidth}
						/>
					</ScrollView>
					<View className="mt-4 flex-row items-center gap-2">
						<View className={cn("size-1.5 rounded-full bg-defaultGray/30", currentIndex === 0 && "bg-dark")} />
						<View className={cn("size-1.5 rounded-full bg-defaultGray/30", currentIndex === 1 && "bg-dark")} />
						<View className={cn("size-1.5 rounded-full bg-defaultGray/30", currentIndex === 2 && "bg-dark")} />
						<View className={cn("size-1.5 rounded-full bg-defaultGray/30", currentIndex === 3 && "bg-dark")} />
						<View className={cn("size-1.5 rounded-full bg-defaultGray/30", currentIndex === 4 && "bg-dark")} />
						<View className={cn("size-1.5 rounded-full bg-defaultGray/30", currentIndex === 5 && "bg-dark")} />
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
