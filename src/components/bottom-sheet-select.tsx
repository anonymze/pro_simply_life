import BottomSheet, { BottomSheetFooter, BottomSheetFooterProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View, Text, StyleSheet, Pressable, Platform, TouchableOpacity } from "react-native";
import { SymbolView, SFSymbol } from "expo-symbols";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, ImageRef } from "expo-image";
import config from "tailwind.config";
import React from "react";


interface Item {
	id: string;
	name: string;
	iosIcon?: SFSymbol;
	androidIcon?: string;
}

interface Props {
	onSelect: (item: Item[]) => void;
	data: Item[];
	snapPoints?: string[];
	initiallyOpen?: boolean;
}

export const BottomSheetSelect = React.forwardRef<BottomSheet, Props>(
	({ onSelect, data, snapPoints = ["55%"], initiallyOpen = false }, ref) => {
		const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

		const renderFooter = React.useCallback(
			(props: BottomSheetFooterProps) => (
				<BottomSheetFooter {...props} style={styles.footerContainer}>
					<TouchableOpacity
						onPress={() => {
							setSelectedItems([]);
							onSelect([]);
							if (ref && "current" in ref) {
								ref.current?.close();
							}
						}}
					>
						<Text style={styles.textBottomSheet}>Annuler</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							onSelect(selectedItems);
							if (ref && "current" in ref) {
								ref.current?.close();
							}
						}}
					>
						<Text style={styles.textBottomSheet}>Choisir</Text>
					</TouchableOpacity>
				</BottomSheetFooter>
			),
			[onSelect, selectedItems],
		);

		return (
			<BottomSheet
				ref={ref}
				enablePanDownToClose={true}
				enableDynamicSizing={false}
				snapPoints={snapPoints}
				footerComponent={renderFooter}
				backgroundStyle={{ backgroundColor: "#fff" }}
				handleIndicatorStyle={{ backgroundColor: config.theme.extend.colors.primary }}
				style={styles.paddingSheet}
				index={initiallyOpen ? 0 : -1}
			>
				<BottomSheetScrollView>
					<View style={styles.bottomSheetListContent}>
						{data.map((item) => (
							<Pressable
								key={item.id}
								style={StyleSheet.flatten([
									styles.itemContainer,
									selectedItems.find((id) => id.id === item.id) && {
										backgroundColor: config.theme.extend.colors.primary,
									},
								])}
								onPress={() => {
									if (selectedItems.find((id) => id.id === item.id)) {
										setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
									} else {
										setSelectedItems((prev) => [...prev, item]);
									}
								}}
							>
								{item.iosIcon && (
									<SymbolView
										name={item.iosIcon}
										tintColor={selectedItems.find((id) => id.id === item.id) ? "#fff" : "#000"}
										type="hierarchical"
									/>
								)}
								{item.androidIcon && (
									<Image source={item.androidIcon} style={{ width: 26, height: 26, borderRadius: 99 }} />
								)}
								<Text
									style={StyleSheet.flatten([
										styles.itemText,
										selectedItems.find((id) => id.id === item.id) && { color: "#fff" },
									])}
								>
									{item.name}
								</Text>
							</Pressable>
						))}
					</View>
				</BottomSheetScrollView>
			</BottomSheet>
		);
	},
);

const styles = StyleSheet.create({
	paddingSheet: {
		paddingHorizontal: 15,
	},
	containerTextBottom: {
		padding: 10,
		margin: 0,
		borderWidth: 0,
		alignItems: "center",
		justifyContent: "center",
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#fff",
		height: Platform.OS === "android" ? 55 : 70,
		paddingBottom: Platform.OS === "android" ? 0 : 15,
	},
	textBottomSheet: {
		color: config.theme.extend.colors.primary,
		fontSize: 18,
		fontWeight: 500,
		padding: 15,
	},
	itemContainer: {
		flexDirection: "row",
		gap: 15,
		alignItems: "center",
		padding: 8,
		marginVertical: 2,
		borderRadius: 8,
	},
	itemText: {
		fontSize: 20,
	},
	bottomSheetListContent: {
		gap: 2,
		marginBottom: 80,
		marginTop: 20,
	},
});
