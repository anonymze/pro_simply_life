import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import CardSupplierCategory from "@/components/card/card-supplier-category";
import CardSearchSupplier from "@/components/card/card-search-supplier";
import { MobileMediaQuery, TabletMediaQuery } from "@/utils/responsive";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";
import { Dimensions } from "react-native";
import config from "tailwind.config";
import React from "react";


const { width: screenWidth } = Dimensions.get("window");

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["supplier-categories", { depth: 3 }],
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
							style={{ backgroundColor: config.theme.extend.colors.background }}
						>
							<TabletMediaQuery screenWidth={screenWidth}>
								<View className="mt-4 flex-row flex-wrap">
									{data?.docs?.map((supplierCategory) => (
										<View key={supplierCategory.id} className="w-1/2 p-1.5">
											<CardSupplierCategory
												supplierCategory={supplierCategory}
												icon={
													<ImagePlaceholder
														source={supplierCategory.logo?.url ?? ""}
														style={{ width: 30, height: 30, borderRadius: 4 }}
													/>
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
							</TabletMediaQuery>
							<MobileMediaQuery screenWidth={screenWidth}>
								<View className="mt-4 flex-row flex-wrap">
									{data?.docs?.map((supplierCategory) => (
										<View key={supplierCategory.id} className="w-1/2 p-1">
											<CardSupplierCategory
												supplierCategory={supplierCategory}
												icon={
													<ImagePlaceholder
														source={supplierCategory.logo?.url ?? ""}
														style={{ width: 30, height: 30, borderRadius: 4 }}
													/>
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
							</MobileMediaQuery>
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
