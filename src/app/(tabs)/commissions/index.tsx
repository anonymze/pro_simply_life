import Animated, { FadeInDown, FadeOut, useSharedValue, withTiming, useDerivedValue, runOnJS, FadeIn, FadeInUp, } from "react-native-reanimated";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { getCommissionMonthlyAndYearlyDataQuery } from "@/api/queries/commission-queries";
import { CommissionLight, CommissionMonthlyAndYearlyData } from "@/types/commission";
import { ArrowDownRightIcon, ArrowUpRightIcon, ListIcon } from "lucide-react-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import BackgroundLayout from "@/layouts/background-layout";
import { Bar, CartesianChart, Line } from "victory-native";
import resolveConfig from "tailwindcss/resolveConfig";
import { getStorageUserInfos } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { Picker } from "@expo/ui/swift-ui";
import { cn } from "@/utils/libs/tailwind";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import React from "react";


const DATAS = Array.from({ length: 12 }, (_, index) => ({
	// Starting at 1 for January
	month: index + 1,
	// Randomizing the listen count between 100 and 50
	listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}));

const fullConfig = resolveConfig(config);

// Animated Number Component
const AnimatedNumber = ({ value, duration = 400 }: { value: number; duration?: number }) => {
	const animatedValue = useSharedValue(0);
	const [displayValue, setDisplayValue] = React.useState(0);

	React.useEffect(() => {
		animatedValue.value = withTiming(value, { duration }, (finished) => {
			if (finished) {
				// when an animation is finished, we set the display real value
				runOnJS(setDisplayValue)(value);
			}
		});
	}, [value, duration]);

	useDerivedValue(() => {
		if (animatedValue.value === value) return;
		const currentValue = Math.round(animatedValue.value);
		runOnJS(setDisplayValue)(currentValue);
	});

	return <Text className="font-bold text-2xl text-primary">{displayValue}€</Text>;
};

export default function Page() {
	const scrollRef = React.useRef<ScrollView>(null);
	const appUser = getStorageUserInfos();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["commissions-monthly", appUser?.user.id],
		queryFn: getCommissionMonthlyAndYearlyDataQuery,
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

	if (!data?.monthlyData.length) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Pas de contenu</Text>
			</View>
		);
	}

	return (
		<BackgroundLayout className="pt-safe px-4">
			<View className="iems-center flex-row justify-between">
				<Title title="Commissions" />
				<Picker
					style={{
						width: 140,
						alignSelf: "center",
						marginTop: 8,
					}}
					variant="segmented"
					options={["Mois", "Année"]}
					selectedIndex={null}
					onOptionSelected={({ nativeEvent: { index } }) => {
						if (index === 0) {
							scrollRef.current?.scrollTo({ x: 0, animated: true });
						} else {
							scrollRef.current?.scrollToEnd();
						}
					}}
				/>
			</View>

			<ScrollView
				ref={scrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEnabled={false}
				decelerationRate={"fast"}
				contentContainerStyle={{ gap: 16 }}
				style={{
					marginTop: 16,
				}}
			>
				<View style={{ width: Dimensions.get("window").width - 28 }}>
					<WrappeContent type="monthly" data={data} />
				</View>
				<View style={{ width: Dimensions.get("window").width - 28 }}>
					<WrappeContent type="yearly" data={data} />
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const WrappeContent = ({ data, type }: { data: CommissionMonthlyAndYearlyData; type: "monthly" | "yearly" }) => {
	const [lastMonth, setLastMonth] = React.useState<
		CommissionMonthlyAndYearlyData["monthlyData"][number] | CommissionMonthlyAndYearlyData["yearlyData"][number]
	>(type === "monthly" ? data.monthlyData[0] : data.yearlyData[0]);
	return (
		<>
			<FlashList
				showsHorizontalScrollIndicator={false}
				data={type === "monthly" ? data.monthlyData : data.yearlyData}
				horizontal
				estimatedItemSize={88}
				extraData={lastMonth.id}
				renderItem={({ item }) => {
					return (
						<Pressable
							className={cn(
								"mr-3 rounded-lg bg-darkGray px-3.5 py-2",
								lastMonth.id === item.id && "bg-primary text-white",
							)}
							onPress={() => setLastMonth(item)}
						>
							<Text className={cn("font-semibold text-sm text-primary", lastMonth.id === item.id && "text-white")}>
								{item.labelDate}
							</Text>
						</Pressable>
					);
				}}
			></FlashList>
			<Content data={lastMonth} />
		</>
	);
};

const Content = ({
	data,
}: {
	data: CommissionMonthlyAndYearlyData["monthlyData"][number] | CommissionMonthlyAndYearlyData["yearlyData"][number];
}) => {
	const font = useFont(require("@/assets/fonts/PlusJakartaSans-Regular.ttf"), 12);
	// calculate percentages without useEffect - ensuring they add up to 100%
	const calculatePercentages = React.useMemo(() => {
		if (data.groupedData.total <= 0) {
			return { productionPercentage: 0, encoursPercentage: 0, structuredPercentage: 0 };
		}

		// calculate exact percentages
		const production = (data.groupedData.production / data.groupedData.total) * 100;
		const encours = (data.groupedData.encours / data.groupedData.total) * 100;

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
	}, [data]);

	return (
		<>
			<Text className="mt-5 font-semibold text-lg text-primary">Résumé du mois</Text>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }} className="mt-3">
				<View className="rounded-2xl  bg-white p-4 shadow-sm shadow-defaultGray/10">
					<View className="items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-5">
						<Text className="text-primaryLight">Total des gains sur {data.labelDate}</Text>
						<AnimatedNumber value={data.totalAmount} />
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
						<Text className="ml-auto font-light text-sm text-primaryLight">
							{data.groupedData.production.toFixed(2)}€
						</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<View className="size-2 rounded-full bg-encours" />
						<Text className="text-backgroundChat">Encours</Text>
						<Text className="ml-auto font-light text-sm text-primaryLight">{data.groupedData.encours.toFixed(2)}€</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<View className="size-2 rounded-full bg-structured" />
						<Text className="text-backgroundChat">Produits structurés</Text>
						<Text className="ml-auto font-light text-sm text-primaryLight">
							{data.groupedData.structured_product.toFixed(2)}€
						</Text>
					</View>
					<Text className="text-md mb-3 mt-6 font-medium text-primary">
						Évolution vs {"commissions" in data ? "mois précédent" : "année précédente"}
					</Text>

					{data.comparison ? (
						<>
							{data.comparison.difference > 0 && (
								<Animated.View
									entering={FadeInDown.springify().duration(1200)}
									exiting={FadeOut.duration(200)}
									className="flex-row items-center gap-2"
								>
									<View className="size-6 items-center justify-center rounded-full bg-green-100">
										<ArrowUpRightIcon size={14} color={fullConfig.theme.colors.green[500]} />
									</View>
									<Text className="text-green-600">+{data.comparison.difference.toFixed(2)}€</Text>
								</Animated.View>
							)}

							{data.comparison.difference < 0 && (
								<Animated.View
									entering={FadeInUp.springify().duration(1200)}
									exiting={FadeOut.duration(200)}
									className="flex-row items-center gap-2"
								>
									<View className="size-6 items-center justify-center rounded-full bg-red-100">
										<ArrowDownRightIcon size={14} color={fullConfig.theme.colors.red[500]} />
									</View>
									<Text className="text-red-600">{data.comparison.difference.toFixed(2)}€</Text>
								</Animated.View>
							)}
						</>
					) : (
						<Animated.Text
							exiting={FadeOut.duration(200)}
							entering={FadeIn.duration(200)}
							className="py-0.5 text-sm text-primaryLight"
						>
							Aucune comparaison disponible
						</Animated.Text>
					)}
					{"commissions" in data && (
						<>
							<View
								style={{
									borderBottomColor: "#bbb",
									borderBottomWidth: StyleSheet.hairlineWidth,
									marginBlock: 22,
								}}
							/>

							<SeeDetails
								id={data.id}
								commissions={data.commissions}
								link={{
									pathname: "/(tabs)/commissions/[commission]",
									params: {
										commission: data.id,
									},
								}}
							/>
						</>
					)}
				</View>

				<Text className="mt-6 font-semibold text-lg text-primary">
					{"commissions" in data ? "Évolution mois par mois" : "Évolution année par année"}
				</Text>
				<View className="mt-3 h-72 rounded-2xl bg-white p-4">
					<CartesianChart
						data={DATAS}
						xKey="month"
						yKeys={["listenCount"]}
						// 👇 Add domain padding to the chart to prevent the first and last bar from being cut off.
						domainPadding={{
							left: 25,
							right: 25,
							top: 5,
							bottom: 0,
						}}
						axisOptions={{
							/**
							 * 👇 Pass the font object to the axisOptions.
							 * This will tell CartesianChart to render axis labels.
							 */
							font,
							lineColor: config.theme.extend.colors.darkGray,
							lineWidth: {
								grid: {
									y: 1,
									x: 0,
								},
								frame: 0,
							},
							// where the axes are (top, bottom, left, right)
							// axisSide: {
							// 	x: "bottom",
							// 	y: "left",
							// },

							isNumericalData: false,

							// values of the ticks
							tickValues: {
								y: [0, 20, 40, 60, 80, 100, 120, 140],
								x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
							},
							// number of ticks (lines)
							// tickCount: 12,

							formatYLabel: (value) => {
								return `€${value}`;
							},
							formatXLabel: (value) => {
								const date = new Date(2025, value - 1);
								return "commissions" in data ? date.toLocaleString("fr-FR", { month: "short" }) : date.toLocaleString("fr-FR", { year: "numeric" });
							},
							labelColor: config.theme.extend.colors.primaryLight,
							labelOffset: 5,
						}}
					>
						{({ points, chartBounds }) => (
							<Bar
								chartBounds={chartBounds}
								points={points.listenCount}
								/**
								 * 👇 We can round the top corners of our bars by passing a number
								 * to the roundedCorners prop. This will round the top left and top right.
								 */
								roundedCorners={{
									topLeft: 5,
									topRight: 5,
								}}
							>
								{/* 👇 We add a gradient to the bars by passing a LinearGradient as a child. */}
								<LinearGradient
									start={vec(0, 0)} // 👈 The start and end are vectors that represent the direction of the gradient.
									end={vec(0, 400)}
									colors={[
										// 👈 The colors are an array of strings that represent the colors of the gradient.
										config.theme.extend.colors.primary,
										config.theme.extend.colors.primary, // 👈 The second color is the same as the first but with an alpha value of 50%.
									]}
								/>
							</Bar>
						)}
					</CartesianChart>
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
	id: CommissionMonthlyAndYearlyData["monthlyData"][number]["id"];
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
