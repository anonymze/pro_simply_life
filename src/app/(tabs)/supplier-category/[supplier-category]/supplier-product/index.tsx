import { getSupplierCategoryQuery } from "@/api/queries/supplier-categories-queries";
import { Brochure } from "@/components/brochure";
import CardSearchSupplier from "@/components/card/card-search-supplier";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { ALL_SCPI_ID, excludedProductSupplierIds, SCPI_CATEGORY_ID, SCREEN_DIMENSIONS } from "@/utils/helper";
import { Host, Picker } from "@expo/ui/swift-ui";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const { "supplier-category": supplierCategoryId, "supplier-category-name": supplierCategoryName } =
		useLocalSearchParams<{
			"supplier-category": string;
			"supplier-category-name": string;
		}>();

	const scrollRef = React.useRef<ScrollView>(null);
	const [search, setSearch] = React.useState("");

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
					categoryId: supplierCategoryId,
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
			<Text className="mb-5 text-sm text-defaultGray">{description}</Text>

			{!!data?.offers?.length && (
				<Host
					style={{
						width: 260,
						marginBottom: 16,
						marginHorizontal: "auto",
					}}
				>
					<Picker
						variant="segmented"
						options={["Produits", "Offres du moment"]}
						selectedIndex={null}
						onOptionSelected={({ nativeEvent: { index } }) => {
							if (index === 0) {
								scrollRef.current?.scrollTo({ x: 0, animated: true });
							} else {
								scrollRef.current?.scrollToEnd({ animated: true });
							}
						}}
					/>
				</Host>
			)}

			{!!data?.offers?.length ? (
				<ScrollView
					scrollViewRef={scrollRef as React.RefObject<ScrollView>}
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					decelerationRate={"fast"}
					contentContainerStyle={{ gap: 16 }}
				>
					<View style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
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
										if (excludedProductSupplierIds.includes(supplierProduct.id)) return null;

										// let multipleSupplierProducts: SupplierProduct[] = [];

										// if (supplierProduct.id === PRIVATE_EQUITY_ID) {
										// 	multipleSupplierProducts = data.product_suppliers.filter(
										// 		(product) => excludedProductSupplierIds.includes(product.id) && product.id !== OB_TER_ID,
										// 	);
										// }

										return (
											<CardSupplierProduct
												key={supplierProduct.id}
												supplierProduct={supplierProduct}
												// multipleSupplierProducts={multipleSupplierProducts}
												link={{
													pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier`,
													params: {
														"supplier-category": supplierCategoryId,
														"supplier-category-name": supplierCategoryName,
														"supplier-product": supplierProduct.id,
														"supplier-product-name": supplierProduct.name,
														// "multiple-supplier-products": multipleSupplierProducts
														// 	.map((product) => product.id)
														// 	.join(","),
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
									<View className="flex-1 items-center justify-center">
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
					<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
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
											pdf: offer.file.filename || "",
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
								{data.product_suppliers.map((supplierProduct) => {
									if (excludedProductSupplierIds.includes(supplierProduct.id)) return null;

									// let multipleSupplierProducts: SupplierProduct[] = [];

									// if (supplierProduct.id === PRIVATE_EQUITY_ID) {
									// 	multipleSupplierProducts = data.product_suppliers.filter(
									// 		(product) => excludedProductSupplierIds.includes(product.id) && product.id !== OB_TER_ID,
									// 	);
									// }

									return (
										<CardSupplierProduct
											key={supplierProduct.id}
											supplierProduct={supplierProduct}
											// multipleSupplierProducts={multipleSupplierProducts}
											link={{
												pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier`,
												params: {
													"supplier-category": supplierCategoryId,
													"supplier-category-name": supplierCategoryName,
													"supplier-product": supplierProduct.id,
													"supplier-product-name": supplierProduct.name,
													// "multiple-supplier-products": multipleSupplierProducts.map((product) => product.id).join(","),
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
				</>
			)}
		</BackgroundLayout>
	);
}
