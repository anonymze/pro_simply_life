import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from "lucide-react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getEventsQuery } from "@/api/queries/event-queries";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import CardList from "@/components/card/card-event";
import { truncateText } from "@/utils/helper";
import { queryClient } from "@/api/_queries";
import { Picker } from "@expo/ui/swift-ui";
import Title from "@/components/ui/title";
import React, { useState } from "react";
import { cssInterop } from "nativewind";
import { Event } from "@/types/event";
import config from "tailwind.config";
import { Link } from "expo-router";


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
			queryKey: ["events"],
			queryFn: getEventsQuery,
		},
		({ data }) => {
			const [selectedDate, setSelectedDate] = useState("");
			const scrollRef = React.useRef<ScrollView>(null);

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
				<BackgroundLayout className="pt-safe px-4">
					<View className="iems-center flex-row justify-between">
						<Title title="Évènements Groupe Valorem" />
						<Picker
							style={{
								width: 90,
								alignSelf: "center",
								marginTop: 8,
							}}
							variant="segmented"
							options={["C", "L"]}
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
					>
						<View style={{ width: Dimensions.get("window").width - 28 }}>
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
						<View style={{ width: Dimensions.get("window").width - 28 }}>
							<ScrollView
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 16, gap: 14 }}
								className="mt-5"
							>
								{eventsStartingFromToday.map((event) => {
									return <CardList isLoading={false} key={event.id} event={event} width={"100%"} />;
								})}
							</ScrollView>
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
			<TouchableOpacity
				onPressIn={onPress}
				className="rounded-2xl border border-darkGray bg-white p-5 shadow-sm shadow-defaultGray/10"
			>
				<View className="flex-shrink gap-2">
					<View className="mt-1 self-start rounded-[0.5rem] bg-darkGray px-2 py-1.5">
						<Text className="text-md font-semibold text-primaryLight">{event.type}</Text>
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
			</TouchableOpacity>
		</Link>
	);
};
