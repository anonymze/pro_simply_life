import { queryClient } from "@/api/_queries";
import { createReservationQuery } from "@/api/queries/reservation-queries";
import BackgroundLayout from "@/layouts/background-layout";
import { Reservation } from "@/types/reservation";
import { PaginatedResponse } from "@/types/response";
import { cn } from "@/utils/cn";
import { getStorageUserInfos } from "@/utils/store";
import { useMutation } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { BuildingIcon, Calendar1Icon, ChevronDownIcon, ClockIcon } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import SelectDropdown from "react-native-select-dropdown";
import config from "tailwind.config";

const timeSlots = [
	{ title: "8:00", value: "2025-06-10 06:00:00+00" },
	{ title: "8:30", value: "2025-06-10 06:30:00+00" },
	{ title: "9:00", value: "2025-06-10 07:00:00+00" },
	{ title: "9:30", value: "2025-06-10 07:30:00+00" },
	{ title: "10:00", value: "2025-06-10 08:00:00+00" },
	{ title: "10:30", value: "2025-06-10 08:30:00+00" },
	{ title: "11:00", value: "2025-06-10 09:00:00+00" },
	{ title: "11:30", value: "2025-06-10 09:30:00+00" },
	{ title: "12:00", value: "2025-06-10 10:00:00+00" },
	{ title: "12:30", value: "2025-06-10 10:30:00+00" },
	{ title: "13:00", value: "2025-06-10 11:00:00+00" },
	{ title: "13:30", value: "2025-06-10 11:30:00+00" },
	{ title: "14:00", value: "2025-06-10 12:00:00+00" },
	{ title: "14:30", value: "2025-06-10 12:30:00+00" },
	{ title: "15:00", value: "2025-06-10 13:00:00+00" },
	{ title: "15:30", value: "2025-06-10 13:30:00+00" },
	{ title: "16:00", value: "2025-06-10 14:00:00+00" },
	{ title: "16:30", value: "2025-06-10 14:30:00+00" },
	{ title: "17:00", value: "2025-06-10 15:00:00+00" },
	{ title: "17:30", value: "2025-06-10 15:30:00+00" },
	{ title: "18:00", value: "2025-06-10 16:00:00+00" },
	{ title: "18:30", value: "2025-06-10 16:30:00+00" },
	{ title: "19:00", value: "2025-06-10 17:00:00+00" },
	{ title: "19:30", value: "2025-06-10 17:30:00+00" },
	{ title: "20:00", value: "2025-06-10 18:00:00+00" },
	{ title: "20:30", value: "2025-06-10 18:30:00+00" },
	{ title: "21:00", value: "2025-06-10 19:00:00+00" },
];

export default function Page() {
	const { date } = useLocalSearchParams();
	const [selectedBureau, setSelectedBureau] = useState<Reservation["desk"] | null>(null);
	const [selectedDebut, setSelectedDebut] = useState<string | null>(null);
	const [selectedFin, setSelectedFin] = useState<string | null>(null);
	const [title, setTitle] = useState<string | null>(null);
	const [dropdownKey, setDropdownKey] = useState(0);
	const userInfos = getStorageUserInfos();

	const bureauData = [
		{ title: "Bureau 1", value: "1" },
		{ title: "Bureau 2", value: "2" },
		{ title: "Salle de réunion", value: "3" },
	];

	const mutation = useMutation({
		mutationFn: createReservationQuery,
		onSuccess: (data) => {
			queryClient.setQueryData(["reservations", { limit: 99 }], (prev: PaginatedResponse<Reservation>) => {
				return {
					...prev,
					docs: [...prev.docs, data.doc],
				};
			});

			setTimeout(() => {
				router.back();
			}, 900);
		},
		onError: (err) => {
			Alert.alert(
				"Une erreur est survenue",
				"Soit une réservation existe déjà à cette tranche horaire soit vous n'avez pas correctement entrer les heures de début et de fin.",
			);
		},
	});

	if (typeof date !== "string" || !userInfos) return <Redirect href="../" />;

	const isAllGood = selectedBureau && selectedDebut && selectedFin && title;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<View className={cn("flex-row items-center justify-between bg-background pb-6")}>
				<View className="w-24 p-2">
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
					>
						<Text className="font-semibold text-sm text-backgroundChat">Annuler</Text>
					</TouchableOpacity>
				</View>

				<Text className="font-bold text-lg text-primary">Nouvelle réservation</Text>

				<TouchableOpacity
					className="w-24 items-end p-2"
					disabled={!isAllGood || mutation.isPending}
					onPress={() => {
						if (!isAllGood) return;
						mutation.mutate({
							title: title,
							app_user: userInfos.user,
							desk: selectedBureau,
							day_reservation: date,
							start_time_reservation: selectedDebut,
							end_time_reservation: selectedFin,
						});
					}}
				>
					{mutation.isPending ? (
						<Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOut.duration(300)}>
							<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
						</Animated.View>
					) : (
						<Text className={cn("font-semibold text-sm text-backgroundChat", !isAllGood && "text-primary/40")}>
							Créer
						</Text>
					)}
				</TouchableOpacity>
			</View>

			<Text className="font-bold text-xl text-primary">Choisir un créneau</Text>

			<View className="mt-5 gap-4">
				<View className="items-center justify-center self-center rounded-2xl bg-darkGray p-5">
					<Calendar1Icon size={30} color={config.theme.extend.colors.primaryLight} />
					<View className="items-center">
						<Text className="mt-2 text-center font-semibold text-lg text-primary">
							{new Date(date).toLocaleDateString("fr-FR", {
								weekday: "long",
								day: "numeric",
								month: "long",
							})}
						</Text>
						<Text className="text-center font-semibold text-lg text-primary">
							{new Date(date).toLocaleDateString("fr-FR", {
								year: "numeric",
							})}
						</Text>
					</View>
				</View>

				<TextInput
					returnKeyType="done"
					keyboardType="default"
					textContentType="none"
					placeholder="Titre de la réservation"
					autoCorrect={true}
					className="flex-row items-center gap-3 rounded-lg bg-darkGray p-5 font-medium text-primary shadow-sm shadow-defaultGray/20 placeholder:text-primaryLight"
					onChangeText={setTitle}
				/>

				<SelectDropdown
					key={`bureau-${dropdownKey}`}
					data={bureauData}
					defaultValue={selectedBureau ? bureauData.find((item) => item.value === selectedBureau) : undefined}
					onSelect={(selectedItem) => {
						setSelectedBureau(selectedItem.value);
						setDropdownKey((prev) => prev + 1);
					}}
					renderButton={(selectedItem, isOpened) => {
						return (
							<View className="flex-row items-center gap-3 rounded-lg bg-darkGray p-5 shadow-sm shadow-defaultGray/20">
								<BuildingIcon size={20} color={config.theme.extend.colors.primaryLight} />
								<Text className="text-md flex-1 font-medium text-primary">
									{(selectedItem && selectedItem.title) || "Sélectionner un bureau"}
								</Text>
								<ChevronDownIcon size={20} color={config.theme.extend.colors.primaryLight} />
							</View>
						);
					}}
					renderItem={(item, selectedItem, selected) => {
						return (
							<View className={cn("my-0.5 flex-row items-center gap-3  rounded-lg p-3", selected && "bg-darkGray")}>
								<BuildingIcon size={20} color={config.theme.extend.colors.primary} />
								<Text className="font-semibold text-lg text-primary">{item.title}</Text>
							</View>
						);
					}}
					dropdownStyle={styles.dropdownMenuStyle}
					showsVerticalScrollIndicator={true}
				/>
				<View className="flex-row items-center gap-4">
					<View className="flex-1">
						<SelectDropdown
							key={`debut-${dropdownKey}`}
							data={timeSlots}
							defaultValue={selectedDebut ? timeSlots.find((item) => item.value === selectedDebut) : undefined}
							onSelect={(selectedItem) => {
								setSelectedDebut(selectedItem.value);
								setDropdownKey((prev) => prev + 1);
							}}
							renderButton={(selectedItem, isOpened) => {
								return (
									<View className="flex-row items-center gap-3 rounded-lg bg-darkGray p-5 shadow-sm shadow-defaultGray/20">
										<ClockIcon size={20} color={config.theme.extend.colors.primaryLight} />
										<Text className="text-md flex-1 font-medium text-primary">
											{(selectedItem && selectedItem.title) || "Début"}
										</Text>
										<ChevronDownIcon size={20} color={config.theme.extend.colors.primaryLight} />
									</View>
								);
							}}
							renderItem={(item, selectedItem, selected) => {
								return (
									<View className={cn("my-0.5 flex-row items-center gap-3  rounded-lg p-3", selected && "bg-darkGray")}>
										<Text className="font-semibold text-lg text-primary">{item.title}</Text>
									</View>
								);
							}}
							dropdownStyle={styles.dropdownMenuStyle}
							showsVerticalScrollIndicator={true}
							disableAutoScroll={true}
						/>
					</View>
					<View className="flex-1">
						<SelectDropdown
							key={`fin-${dropdownKey}`}
							data={timeSlots}
							defaultValue={selectedFin ? timeSlots.find((item) => item.value === selectedFin) : undefined}
							onSelect={(selectedItem) => {
								setSelectedFin(selectedItem.value);
								setDropdownKey((prev) => prev + 1);
							}}
							renderButton={(selectedItem) => {
								return (
									<View className="flex-row items-center gap-3 rounded-lg bg-darkGray p-5 shadow-sm shadow-defaultGray/20">
										<ClockIcon size={20} color={config.theme.extend.colors.primaryLight} />
										<Text className="text-md flex-1 font-medium text-primary">
											{(selectedItem && selectedItem.title) || "Fin"}
										</Text>
										<ChevronDownIcon size={20} color={config.theme.extend.colors.primaryLight} />
									</View>
								);
							}}
							renderItem={(item, selectedItem, selected) => {
								return (
									<View className={cn("my-0.5 flex-row items-center gap-3  rounded-lg p-3", selected && "bg-darkGray")}>
										<Text className="font-semibold text-lg text-primary">{item.title}</Text>
									</View>
								);
							}}
							dropdownStyle={styles.dropdownMenuStyle}
							showsVerticalScrollIndicator={true}
							disableAutoScroll={true}
						/>
					</View>
				</View>
			</View>
		</BackgroundLayout>
	);
}

const styles = StyleSheet.create({
	dropdownMenuStyle: {
		marginTop: Platform.OS === "android" ? -40 : 75,
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 10,
	},
});
