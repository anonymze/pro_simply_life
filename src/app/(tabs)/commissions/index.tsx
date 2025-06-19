import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import Title from "@/components/ui/title";
import { ActivityIndicatorBase, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStorageUserInfos } from "@/utils/store";
import resolveConfig from "tailwindcss/resolveConfig";
import { getCommissionsQuery } from "@/api/queries/commission-queries";
import { ArrowDownRightIcon, ArrowUpRightIcon, DownloadIcon, ListIcon } from "lucide-react-native";
import config from "tailwind.config";
import { Link } from "expo-router";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";

const fullConfig = resolveConfig(config);

export default function Page() {
	const appUser = getStorageUserInfos();

	console.log(appUser?.user);

	return withQueryWrapper(
		{
			queryKey: ["commissions", appUser?.user.id],
			queryFn: getCommissionsQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Mes commissions" />

					<FlashList
						showsHorizontalScrollIndicator={false}
						data={new Array(20).fill(1)}
						horizontal
						renderItem={(item) => {
							return (
								<View className="mr-3 rounded-lg bg-primary px-3.5 py-2">
									<Text className="text-sm text-white">Mai 2025</Text>
								</View>
							);
						}}
					></FlashList>

					<Text className="mt-5 font-semibold text-lg text-primary">Résumé du mois</Text>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 16 }}
						className="mt-3"
					>
						<View className="rounded-2xl  bg-white p-4">
							<View className="items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-5">
								<Text className="text-primaryLight">Total des gains sur mai 2025</Text>
								<Text className="font-bold text-2xl text-primary">840,00€</Text>
							</View>
							<Text className="text-md mt-5 font-semibold text-primary">Répartition</Text>
							<View className="mt-5 flex-row items-center pr-2">
								<View className="mr-1 w-[34%]">
									<Text className="mb-1 text-xs text-primaryLight">34%</Text>
									<View className="bg-production h-1.5 w-full rounded-full"></View>
								</View>
								<View className="mr-1 w-[33%]">
									<Text className="mb-1 text-xs text-primaryLight">34%</Text>
									<View className="bg-encours h-1.5 w-full rounded-full"></View>
								</View>
								<View className="mr-1 w-[33%]">
									<Text className="mb-1 text-xs text-primaryLight">34%</Text>
									<View className="bg-structured h-1.5 w-full rounded-full"></View>
								</View>
							</View>
							<View className="mt-5 flex-row items-center gap-2">
								<View className="bg-production size-2 rounded-full" />
								<Text className="text-backgroundChat">Productions</Text>
								<Text className="ml-auto font-light text-sm text-primaryLight">420,00€</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<View className="bg-encours size-2 rounded-full" />
								<Text className="text-backgroundChat">Encours</Text>
								<Text className="ml-auto font-light text-sm text-primaryLight">420,00€</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<View className="bg-structured size-2 rounded-full" />
								<Text className="text-backgroundChat">Produits structurés</Text>
								<Text className="ml-auto font-light text-sm text-primaryLight">420,00€</Text>
							</View>
							<Text className="text-md mb-3 mt-6 font-medium text-primary">Évolution vs mois précédent</Text>
							<View className="flex-row items-center gap-2">
								<View className="size-6 items-center justify-center rounded-full bg-green-100">
									<ArrowUpRightIcon size={14} color={fullConfig.theme.colors.green[500]} />
								</View>
								<Text className="text-green-600">+90€</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<View className="bg-red-100 size-6 items-center justify-center rounded-full">
									<ArrowDownRightIcon size={14} color={fullConfig.theme.colors.red[500]} />
								</View>
								<Text className="text-red-600">-90€</Text>
							</View>
							<View
								style={{
									borderBottomColor: "#bbb",
									borderBottomWidth: StyleSheet.hairlineWidth,
									marginBlock: 22,
								}}
							></View>
							<Link
								asChild
								href={{
									pathname: "/(tabs)/commissions/[commission]",
									params: {
										commission: "hey",
									},
								}}
							>
								<TouchableOpacity className="flex-row items-center gap-2" hitSlop={10}>
									<ListIcon size={18} color={config.theme.extend.colors.backgroundChat} />
									<Text className="font-semibold text-backgroundChat">Voir le détail</Text>
								</TouchableOpacity>
							</Link>
						</View>
						<Pressable
							onPress={() => {}}
							disabled={false}
							className="mt-5 h-14 w-full items-center justify-center rounded-xl bg-primary disabled:opacity-70"
						>
							{false ? (
								<Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOut.duration(300)}>
									<ActivityIndicatorBase size="small" color="white" />
								</Animated.View>
							) : (
								<Animated.View entering={FadeInDown.springify().duration(1200)} className="flex-row items-center gap-3">
									<Text className="text-center font-semibold text-lg text-white">Télécharger le PDF</Text>
									<DownloadIcon size={20} color="#fff" />
								</Animated.View>
							)}
						</Pressable>
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}
