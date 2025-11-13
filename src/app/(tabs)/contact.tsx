import { getAppUsersContactsQuery } from "@/api/queries/app-user-queries";
import { getContactsQuery } from "@/api/queries/contact-queries";
import InputSearch from "@/components/ui/input-search";
import { stylesLayout } from "@/layouts/background-layout";
import { iconIos, tintIos } from "@/utils/icon-maps";
import { useQueries } from "@tanstack/react-query";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Linking, Platform, View } from "react-native";

const CAMERA_POSITION = {
	coordinates: {
		latitude: 46.227638,
		longitude: 2.213749,
	},
	zoom: Platform.OS === "ios" ? 5 : 6,
};

export default function Page() {
	// const bottomSheetRef = React.useRef<BottomSheet>(null);
	// const [selectedCategories, setSelectedCategories] = React.useState<ContactCategory[]>([]);
	const [input, setInput] = React.useState<string>("");
	const mapRef = React.useRef<AppleMaps.MapView>(null);

	const queries = useQueries({
		queries: [
			{
				queryKey: ["contacts", { limit: 25 }],
				queryFn: getContactsQuery,
			},
			{
				queryKey: ["app-users-contacts"],
				queryFn: getAppUsersContactsQuery,
			},
		],
	});

	// filter contacts based on search input and selected categories
	const filteredContacts = React.useMemo(() => {
		if (!queries[0].data?.docs.length) return [];

		// return all contacts if no filters are applied
		// if (input.length < 2 && selectedCategories.length === 0) return queries[0].data.docs;
		if (input.length < 2) return queries[0].data.docs;

		const searchTerm = input.toLowerCase().trim();
		const hasSearchTerm = searchTerm.length >= 2;
		// const hasCategories = selectedCategories.length > 0;

		if (!hasSearchTerm) return queries[0].data.docs;

		return queries[0].data.docs.filter((contact) => {
			// text search condition
			const matchesSearchName = contact.name.toLowerCase().includes(searchTerm);
			const matchesSearchCategory = contact.category.name.toLowerCase().includes(searchTerm);
			const matchesSpecialisation = (contact.specialisation?.split(",") ?? []).some((spec) =>
				spec.toLowerCase().trim().includes(searchTerm),
			);

			// category filter condition
			// const matchesCategory =
			// 	!hasCategories || selectedCategories.some((category) => category.name === contact.category.name);

			// Both conditions must be true
			// return matchesSearch && matchesCategory;
			return matchesSearchName || matchesSearchCategory || matchesSpecialisation;
		});
		// }, [queries, selectedCategories]);
	}, [queries]);

	console.log(queries[1].data?.docs);

	if (queries[0].error || queries[1].error) {
		Alert.alert("Erreur de connexion", "Les contacts n'ont pas pu être récupérés.");
	}

	return (
		<>
			<View className="flex-row items-center gap-4 bg-white px-4 pb-4">
				<View className="flex-1 flex-row items-center">
					<InputSearch
						clearable={false}
						placeholder="Rechercher..."
						onSubmitEditing={(e) => {
							setInput(e.nativeEvent.text);
						}}
						onClear={() => {
							setInput("");
						}}
					/>
				</View>
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
						markers={[
							...filteredContacts.map((contact) => ({
								coordinates: { latitude: parseFloat(contact.latitude), longitude: parseFloat(contact.longitude) },
								title: contact.name,
								tintColor: tintIos[contact.category.name as keyof typeof tintIos] ?? "gray",
								systemImage: iconIos[contact.category.name as keyof typeof iconIos] ?? "questionmark.square.fill",
								id: contact.website ? contact.website : contact.phone ? contact.phone : "_" + contact.id,
							})),
							...(queries[1].data?.docs ?? []).map((user) => {
								return {
									coordinates: { latitude: parseFloat(user.latitude!), longitude: parseFloat(user.longitude!) },
									title: `${user.cabinet} - ${user.firstname} ${user.lastname}`,
									tintColor: "red" as const,
									systemImage: "person.fill" as const,
									id: user.firstname + user.lastname,
								};
							}),
						]}
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
						markers={[
							...filteredContacts.map((contact) => {
								return {
									coordinates: { latitude: parseFloat(contact.latitude), longitude: parseFloat(contact.longitude) },
									title: contact.name,
									// snippet: contact.name,
									showCallout: false,
									draggable: false,
									icon: contact.logo,
									id: contact.website ? contact.website : contact.phone ? contact.phone : "",
								};
							}),
							...(queries[1].data?.docs ?? []).map((user) => {
								return {
									coordinates: { latitude: parseFloat(user.latitude!), longitude: parseFloat(user.longitude!) },
									title: `${user.cabinet} - ${user.firstname} ${user.lastname}`,
									// snippet: contact.name,
									showCallout: false,
									draggable: false,
									// icon: contact.logo,
									id: user.firstname + user.lastname,
								};
							}),
						]}
						ref={mapRef}
						cameraPosition={CAMERA_POSITION}
						style={stylesLayout.container}
					/>
				)}
			</View>
		</>
	);
}
