import { queryClient } from "@/api/_queries";
import { getEventsQuery } from "@/api/queries/event-queries";
import CardList from "@/components/card/card-event";
import { MyTouchableScaleOpacity } from "@/components/my-pressable";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Event, eventLabel } from "@/types/event";
import { SCREEN_DIMENSIONS, truncateText } from "@/utils/helper";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { Picker } from "@expo/ui/jetpack-compose";
import { Link } from "expo-router";
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import config from "tailwind.config";
import { withUniwind } from 'uniwind'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
const StyledCalendar = withUniwind(Calendar);

export default function Page() {
    const insets = useSafeAreaInsets();
	return withQueryWrapper(
		{
			queryKey: ["events"],
			queryFn: getEventsQuery,
		},
		({ data }) => {
			const [selectedDate, setSelectedDate] = useState("");
			const scrollRef = React.useRef<ScrollView | null>(null);

			const events = React.useMemo(
				() =>
					data?.docs.reduce((acc: Record<string, any>, event) => {
						acc[event.event_start.split("T")[0]] = {
							marked: true,
							dotColor: config.theme.extend.colors.pink,
							event,
						};
						return acc;
					}, {}),
				[data],
			);

			const eventsStartingFromToday = React.useMemo(() => {
				const today = new Date();
				today.setHours(0, 0, 0, 0); // set to start of day for accurate comparison

				return (
					data?.docs
						.filter((event) => {
							const eventDate = new Date(event.event_start);
							return eventDate >= today;
						})
						.sort((a, b) => new Date(a.event_start).getTime() - new Date(b.event_start).getTime()) || []
				);
			}, [data]);

			return (
				<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
					<View className="iems-center flex-row flex-wrap justify-between">
						<Title title="Évènements agence" />
						<Picker
							style={{
								width: 146,
								alignSelf: "center",
								marginTop: 25,
							}}
							variant="segmented"
							options={["Agenda", "Liste"]}
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
						scrollViewRef={scrollRef as React.RefObject<ScrollView>}
						horizontal
						showsHorizontalScrollIndicator={false}
						scrollEnabled={false}
						decelerationRate={"fast"}
						contentContainerStyle={{ gap: 16 }}
					>
						<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
							<StyledCalendar
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
									...events,
									[selectedDate]: {
										selected: true,
										marked: !!events[selectedDate],
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

							<ScrollView
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 16 }}
								className="mt-4"
							>
								{events[selectedDate] && events[selectedDate].event ? (
									<View className="gap-3">
										<CardEvent event={events[selectedDate].event} />
									</View>
								) : null}
							</ScrollView>
						</View>
						<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
							{!!eventsStartingFromToday.length ? (
								<ScrollView
									showsVerticalScrollIndicator={false}
									contentContainerStyle={{ paddingBottom: 16, gap: 14 }}
									className="mt-5"
								>
									{eventsStartingFromToday.map((event) => {
										return <CardList isLoading={false} key={event.id} event={event} width={"100%"} />;
									})}
								</ScrollView>
							) : (
								<View className="flex-1 items-center justify-center">
									<Text className="text-md text-center text-primaryLight">Aucun évènement à venir</Text>
								</View>
							)}
						</View>
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}

const CardEvent = ({ event }: { event: Event }) => {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["event", event.id], event);
	}, [event]);
	return (
		<Link
			href={{
				pathname: "/event/[event]",
				params: {
					event: event.id,
				},
			}}
			asChild
		>
			<MyTouchableScaleOpacity
				onPressIn={onPress}
				className="rounded-2xl border border-darkGray bg-white p-5 shadow-sm shadow-defaultGray/10"
			>
				<View className="flex-shrink gap-2">
					<View className="mt-1 self-start rounded-[0.5rem] bg-darkGray px-2 py-1.5">
						<Text className="text-md font-semibold text-primaryLight">{eventLabel[event.type]}</Text>
					</View>
					<Text className="my-1.5 font-bold text-lg text-primary">{truncateText(event.title, 40)}</Text>
					<View className="flex-row items-center gap-2">
						<ClockIcon size={24} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
						<Text className="text-lg text-primaryLight">
							{new Date(event.event_start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} -{" "}
							{new Date(event.event_end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
						</Text>
					</View>
				</View>
			</MyTouchableScaleOpacity>
		</Link>
	);
};
