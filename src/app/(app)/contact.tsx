import { Alert, Platform, Pressable, Text, View, TextInput, Linking } from "react-native";
import { getContactCategoriesQuery } from "@/api/queries/contact-categories-queries";
import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { BottomSheetSelect } from "@/components/bottom-sheet-select";
import { getContactsQuery } from "@/api/queries/contact-queries";
import { useQueries } from "@tanstack/react-query";
import { ContactCategory } from "@/types/contact";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import * as WebBrowser from "expo-web-browser";
import { SFSymbol } from "expo-symbols";
import config from "tailwind.config";
import React from "react";


const tintIos = {
	Hotel: "brown",
	Restaurant: "red",
	Avocat: "blue",
	Agence: "purple",
};

export const iconIos: {
	[key: string]: SFSymbol;
} = {
	Hotel: "cup.and.saucer.fill",
	Restaurant: "fork.knife",
	Avocat: "bubble.middle.bottom",
	Agence: "building.2",
};

const iconAndroid: Record<string, string> = {
	Restaurant: require("@/assets/icons/restaurant.png"),
	Hotel: require("@/assets/icons/hotel.png"),
	Avocat: require("@/assets/icons/lawyer.png"),
	Agence: require("@/assets/icons/agency.png"),
};

export const getAndroidIcon = (name: string) => {
	const icon = iconAndroid[name as keyof typeof iconAndroid];
	return icon ?? require("@/assets/icons/unknown.png");
};

const CAMERA_POSITION = {
	coordinates: {
		latitude: 46.227638,
		longitude: 2.213749,
	},
	zoom: Platform.OS === "ios" ? 5 : 6,
};

export default function Page() {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedCategories, setSelectedCategories] = React.useState<ContactCategory[]>([]);
	const [input, setInput] = React.useState<string>("");
	const mapRef = React.useRef<AppleMaps.MapView>(null);

	const queries = useQueries({
		queries: [
			{
				queryKey: ["contacts", { limit: 20 }],
				queryFn: getContactsQuery,
			},
			{
				queryKey: ["contact-categories"],
				queryFn: getContactCategoriesQuery,
			},
		],
	});

	// filter contacts based on search input and selected categories
	const filteredContacts = React.useMemo(() => {
		if (!queries[0].data?.docs.length) return [];

		// return all contacts if no filters are applied
		if (input.length < 2 && selectedCategories.length === 0) return queries[0].data.docs;

		const searchTerm = input.toLowerCase().trim();
		const hasSearchTerm = searchTerm.length >= 2;
		const hasCategories = selectedCategories.length > 0;

		return queries[0].data.docs.filter((contact) => {
			// text search condition
			const matchesSearch = !hasSearchTerm || contact.name.toLowerCase().includes(searchTerm);

			// category filter condition
			const matchesCategory =
				!hasCategories || selectedCategories.some((category) => category.name === contact.category.name);

			// Both conditions must be true
			return matchesSearch && matchesCategory;
		});
	}, [queries, selectedCategories]);

	if (queries[0].error || queries[1].error) {
		Alert.alert("Erreur de connexion", "Les contacts n'ont pas pu être récupérés.");
	}

	return (
		<BackgroundLayout>
			<View className="flex-row items-center gap-4 bg-white p-4 pt-0">
				<View className="basis-8/12">
					<TextInput
						editable={!queries[0].isLoading && !queries[1].isLoading}
						returnKeyType="search"
						keyboardType="default"
						autoCorrect={false}
						autoCapitalize="none"
						className="w-full rounded-xl bg-gray-100 p-4"
						placeholder="Rechercher..."
						onSubmitEditing={(elem) => {
							setInput(elem.nativeEvent.text.trim());
						}}
					/>
					<FontAwesome
						className="absolute right-4 top-4"
						name="search"
						size={18}
						color={config.theme.extend.colors.defaultGray}
					/>
				</View>
				<Pressable
					disabled={queries[0].isLoading || queries[1].isLoading}
					className="grow rounded-xl bg-black/85 p-4 disabled:opacity-80"
					onPress={() => {
						bottomSheetRef.current?.expand();
					}}
				>
					<Text className="text-center font-bold text-white">Catégories</Text>
				</Pressable>
			</View>

			<View className="flex-1">
				{Platform.OS === "ios" ? (
					<AppleMaps.View
						uiSettings={{
							myLocationButtonEnabled: false,
							compassEnabled: true,
							scaleBarEnabled: true,
						}}
						properties={{
							isTrafficEnabled: false,
							selectionEnabled: false,
							mapType: AppleMapsMapType.STANDARD,
						}}
						markers={filteredContacts.map((contact) => ({
							coordinates: { latitude: parseFloat(contact.latitude), longitude: parseFloat(contact.longitude) },
							title: "test",
							tintColor: tintIos[contact.category.name as keyof typeof tintIos] ?? "gray",
							systemImage: iconIos[contact.category.name as keyof typeof iconIos] ?? "questionmark.square.fill",
							id: contact.website ? contact.website : contact.phone ? contact.phone : "_" + contact.id,
						}))}
						onMarkerClick={async (marker) => {
							if (!marker.id || marker.id.startsWith("_")) return;

							try {
								const url = new URL(marker.id);
								await WebBrowser.openBrowserAsync(url.toString());
							} catch {
								// open phone app
								await Linking.openURL(`tel:${marker.id}`);
							}
						}}
						ref={mapRef}
						cameraPosition={CAMERA_POSITION}
						style={stylesLayout.container}
					/>
				) : (
					<GoogleMaps.View
						onMarkerClick={async (marker) => {
							if (!marker.id) return;

							try {
								const url = new URL(marker.id);
								await WebBrowser.openBrowserAsync(url.toString());
							} catch {
								// open phone app
								await Linking.openURL(`tel:${marker.id}`);
							}
						}}
						uiSettings={{
							myLocationButtonEnabled: false,
							compassEnabled: true,
							scaleBarEnabled: true,
						}}
						properties={{
							isTrafficEnabled: false,
							selectionEnabled: false,
							mapType: GoogleMapsMapType.NORMAL,
						}}
						markers={filteredContacts.map((contact) => {
							return {
								coordinates: { latitude: parseFloat(contact.latitude), longitude: parseFloat(contact.longitude) },
								title: contact.name,
								// snippet: contact.name,
								showCallout: false,
								draggable: false,
								icon: contact.logo,
								id: contact.website ? contact.website : contact.phone ? contact.phone : "",
							};
						})}
						ref={mapRef}
						cameraPosition={CAMERA_POSITION}
						style={stylesLayout.container}
					/>
				)}
			</View>
			<BottomSheetSelect
				ref={bottomSheetRef}
				data={
					queries[1].data?.docs.map((category) => ({
						id: category.id,
						name: category.name,
						iosIcon: iconIos[category.name as keyof typeof iconIos] ?? "questionmark.square.fill",
						androidIcon: getAndroidIcon(category.name),
					})) ?? []
				}
				onSelect={(item) => {
					setSelectedCategories(item as ContactCategory[]);
				}}
			/>
		</BackgroundLayout>
	);
}
