import { ActivityIndicator, ActivityIndicatorBase, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { ArrowDownRightIcon, ArrowUpRightIcon, DownloadIcon, ListIcon } from "lucide-react-native";
import { Commission, CommissionLight, CommissionMonthlyData } from "@/types/commission";
import { getCommissionMonthlyDataQuery } from "@/api/queries/commission-queries";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { HrefObject, Link, router } from "expo-router";
import resolveConfig from "tailwindcss/resolveConfig";
import { getStorageUserInfos } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { queryClient } from "@/api/_queries";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import React from "react";


const fullConfig = resolveConfig(config);

export default function Page() {
	const appUser = getStorageUserInfos();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["commissions-monthly", appUser?.user.id],
		queryFn: getCommissionMonthlyDataQuery,
	});

	if (isLoading) {
		return (
			<ActivityIndicator
				className="absolute bottom-0 left-0 right-0 top-0"
				size="large"
				color={config.theme.extend.colors.primary}
			/>
		);
	}

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Erreur</Text>
			</View>
		);
	}

	if (!data?.monthlyData) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Pas de contenu</Text>
			</View>
		);
	}

	return (
		<BackgroundLayout className="pt-safe px-4">
			<Title title="Mes commissions" />

			<Content data={data} />
		</BackgroundLayout>
	);
}

const Content = ({ data }: { data: CommissionMonthlyData }) => {
	const [lastMonth, setLastMonth] = React.useState<CommissionMonthlyData["monthlyData"][number]>(data.monthlyData[1]);

	// calculate percentages without useEffect - ensuring they add up to 100%
	const calculatePercentages = React.useMemo(() => {
		if (lastMonth.groupedData.total <= 0) {
			return { productionPercentage: 0, encoursPercentage: 0, structuredPercentage: 0 };
		}

		// calculate exact percentages
		const production = (lastMonth.groupedData.production / lastMonth.groupedData.total) * 100;
		const encours = (lastMonth.groupedData.encours / lastMonth.groupedData.total) * 100;
		const structured = (lastMonth.groupedData.structured_product / lastMonth.groupedData.total) * 100;

		// round the first two normally
		const productionRounded = Math.round(production);
		const encoursRounded = Math.round(encours);

		// make the third one the remainder to ensure total = 100%
		const structuredRounded = 100 - productionRounded - encoursRounded;

		return {
			productionPercentage: productionRounded,
			encoursPercentage: encoursRounded,
			structuredPercentage: Math.max(0, structuredRounded), // ensure it's not negative
		};
	}, [lastMonth]);

	return (
		<>
			<FlashList
				showsHorizontalScrollIndicator={false}
				data={data.monthlyData}
				horizontal
				estimatedItemSize={88}
				renderItem={({ item }) => {
					return (
						<View className="mr-3 rounded-lg bg-primary px-3.5 py-2">
							<Text className="text-sm text-white">{item.month}</Text>
						</View>
					);
				}}
			></FlashList>

			<Text className="mt-5 font-semibold text-lg text-primary">Résumé du mois</Text>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }} className="mt-3">
				<View className="rounded-2xl  bg-white p-4">
					<View className="items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-5">
						<Text className="text-primaryLight">Total des gains sur {lastMonth.month}</Text>
						<Text className="font-bold text-2xl text-primary">{lastMonth.totalAmount}€</Text>
					</View>
					<Text className="text-md mt-5 font-semibold text-primary">Répartition</Text>
					<View className="mt-5">
						<View className="flex-row">
							{calculatePercentages.productionPercentage > 0 && (
								<View
									className="mr-1 gap-1"
									style={{
										minWidth: getMinWidth(calculatePercentages.productionPercentage),
										flex:
											calculatePercentages.productionPercentage >= 5 ? calculatePercentages.productionPercentage : 0,
									}}
								>
									<Text className="text-center text-xs text-primaryLight">
										{calculatePercentages.productionPercentage}%
									</Text>
									<View className="h-1.5 w-full rounded-full bg-production" />
								</View>
							)}
							{calculatePercentages.encoursPercentage > 0 && (
								<View
									className="gap-1"
									style={{
										minWidth: getMinWidth(calculatePercentages.encoursPercentage),
										flex: calculatePercentages.encoursPercentage >= 5 ? calculatePercentages.encoursPercentage : 0,
									}}
								>
									<Text className="text-center text-xs text-primaryLight">
										{calculatePercentages.encoursPercentage}%
									</Text>
									<View className="h-1.5 w-full rounded-full bg-encours" />
								</View>
							)}
							{calculatePercentages.structuredPercentage > 0 && (
								<View
									className="ml-1 gap-1"
									style={{
										minWidth: getMinWidth(calculatePercentages.structuredPercentage),
										flex:
											calculatePercentages.structuredPercentage >= 5 ? calculatePercentages.structuredPercentage : 0,
									}}
								>
									<Text className="text-center text-xs text-primaryLight">
										{calculatePercentages.structuredPercentage}%
									</Text>
									<View className="h-1.5 w-full rounded-full bg-structured" />
								</View>
							)}
						</View>
					</View>
					<View className="mt-6 flex-row items-center gap-2">
						<View className="size-2 rounded-full bg-production" />
						<Text className="text-backgroundChat">Productions</Text>
						<Text className="ml-auto font-light text-sm text-primaryLight">{lastMonth.groupedData.production}€</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<View className="size-2 rounded-full bg-encours" />
						<Text className="text-backgroundChat">Encours</Text>
						<Text className="ml-auto font-light text-sm text-primaryLight">{lastMonth.groupedData.encours}€</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<View className="size-2 rounded-full bg-structured" />
						<Text className="text-backgroundChat">Produits structurés</Text>
						<Text className="ml-auto font-light text-sm text-primaryLight">
							{lastMonth.groupedData.structured_product}€
						</Text>
					</View>
					<Text className="text-md mb-3 mt-6 font-medium text-primary">Évolution vs mois précédent</Text>

					{lastMonth.comparison ? (
						<>
							{lastMonth.comparison.difference > 0 ? (
								<View className="flex-row items-center gap-2">
									<View className="size-6 items-center justify-center rounded-full bg-green-100">
										<ArrowUpRightIcon size={14} color={fullConfig.theme.colors.green[500]} />
									</View>
									<Text className="text-green-600">+{lastMonth.comparison.difference.toFixed(2)}€</Text>
								</View>
							) : (
								<View className="flex-row items-center gap-2">
									<View className="size-6 items-center justify-center rounded-full bg-red-100">
										<ArrowDownRightIcon size={14} color={fullConfig.theme.colors.red[500]} />
									</View>
									<Text className="text-red-600">{lastMonth.comparison.difference.toFixed(2)}€</Text>
								</View>
							)}
						</>
					) : (
						<Text className="text-sm text-primaryLight">Aucune comparaison disponible</Text>
					)}
					<View
						style={{
							borderBottomColor: "#bbb",
							borderBottomWidth: StyleSheet.hairlineWidth,
							marginBlock: 22,
						}}
					/>
					<SeeDetails
						id={lastMonth.id}
						commissions={lastMonth.commissions}
						link={{
							pathname: "/(tabs)/commissions/[commission]",
							params: {
								commission: lastMonth.id,
							},
						}}
					/>
				</View>
				{/* <Pressable
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
				</Pressable> */}
			</ScrollView>
		</>
	);
};

// minimum width for small percentages to ensure text is visible
const getMinWidth = (percentage: number) => {
	if (percentage === 0) return 0;
	if (percentage < 5) return 20; // minimum 20px for percentages < 5%
	return 0; // use flex for larger percentages
};

function SeeDetails({
	commissions,
	link,
	id,
}: {
	id: CommissionMonthlyData["monthlyData"][number]["id"];
	commissions: CommissionLight[];
	link: HrefObject;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["commissions", id], commissions);
	}, [commissions, id]);
	return (
		<Link asChild href={link}>
			<TouchableOpacity className="flex-row items-center gap-2" hitSlop={10} onPressIn={onPress}>
				<ListIcon size={18} color={config.theme.extend.colors.backgroundChat} />
				<Text className="font-semibold text-backgroundChat">Voir le détail</Text>
			</TouchableOpacity>
		</Link>
	);
}
