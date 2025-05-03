import BottomSheet, { BottomSheetFooter, BottomSheetFooterProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import config from "tailwind.config";
import React from "react";

interface Item {
	id: string;
	name: string;
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
					<Pressable
						style={(status) => {
							return StyleSheet.flatten([
								{
									opacity: status.pressed ? 0.5 : 1,
								},
								styles.containerTextBottom,
							]);
						}}
						onPress={() => {
							setSelectedItems([]);
							onSelect([]);
							if (ref && "current" in ref) {
								ref.current?.close();
							}
						}}
					>
						<Text style={styles.textBottomSheet}>Annuler</Text>
					</Pressable>
					<Pressable
						style={(status) => {
							return StyleSheet.flatten([
								{
									opacity: status.pressed ? 0.5 : 1,
								},
								styles.containerTextBottom,
							]);
						}}
						onPress={() => {
							onSelect(selectedItems);
							if (ref && "current" in ref) {
								ref.current?.close();
							}
						}}
					>
						<Text style={styles.textBottomSheet}>Choisir</Text>
					</Pressable>
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
