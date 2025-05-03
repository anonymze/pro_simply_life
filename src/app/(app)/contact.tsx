import { ActivityIndicator, Alert, Platform, Pressable, Text, View, TextInput } from "react-native";
import { getContactCategoriesQuery } from "@/api/queries/contact-categories-queries";
import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { BottomSheetSelect } from "@/components/bottom-sheet-select";
import { getContactsQuery } from "@/api/queries/contact-queries";
import { ContactCategory } from "@/types/contact";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import * as WebBrowser from "expo-web-browser";
import config from "tailwind.config";
import React from "react";


const CAMERA_POSITION = {
	coordinates: {
		latitude: 46.227638,
		longitude: 2.213749,
	},
	zoom: 5,
};

export default function Page() {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedCategories, setSelectedCategories] = React.useState<ContactCategory[]>([]);
	const [input, setInput] = React.useState<string>("");
	const mapRef = React.useRef<AppleMaps.MapView>(null);
	const {
		error: errorContacts,
		isLoading: isLoadingContacts,
		data: dataContacts,
	} = useQuery({
		queryKey: ["contacts"],
		queryFn: getContactsQuery,
	});
	const { isLoading: isLoadingCategoryContacts, data: dataCategoryContacts } = useQuery({
		queryKey: ["contact-categories"],
		queryFn: getContactCategoriesQuery,
	});

	// filter contacts based on search input and selected categories
	const filteredContacts = React.useMemo(() => {
		if (!dataContacts?.docs) return [];

		// return all contacts if no filters are applied
		if (input.length < 2 && selectedCategories.length === 0) return dataContacts.docs;

		const searchTerm = input.toLowerCase().trim();
		const hasSearchTerm = searchTerm.length >= 2;
		const hasCategories = selectedCategories.length > 0;

		return dataContacts.docs.filter((contact) => {
			// text search condition
			const matchesSearch = !hasSearchTerm || contact.name.toLowerCase().includes(searchTerm);

			// category filter condition
			const matchesCategory =
				!hasCategories || selectedCategories.some((category) => category.name === contact.category.name);

			// Both conditions must be true
			return matchesSearch && matchesCategory;
		});
	}, [dataContacts?.docs, input, selectedCategories]);

	if (errorContacts) {
		Alert.alert("Erreur de connexion", "Les contacts n'ont pas pu être récupérés.");
	}

	return (
		<BackgroundLayout>
			<View className="flex-row items-center gap-4 bg-white p-4 pt-2">
				<View className="basis-8/12">
					<TextInput
						editable={!isLoadingContacts && !isLoadingCategoryContacts}
						returnKeyType="search"
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
					disabled={isLoadingContacts || isLoadingCategoryContacts}
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
						// annotations={[
						// 	...filteredContacts.map((contact) => ({
						// 		coordinates: { latitude: contact.latitude, longitude: contact.longitude },
						// 		title: contact.name,
						// 		tintColor: "brown",
						// 		systemImage: "cup.and.saucer.fill",
						// 	})),
						// 	{
						// 		coordinates: { latitude: 46.23, longitude: 2.2 },
						// 		title: "49th Parallel Café & Lucky's Doughnuts - Main Street",
						// 		text: "brown",
						// 	},
						// ]}
						markers={[
							...filteredContacts.map((contact) => ({
								coordinates: { latitude: contact.latitude, longitude: contact.longitude },
								title: contact.name,
								tintColor: "brown",
								systemImage: "cup.and.saucer.fill",
								id: contact.website ?? "",
							})),
							{
								coordinates: { latitude: 47.5, longitude: 3.5 },
								title: "49th Parallel Café & Avocat d'exception",
								tintColor: "brown",
								systemImage: "cup.and.saucer.fill",
								id: "https://google.fr",
							},
							{
								coordinates: { latitude: 45.33, longitude: 2.75 },
								title: "Restaurant au pif",
								tintColor: "#000",
								systemImage: "fork.knife",
								id: "https://amazon.fr",
							},
						]}
						onMarkerClick={async (marker) => {
							if (!marker.id) return;
							await WebBrowser.openBrowserAsync(marker.id);
						}}
						ref={mapRef}
						cameraPosition={CAMERA_POSITION}
						style={stylesLayout.container}
					/>
				) : (
					<GoogleMaps.View
						onMarkerClick={(marker) => {
							console.log(marker);
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
						markers={filteredContacts.map((contact) => ({
							coordinates: { latitude: contact.latitude, longitude: contact.longitude },
							title: contact.name,
							snippet: contact.name,
							draggable: false,
							id: contact.id,
							showCallout: true,
						}))}
						ref={mapRef}
						cameraPosition={CAMERA_POSITION}
						style={stylesLayout.container}
					/>
				)}
			</View>
			<BottomSheetSelect
				ref={bottomSheetRef}
				data={dataCategoryContacts?.docs ?? []}
				onSelect={(item) => {
					setSelectedCategories(item as ContactCategory[]);
				}}
			/>
		</BackgroundLayout>
	);
}
