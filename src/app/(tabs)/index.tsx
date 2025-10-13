import { getEventsQuery } from "@/api/queries/event-queries";
import CardEvent from "@/components/card/card-event";
import Carousel from "@/components/carousel";
import ProfileDashboard from "@/components/profile-dashboard";
import BookFillIcon from "@/components/svg/book-fill-icon";
import BriefcaseFillIcon from "@/components/svg/briefcase-fill-icon";
import EventsFillIcon from "@/components/svg/events-fill-icon";
import ReceiptFillIcon from "@/components/svg/receipt-fill-icon";
import BackgroundLayout from "@/layouts/background-layout";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, LinkProps, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowRightIcon, MapPinnedIcon, Sparkles } from "lucide-react-native";
import config from "tailwind.config";

import CardLink from "@/components/card/card-link";
import CubeFillIcon from "@/components/svg/cude-fill-icon";

import LampIconFill from "@/components/svg/lamp-fill-icon";
import SportIconFill from "@/components/svg/sport-fill-icon";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import { User } from "@/types/user";
import { USER_LEONIE_ID, USER_MATHIEU_ID } from "@/utils/helper";
import { Image } from "expo-image";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import type { Math } from "react-native-math";
// import  { NitroModules } from "react-native-nitro-modules";

export default function Page() {
	// const notification = useNotification();
	const { data: upcomingEvents, isLoading: isLoadingEvents } = useQuery({
		queryKey: [
			"events",
			{
				sort: "event_start",
			},
		],
		queryFn: getEventsQuery,
		select: (data) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return data.docs?.filter((event) => new Date(event.event_start) >= today);
		},
	});

	const { userJSON } = useLocalSearchParams<{ userJSON: string }>();

	const { firstname, lastname, photo, id } = JSON.parse(userJSON) as Pick<
		User,
		"firstname" | "lastname" | "photo" | "id"
	>;

	// const math = NitroModules.createHybridObject<Math>("Math");

	return (
		<BackgroundLayout className="pt-safe mt-4 px-4">
			{/*{lastname === "Metier" || lastname === "Dev" ? (
				<View className="">
					<Text className="font-bold">DEV MODE</Text>
					<Text>Token notif : {notification.expoPushToken}</Text>
				</View>
			) : null}*/}
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<ProfileDashboard firstname={firstname} lastname={lastname} photo={photo} />

				<Title title="Fonctionnalités" />
				<View className="flex-row flex-wrap justify-between gap-y-4 rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10">
					{links.map((link) => {
						if (id !== USER_LEONIE_ID && id !== USER_MATHIEU_ID && link.link === "/(tabs)/sports") return;
						return (
							<View key={link.title} className="w-[32%] items-center ">
								<CardLink
									icon={link.icon}
									title={link.title}
									description={link.description}
									link={link.link}
									url={link.url}
									backgroundIcon={link.backgroundIcon}
								/>
							</View>
						);
					})}
				</View>

				<Link
					href={{
						pathname: "/selection",
					}}
					push
					asChild
				>
					<TouchableOpacity
						activeOpacity={0.8}
						className="relative mt-6 rounded-xl border border-primary bg-white  px-5 py-5"
					>
						{/* Main content */}
						<View className="flex-row items-center justify-between">
							<View className="flex-1 flex-row items-center gap-3">
								<Sparkles size={15} color="#FDB022" fill="#FDB022" />
								<Text className="text-md flex-1 font-bold text-primary">Notre sélection du moment</Text>
							</View>

							<ArrowRightIcon size={20} color={config.theme.extend.colors.primary} strokeWidth={3} />
						</View>
					</TouchableOpacity>
				</Link>

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
						<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
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
						<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
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
				<Carousel
					data={
						upcomingEvents || [
							{
								id: "1",
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
								event_start: new Date().toISOString(),
								event_end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
								title: "Réunion mensuelle du Groupe Valorem !",
								type: "food",
								annotation:
									"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero officia!",
							},
						]
					}
				>
					{(data, cardWidth) => {
						return data.map((item) => (
							<CardEvent
								isLoading={isLoadingEvents}
								event={{
									createdAt: item.createdAt,
									updatedAt: item.updatedAt,
									id: item.id,
									event_start: item.event_start,
									event_end: item.event_end,
									title: item.title,
									type: item.type,
									annotation: item.annotation,
								}}
								key={item.id}
								width={cardWidth}
							/>
						));
					}}
				</Carousel>

				<Title title="Réseaux sociaux" className="mx-auto text-lg" />
				<View className="flex-row items-center justify-center gap-16">
					<TouchableOpacity
						hitSlop={10}
						onPress={async () => {
							const linkedinUrl = "linkedin://company/groupe-valorem-conseil";
							const webUrl = "https://www.linkedin.com/company/groupe-valorem-conseil/posts/?feedView=all";

							try {
								const canOpen = await Linking.canOpenURL(linkedinUrl);

								if (canOpen) {
									await Linking.openURL(linkedinUrl);
								} else {
									await WebBrowser.openBrowserAsync(webUrl);
								}
							} catch (error) {
								await WebBrowser.openBrowserAsync(webUrl);
							}
						}}
					>
						<AntDesign name="linkedin-square" size={35} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
					<TouchableOpacity
						hitSlop={10}
						onPress={async () => {
							const instagramUrl = "instagram://user?username=groupe_valorem";
							const webUrl = "https://www.instagram.com/groupe_valorem/";

							try {
								const canOpen = await Linking.canOpenURL(instagramUrl);

								if (canOpen) {
									await Linking.openURL(instagramUrl);
								} else {
									await WebBrowser.openBrowserAsync(webUrl);
								}
							} catch (error) {
								await WebBrowser.openBrowserAsync(webUrl);
							}
						}}
					>
						<AntDesign name="instagram" size={35} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const links: {
	icon: React.ReactNode;
	title: string;
	description: string;
	backgroundIcon: string;
	link?: LinkProps["href"];
	url?: string;
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
		icon: <LampIconFill color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Bureaux",
		description: "Réservation",
		link: "/(tabs)/reservation",
		backgroundIcon: "bg-[#D2EED0]",
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
	{
		icon: <CubeFillIcon color={config.theme.extend.colors.primary} width={44} height={44} />,
		title: "Structurés",
		description: "Réservation",
		link: "/(tabs)/structured",
		backgroundIcon: "bg-[#CEFAFE]",
	},
	{
		icon: <Image source={require("@/assets/images/immobilier.png")} style={{ width: 58, height: 60 }} />,
		title: "Immobilier",
		description: "Immobilier",
		url: "https://www.groupe-dalbade-immobilier.fr/acheter",
		backgroundIcon: "bg-[#ffffff]",
	},
	{
		icon: <SportIconFill color={config.theme.extend.colors.primary} width={42} height={42} />,
		title: "Sport & Patrimoine",
		description: "Vie d'agence",
		link: "/(tabs)/sports",
		backgroundIcon: "bg-[#FEF3C7]",
	},
];
