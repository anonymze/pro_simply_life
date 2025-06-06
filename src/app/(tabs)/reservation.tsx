import Animated, { FadeIn, SlideInDown, SlideInUp, withSpring, withTiming } from "react-native-reanimated";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getEventsQuery } from "@/api/queries/event-queries";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Text, TouchableOpacity } from "react-native";
import Title from "@/components/ui/title";
import React, { useState } from "react";
import { cssInterop } from "nativewind";
import config from "tailwind.config";


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
			queryKey: ["events"],
			queryFn: getEventsQuery,
		},
		({ data }) => {
			const [selectedDate, setSelectedDate] = useState("");

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

					{selectedDate && (
						<TouchableOpacityAnimated
							entering={() => {
								'worklet';
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
							className="absolute bottom-5 left-0 right-0 mx-5 rounded-xl bg-primary p-4"
						>
							<Text className="text-center font-semibold text-lg text-white">Réserver un bureau</Text>
						</TouchableOpacityAnimated>
					)}
				</BackgroundLayout>
			);
		},
	)();
}
