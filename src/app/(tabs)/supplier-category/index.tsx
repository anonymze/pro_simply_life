import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import CardSearchSupplier from "@/components/card/card-search-supplier";
import CardSupplierCategory from "@/components/card/card-supplier-category";
import BuildingDoubleFillIcon from "@/components/svg/building-double-fill-icon";
import HeartFillIcon from "@/components/svg/heart-fill-icon";
import ImmobilierFillIcon from "@/components/svg/immobilier-fill-icon";
import BackgroundLayout from "@/layouts/background-layout";
import { withQueryWrapper } from "@/utils/libs/react-query";

import CifFillIcon from "@/components/svg/cif-icon";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["supplier-categories"],
			queryFn: getSupplierCategoriesQuery,
		},
		({ data }) => {
			const [search, setSearch] = React.useState("");

			// flatten all suppliers from all categories
			const allSuppliers = React.useMemo(() => {
				return (
					data?.docs?.flatMap((category) =>
						category.product_suppliers.flatMap((product) =>
							product.suppliers.map((supplier) => ({
								...supplier,
								productName: product.name,
								productId: product.id,
								searchName: supplier.name.toLowerCase(),
								categoryName: category.name,
							})),
						),
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
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Répertoire des fournisseurs" />
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
							style={{ backgroundColor: config.theme.extend.colors.background, marginTop: 16 }}
						>
							<View className="flex-row flex-wrap">
								{data?.docs?.map((supplierCategory) => (
									<View key={supplierCategory.id} className="w-1/2 p-2">
										<CardSupplierCategory
											backgroundIcon={
												supplierCategory.name === "IAS"
													? "#E0F2FE"
													: supplierCategory.name === "SCPI"
														? "#E4F5D7"
														: supplierCategory.name === "Immobilier"
															? "#FCE7F6"
															: "#EBE9FE"
											}
											supplierCategory={supplierCategory}
											icon={
												supplierCategory.name === "IAS" ? (
													<HeartFillIcon width={45} height={45} color={config.theme.extend.colors.primary} />
												) : supplierCategory.name === "SCPI" ? (
													<BuildingDoubleFillIcon width={45} height={45} color={config.theme.extend.colors.primary} />
												) : supplierCategory.name === "Immobilier" ? (
													<ImmobilierFillIcon width={45} height={45} color={config.theme.extend.colors.primary} />
												) : (
													<CifFillIcon width={45} height={45} color={config.theme.extend.colors.primary} />
												)
											}
											link={{
												pathname: `/supplier-category/[supplier-category]/supplier-product`,
												params: {
													"supplier-category": supplierCategory.id,
													"supplier-category-name": supplierCategory.name,
												},
											}}
										/>
									</View>
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
				</BackgroundLayout>
			);
		},
	)();
}
