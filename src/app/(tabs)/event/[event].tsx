import { getEventQuery } from "@/api/queries/event-queries";
import BackgroundLayout from "@/layouts/background-layout";
import { eventLabel } from "@/types/event";
import { cn } from "@/utils/libs/tailwind";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { CalendarArrowDownIcon, CalendarArrowUpIcon, CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react-native";
import { Platform, ScrollView, Text, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const { event: eventId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["event", eventId],
		queryFn: getEventQuery,
		enabled: !!eventId,
	});

	if (!data) return null;

	const sameDay = data.event_start.split("T")[0] === data.event_end.split("T")[0];

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-2")}>
			<ScrollView
				className="mt-4 flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<View className="gap-5">
					<View className="items-center gap-2 rounded-2xl bg-white p-5">
						<View className="mx-auto mt-1 self-start rounded-[0.5rem] bg-darkGray px-2 py-1.5">
							<Text className="text-md font-semibold text-primaryLight">{eventLabel[data.type]}</Text>
						</View>
						<Text className="text-center font-bold text-xl text-primary">{data.title}</Text>
						<Text className="text-center text-lg text-primaryLight">{data.annotation}</Text>
					</View>
					{sameDay ? (
						<View className="flex-row gap-5">
							<View className="flex-grow items-center justify-center rounded-2xl bg-white p-5">
								<CalendarIcon size={28} color={config.theme.extend.colors.primaryLight} />
								<Text className="mt-2 text-center font-semibold text-lg text-primary">
									{new Date(data.event_start).toLocaleDateString("fr-FR", {
										weekday: "long",
										day: "numeric",
										month: "long",
									})}
								</Text>
							</View>
							<View className="flex-grow items-center justify-center rounded-2xl bg-white p-5">
								<ClockIcon size={30} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
								<Text className="mt-2 text-center font-semibold text-lg text-primary">
									{new Date(data.event_start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} -{" "}
									{new Date(data.event_end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
								</Text>
							</View>
						</View>
					) : (
						<View className="flex-row gap-5">
							<View className="flex-grow items-center justify-center rounded-2xl bg-white p-5">
								<CalendarArrowUpIcon size={30} color={config.theme.extend.colors.primaryLight} />
								<Text className="mt-2 text-center font-semibold text-lg text-primary">
									{new Date(data.event_start).toLocaleDateString("fr-FR", {
										weekday: "long",
										day: "numeric",
										month: "long",
									})}
								</Text>
								<Text className="text-center font-semibold text-lg text-primary">
									{new Date(data.event_start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
								</Text>
							</View>
							<View className="flex-grow items-center justify-center rounded-2xl bg-white p-5">
								<CalendarArrowDownIcon size={30} color={config.theme.extend.colors.primaryLight} />
								<Text className="mt-2 text-center font-semibold text-lg text-primary">
									{new Date(data.event_end).toLocaleDateString("fr-FR", {
										weekday: "long",
										day: "numeric",
										month: "long",
									})}
								</Text>
								<Text className="text-center font-semibold text-lg text-primary">
									{new Date(data.event_end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
								</Text>
							</View>
						</View>
					)}

					{data.address && (
						<View className="flex-row items-center gap-3 rounded-2xl bg-white p-5">
							<MapPinIcon size={30} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
							<View className="gap-1">
								<Text className="font-semibold text-lg text-primary">{data.address}</Text>
							</View>
						</View>
					)}

					{!!data?.intervenants?.length ? (
						<View className="gap-3">
							<Text className="font-bold text-lg text-primary">Intervenants</Text>
							{data?.intervenants?.map((intervenant) => (
								<View className="gap-3" key={intervenant.name}>
									<ContactInfo name={intervenant.name} company={intervenant.company} theme={intervenant.theme} />
								</View>
							))}
						</View>
					) : null}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const ContactInfo = ({
	name,
	company,
	theme,
}: {
	name: string | null;
	theme?: string | null;
	company?: string | null;
}) => {
	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Nom et prénom</Text>
					<Text className="font-semibold text-base text-primary">{name}</Text>
				</View>
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Société</Text>
					<Text className="font-semibold text-base text-primary">{company}</Text>
				</View>
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Thème</Text>
					<Text className="font-semibold text-base text-primary">{theme}</Text>
				</View>
			</View>
		</View>
	);
};
