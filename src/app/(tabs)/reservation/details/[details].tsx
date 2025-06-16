import { BuildingIcon, CalendarIcon, ClockIcon, UserIcon } from "lucide-react-native";
import { getReservationQuery } from "@/api/queries/reservation-queries";
import BackgroundLayout from "@/layouts/background-layout";
import EmployeesIcon from "@/components/emloyees-icon";
import { Platform, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { labels } from "@/types/reservation";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { cn } from "@/utils/cn";


export default function Page() {
	const { details: reservationId } = useLocalSearchParams();

	const { data: reservation } = useQuery({
		queryKey: ["reservation", reservationId],
		queryFn: getReservationQuery,
		enabled: !!reservationId,
	});

	if (!reservation) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<Title title="Détails de la réservation" />
			<View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-white p-4">
				<BuildingIcon size={24} color={config.theme.extend.colors.primaryLight} />
				<Text className="text-lg text-primary">{labels[reservation.desk]}</Text>
			</View>
			<View className="mt-5 flex-row items-center gap-5">
				<View className="flex-1 items-center gap-3 rounded-2xl bg-white p-4">
					<CalendarIcon size={24} color={config.theme.extend.colors.primaryLight} />
					<Text className="text-lg text-primary">
						{new Date(reservation.day_reservation).toLocaleDateString("fr-FR", {
							weekday: "long",
							day: "numeric",
							month: "long",
						})}
					</Text>
				</View>
				<View className="flex-1 items-center gap-3 rounded-2xl bg-white p-4">
					<ClockIcon size={24} color={config.theme.extend.colors.primaryLight} />
					<Text className="text-lg text-primary">
						{new Date(reservation.start_time_reservation).toLocaleTimeString("fr-FR", {
							hour: "2-digit",
							minute: "2-digit",
						})}
						{" - "}
						{new Date(reservation.end_time_reservation).toLocaleTimeString("fr-FR", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</View>
			</View>
			<View className="mt-5 rounded-2xl bg-white p-4">
				<Text className="text-sm text-primaryLight">Réservé par</Text>
				<View className="mt-3 flex-row items-center gap-2">
					<View className="rounded-full bg-darkGray p-2">
						<EmployeesIcon color={config.theme.extend.colors.backgroundChat} width={20} height={20} />
					</View>
					<Text className="text-lg text-primary">
						{reservation.app_user.firstname} {reservation.app_user.lastname}
					</Text>
				</View>
			</View>
		</BackgroundLayout>
	);
}
