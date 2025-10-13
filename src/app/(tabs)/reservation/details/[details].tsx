import { BuildingIcon, CalendarIcon, ClockIcon, LogOutIcon, UserIcon } from "lucide-react-native";
import { getReservationQuery, deleteReservationQuery } from "@/api/queries/reservation-queries";
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { labels, Reservation } from "@/types/reservation";
import EmployeesIcon from "@/components/emloyees-icon";
import { PaginatedResponse } from "@/types/response";
import { getStorageUserInfos } from "@/utils/store";
import { queryClient } from "@/api/_queries";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { cn } from "@/utils/cn";


export default function Page() {
	const { details: reservationId } = useLocalSearchParams();
	const appUser = getStorageUserInfos();
	const deleteReservation = useMutation({
		mutationFn: deleteReservationQuery,
		onSuccess: () => {
			queryClient.setQueryData(["reservations", { limit: 99 }], (old: PaginatedResponse<Reservation>) => {
				return {
					...old,
					docs: old.docs.filter((res) => res.id !== reservationId),
				};
			});
			// queryClient.invalidateQueries({ queryKey: ["reservation", reservationId] });
			router.back();
		},
		onError: (error) => {
			Alert.alert("Erreur", "La réservation n'existe plus ou vous n'êtes pas autorisé à la supprimer.");
			router.back();
		},
	});

	const { data: reservation } = useQuery({
		queryKey: ["reservation", reservationId],
		queryFn: getReservationQuery,
		enabled: !!reservationId,
	});

	if (!reservation || !appUser) return <Redirect href="../" />;

	const isOwner = reservation.app_user.id === appUser.user.id;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-0")}>
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
				<View className="mt-3 flex-row items-center gap-3">
					<View className="rounded-full bg-darkGray p-2">
						<EmployeesIcon color={config.theme.extend.colors.backgroundChat} width={20} height={20} />
					</View>
					<Text className="text-lg text-primary">
						{reservation.app_user.firstname} {reservation.app_user.lastname}
					</Text>
				</View>
			</View>
			{isOwner && (
				<TouchableOpacity
					disabled={deleteReservation.isPending}
					onPress={() => {
						deleteReservation.mutate(reservation.id);
					}}
					className="mt-4 flex-row items-center gap-3 rounded-2xl bg-white p-3"
				>
					<View className="size-14 items-center justify-center rounded-xl bg-red-200">
						<LogOutIcon size={24} color={config.theme.extend.colors.red2} />
					</View>
					<Text className="text-red2 font-semibold text-lg">Annuler la réservation</Text>
					{deleteReservation.isPending && <ActivityIndicator size="small" className="ml-auto mr-3" color={config.theme.extend.colors.red2} />}
				</TouchableOpacity>
			)}
		</BackgroundLayout>
	);
}
