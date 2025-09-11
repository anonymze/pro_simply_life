import { getSupplierCategoryQuery } from "@/api/queries/supplier-categories-queries";
import { Brochure } from "@/components/brochure";
import CardSearchSupplier from "@/components/card/card-search-supplier";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Picker } from "@expo/ui/jetpack-compose";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import config from "tailwind.config";

export default function Page() {
	const scrollRef = React.useRef<ScrollView>(null);
	const [search, setSearch] = React.useState("");
	const { "supplier-category": supplierCategoryId, "supplier-category-name": supplierCategoryName } =
		useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier-category", supplierCategoryId],
		queryFn: getSupplierCategoryQuery,
		enabled: !!supplierCategoryId,
	});

	if (!data) return null;

	const description = React.useMemo(() => {
		return data.product_suppliers.length === 0
			? ""
			: data?.product_suppliers
					.slice(0, 2)
					.map((supplier) => supplier.name)
					.join(", ") + (data.product_suppliers.length > 2 ? "..." : "");
	}, [data]);

	// flatten all suppliers from all categories
	const allSuppliers = React.useMemo(() => {
		return (
			data?.product_suppliers?.flatMap((productSupplier) =>
				productSupplier.suppliers.map((supplier) => ({
					...supplier,
					productName: productSupplier.name,
					productId: productSupplier.id,
					searchName: supplier.name.toLowerCase(),
					categoryName: data.name,
				})),
			) ?? []
		);
	}, [data]);

	const filteredData = React.useMemo(() => {
		if (!search) return null;

		const searchTerm = search.toLowerCase();
		// filter suppliers based on search term
		return allSuppliers.filter((supplier) => supplier.searchName.includes(searchTerm));
	}, [allSuppliers, search]);

	return (
		<BackgroundLayout className="px-4 pt-4">
			<Title className="mb-2 mt-0" title={data.name} />
			<Text className="mb-5 text-xs text-defaultGray">{description}</Text>

			{!!data?.offers?.length && (
				<Picker
					style={{ width: 280, marginTop: 0, marginHorizontal: "auto", marginBottom: 10 }}
					variant="segmented"
					options={["Produits", "Offres du moment"]}
					selectedIndex={null}
					onOptionSelected={({ nativeEvent: { index } }) => {
						if (index === 0) {
							scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
						} else {
							scrollRef.current?.scrollToEnd({ animated: true });
						}
					}}
				/>
			)}

			{!!data?.offers?.length ? (
				<ScrollView
					ref={scrollRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					decelerationRate={"fast"}
					contentContainerStyle={{ gap: 16 }}
				>
					<View style={{ width: Dimensions.get("window").width - 28 }}>
						<InputSearch
							placeholder="Rechercher un fournisseur..."
							onSubmitEditing={(input) => {
								setSearch(input.nativeEvent.text);
							}}
							onClear={() => {
								setSearch("");
							}}
						/>

						{search.length < 3 ? (
							<ScrollView
								className="flex-1"
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 10 }}
								style={{ backgroundColor: config.theme.extend.colors.background, marginTop: 16 }}
							>
								<View className="gap-2">
									{data.product_suppliers.map((supplierProduct) => {
										if (
											supplierProduct.id === "46c9b876-9b9b-4779-b8ff-e4af9d56914e" ||
											supplierProduct.id === "6871100f-d1ae-4326-93f9-d4f5117243ab"
										)
											return;
										return (
											<CardSupplierProduct
												key={supplierProduct.id}
												supplierProduct={supplierProduct}
												link={{
													pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier`,
													params: {
														"supplier-category": supplierCategoryId,
														"supplier-category-name": supplierCategoryName,
														"supplier-product": supplierProduct.id,
														"supplier-product-name": supplierProduct.name,
													},
												}}
											/>
										);
									})}
								</View>
							</ScrollView>
						) : (
							<>
								{!filteredData?.length ? (
									<View className="flex-1 items-center justify-center ">
										<Text className="text-sm text-defaultGray">Aucun fournisseur trouvé</Text>
									</View>
								) : (
									<ScrollView
										className="flex-1"
										showsVerticalScrollIndicator={false}
										style={{ backgroundColor: config.theme.extend.colors.background }}
									>
										<View className="mt-5 gap-5">
											{filteredData.map((supplier) => (
												<CardSearchSupplier key={supplier.productId + supplier.id} supplier={supplier} />
											))}
										</View>
									</ScrollView>
								)}
							</>
						)}
					</View>
					<View className="gap-2" style={{ width: Dimensions.get("window").width - 28 }}>
						{!!data?.offers?.length &&
							data.offers.map((offer) => (
								<Brochure
									title="Plaquette"
									key={offer.id}
									brochure={offer.file}
									updatedAt={data.updatedAt}
									link={{
										pathname: "/supplier-category/[supplier-category]/supplier-product/pdf/[pdf]",
										params: {
											"supplier-category": supplierCategoryId,
											pdf: offer.file.filename,
										},
									}}
								/>
							))}
					</View>
				</ScrollView>
			) : (
				<>
					<InputSearch
						placeholder="Rechercher un fournisseur..."
						onSubmitEditing={(input) => {
							setSearch(input.nativeEvent.text);
						}}
						onClear={() => {
							setSearch("");
						}}
					/>

					{search.length < 3 ? (
						<ScrollView
							className="flex-1"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 10 }}
							style={{ backgroundColor: config.theme.extend.colors.background }}
						>
							<View className="mt-5 gap-2">
								{data.product_suppliers.map((supplierProduct) => (
									<CardSupplierProduct
										key={supplierProduct.id}
										supplierProduct={supplierProduct}
										link={{
											pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier`,
											params: {
												"supplier-category": supplierCategoryId,
												"supplier-category-name": supplierCategoryName,
												"supplier-product": supplierProduct.id,
												"supplier-product-name": supplierProduct.name,
											},
										}}
									/>
								))}
							</View>
						</ScrollView>
					) : (
						<>
							{!filteredData?.length ? (
								<View className="flex-1 items-center justify-center ">
									<Text className="text-sm text-defaultGray">Aucun fournisseur trouvé</Text>
								</View>
							) : (
								<ScrollView
									className="flex-1"
									showsVerticalScrollIndicator={false}
									style={{ backgroundColor: config.theme.extend.colors.background }}
								>
									<View className="mt-5 gap-5">
										{filteredData.map((supplier) => (
											<CardSearchSupplier key={supplier.productId + supplier.id} supplier={supplier} />
										))}
									</View>
								</ScrollView>
							)}
						</>
					)}
				</>
			)}
		</BackgroundLayout>
	);
}
