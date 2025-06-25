import { Link, LinkProps, router, useLocalSearchParams } from "expo-router";
import BriefcaseFillIcon from "@/components/svg/briefcase-fill-icon";
import BuildingFillIcon from "@/components/svg/building-fill-icon";
import ReceiptFillIcon from "@/components/svg/receipt-fill-icon";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { ArrowRight, MapPinnedIcon } from "lucide-react-native";
import EventsFillIcon from "@/components/svg/events-fill-icon";
import ProfileDashboard from "@/components/profile-dashboard";
import { getEventsQuery } from "@/api/queries/event-queries";
import { View, TouchableOpacity, Text } from "react-native";
import BookFillIcon from "@/components/svg/book-fill-icon";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import CardEvent from "@/components/card/card-event";
import CardLink from "@/components/card/card-link";
import { useQuery } from "@tanstack/react-query";
import Carousel from "@/components/carousel";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { User } from "@/types/user";


export default function Page() {
	const { data: events, isLoading: isLoadingEvents } = useQuery({
		queryKey: ["events"],
		queryFn: getEventsQuery,
	});
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
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<ProfileDashboard firstname={firstname} lastname={lastname} photo={photo} createdAt={createdAt} />

				<Title title="Fonctionnalités" />
				<View className="flex-row flex-wrap justify-between gap-y-4 rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10">
					{links.map((link) => (
						<View key={link.title} className="w-[32%] items-center ">
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
				<Title title="Newsletter" />
				<Link
					href={{
						pathname: "/fundesys",
					}}
					push
					asChild
				>
					<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 shadow-sm shadow-defaultGray/10">
						<View className="size-14 items-center justify-center overflow-hidden rounded-lg border border-defaultGray/10">
							<ImagePlaceholder
								source={require("@/assets/images/fundesys.png")}
								style={{ width: "100%", height: "100%" }}
							/>
						</View>
						<View className="flex-1">
							<Text className="font-semibold text-lg text-primary">Fundesys</Text>
						</View>
						<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
					</TouchableOpacity>
				</Link>
				<Link
					href={{
						pathname: "/fidnet",
					}}
					push
					asChild
				>
					<TouchableOpacity className="mt-3 w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 shadow-sm shadow-defaultGray/10">
						<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
							<ImagePlaceholder
								contentFit="contain"
								source={require("@/assets/icons/fidnet.svg")}
								style={{ width: 36, height: 36, borderRadius: 4 }}
							/>
						</View>
						<View className="flex-1">
							<Text className="font-semibold text-lg text-primary">Fidnet</Text>
						</View>
						<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
					</TouchableOpacity>
				</Link>
				<View className="mb-4 mt-7 flex-row items-center justify-between">
					<Title title="Évènements agence" className="mb-0 mt-0" />
					<Link href="/(tabs)/event" asChild>
						<TouchableOpacity hitSlop={10}>
							<Text className="font-semibold text-primaryLight">Voir tout</Text>
						</TouchableOpacity>
					</Link>
				</View>
				<Carousel data={[1, 2, 3, 4, 5]}>
					{(data, cardWidth) => {
						return data.map((item) => (
							<CardEvent
								isLoading={isLoadingEvents}
								event={{
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
									id: "heydzldzhdhodizhio",
									event_start: new Date().toISOString(),
									event_end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
									title: "Réunion mensuelle du Groupe Valorem !",
									type: "Masterclass",
									annotation:
										"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero officia!",
								}}
								key={item}
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
		link: "/(tabs)/supplier-category",
		backgroundIcon: "bg-[#E0F2FE]",
	},
	{
		icon: <BriefcaseFillIcon color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Organigramme",
		description: "Organigramme",
		link: "/(tabs)/organigramme",
		backgroundIcon: "bg-[#EBE9FE]",
	},
	{
		icon: <ReceiptFillIcon color={config.theme.extend.colors.primary} width={44} height={44} />,
		title: "Commissions",
		description: "Commissions",
		link: "/(tabs)/commissions",
		backgroundIcon: "bg-[#E0EAFF]",
	},

	{
		icon: <BuildingFillIcon color={config.theme.extend.colors.primary} width={44} height={44} />,
		title: "Bureaux",
		description: "Réservation",
		link: "/(tabs)/reservation",
		backgroundIcon: "bg-[#E4F5D7]",
	},
	{
		icon: <EventsFillIcon color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Évènements",
		description: "Vie d'agence",
		link: "/(tabs)/event",
		backgroundIcon: "bg-[#FCE7F6]",
	},
	{
		icon: <MapPinnedIcon size={40} color={config.theme.extend.colors.primary} />,
		title: "Contacts",
		description: "Carte",
		link: "/(tabs)/contact",
		backgroundIcon: "bg-[#FFEAD5]",
	},
];
