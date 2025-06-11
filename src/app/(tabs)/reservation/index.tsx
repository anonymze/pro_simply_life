import { ArrowLeftIcon, ArrowRightIcon, BuildingIcon, Calendar1Icon, ClockIcon } from "lucide-react-native";
import Animated, { withSpring, withTiming } from "react-native-reanimated";
import { getReservationsQuery } from "@/api/queries/reservation-queries";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getEventsQuery } from "@/api/queries/event-queries";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { labels } from "@/types/reservation";
import { cn } from "@/utils/libs/tailwind";
import Title from "@/components/ui/title";
import React, { useState } from "react";
import { cssInterop } from "nativewind";
import config from "tailwind.config";
import { router } from "expo-router";


const TouchableOpacityAnimated = Animated.createAnimatedComponent(TouchableOpacity);

// Configure French locale
LocaleConfig.locales["fr"] = {
	monthNames: [
		"Janvier",
		"Février",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juillet",
		"Août",
		"Septembre",
		"Octobre",
		"Novembre",
		"Décembre",
	],
	monthNamesShort: ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
	dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
	dayNamesShort: ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"],
	today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";
cssInterop(Calendar, { className: "style" });

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["reservations"],
			queryFn: getReservationsQuery,
		},
		({ data }) => {
			const [selectedDate, setSelectedDate] = useState("");

			const reservations = React.useMemo(
				() =>
					data?.docs.reduce((acc: Record<string, any>, reservation) => {
						acc[reservation.day_reservation.split("T")[0]] = {
							marked: true,
							dotColor: config.theme.extend.colors.pink,
							reservation,
						};
						return acc;
					}, {}),
				[data],
			);

			const reservationsByDate = React.useMemo(() => {
				if (!selectedDate) return [];
				return data?.docs.filter((reservation) => reservation.day_reservation.split("T")[0] === selectedDate);
			}, [data, selectedDate]);

			console.log(reservationsByDate);

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Réservation de bureaux" />

					<Calendar
						firstDay={1}
						className="m-0 mt-5 rounded-2xl p-2 shadow-sm shadow-defaultGray/10"
						onDayPress={(day) => {
							setSelectedDate(day.dateString);
						}}
						renderArrow={(direction) => (
							<>
								{direction === "left" ? (
									<ArrowLeftIcon size={20} color={config.theme.extend.colors.backgroundChat} />
								) : (
									<ArrowRightIcon size={20} color={config.theme.extend.colors.backgroundChat} />
								)}
							</>
						)}
						headerStyle={{
							borderBottomWidth: 1,
							borderBottomColor: config.theme.extend.colors.primaryUltraLight,
							marginBottom: 10,
							paddingBottom: 10,
						}}
						theme={{
							// Header text color (month/year)
							monthTextColor: config.theme.extend.colors.primary,
							// Arrow colors
							arrowColor: config.theme.extend.colors.backgroundChat,
							// Day names color (Mon, Tue, etc.)
							textSectionTitleColor: config.theme.extend.colors.backgroundChat,

							// Day text color
							dayTextColor: config.theme.extend.colors.backgroundChat,
							// Today's text color
							todayTextColor: config.theme.extend.colors.dark,
							// Header font weight
							textMonthFontWeight: "bold",
							// Day names font weight
							textDayHeaderFontWeight: "400",
							textDayStyle: {
								color: config.theme.extend.colors.primary,
								fontWeight: "400",
							},
							// inactiv out of month dates
							textDisabledColor: config.theme.extend.colors.lightGray,
						}}
						markingType={"custom"}
						markedDates={{
							...reservations,
							[selectedDate]: {
								selected: true,
								marked: !!reservations[selectedDate],
								disableTouchEvent: true,
								dotColor: config.theme.extend.colors.pink,
								customStyles: {
									container: {
										backgroundColor: config.theme.extend.colors.primary,
										padding: 0,
										borderRadius: 6,
									},
									text: {
										fontSize: 14,
										paddingBottom: 1,
										color: "#fff",
										fontWeight: "regular",
									},
								},
							},
						}}
					/>

					{!!reservationsByDate.length && (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 16 }}
							className="mt-4"
						>
							<View className="gap-2 rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10">
								<Text className="font-semibold text-xl text-primary">Créneaux réservés</Text>
								{reservationsByDate.map((reservation) => (
									<View key={reservation.id} className="mt-2 flex-row items-center justify-between gap-3">
										<View
											className={cn(
												"h-16 w-2 rounded-full",
												reservation.desk === "1"
													? "bg-secondary"
													: reservation.desk === "2"
														? "bg-[#FFEAD5]"
														: "bg-[#E4F5D7]",
											)}
										/>
										<View className="flex-1 gap-2">
											<View className="flex-row items-center gap-2">
												<BuildingIcon size={20} color={config.theme.extend.colors.primary} />
												<Text className="text-md font-semibold text-primary">{labels[reservation.desk]}</Text>
											</View>

											<View className="flex-row items-center gap-2">
												<ClockIcon size={15} color={config.theme.extend.colors.primaryLight} />
												<Text className="text-md text-primaryLight">
													{new Date(reservation.start_time_reservation).toLocaleTimeString("fr-FR", {
														hour: "2-digit",
														minute: "2-digit",
													})}{" "}
													-{" "}
													{new Date(reservation.end_time_reservation).toLocaleTimeString("fr-FR", {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</Text>
											</View>
										</View>
									</View>
								))}
							</View>
						</ScrollView>
					)}

					{selectedDate && (
						<TouchableOpacityAnimated
							onPress={() => {
								router.push({
									pathname: "/(tabs)/reservation/[date]",
									params: {
										date: selectedDate,
									},
								});
							}}
							entering={() => {
								"worklet";
								return {
									initialValues: {
										transform: [{ translateY: 100 }],
										opacity: 0,
									},
									animations: {
										transform: [{ translateY: withSpring(0, { damping: 16, stiffness: 140 }) }],
										opacity: withTiming(1, { duration: 300 }),
									},
								};
							}}
							className="absolute bottom-5 left-0 right-0 mx-5 flex-row items-center justify-center gap-2 rounded-xl bg-primary p-3"
						>
							<Calendar1Icon size={20} color={"#fff"} />
							<Text className="text-center font-semibold text-lg text-white">Réserver un bureau</Text>
						</TouchableOpacityAnimated>
					)}
				</BackgroundLayout>
			);
		},
	)();
}
