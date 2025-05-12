import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import CardSupplierCategory from "@/components/card/card-supplier-category";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { Supplier, SupplierCategory } from "@/types/supplier";
import { withQueryWrapper } from "@/utils/libs/react-query";
import CardSupplier from "@/components/card/card-supplier";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";
import config from "tailwind.config";
import React from "react";


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
				<BackgroundLayout className="p-4">
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
							showsVerticalScrollIndicator={false}
							style={{ backgroundColor: config.theme.extend.colors.background }}
						>
							<View className="mt-5 gap-2">
								{data?.docs?.map((supplierCategory) => (
									<CardSupplierCategory
										key={supplierCategory.id}
										supplierCategory={supplierCategory}
										icon={
											<ImagePlaceholder source={supplierCategory.logo?.url ?? ""} style={{ width: 22, height: 22 }} />
										}
										link={{
											pathname: `/supplier-category/[supplier-category]/supplier-product`,
											params: {
												"supplier-category": supplierCategory.id,
												"supplier-category-name": supplierCategory.name,
											},
										}}
									/>
								))}
							</View>
						</ScrollView>
					) : (
						<React.Fragment>
							{!filteredData?.length ? (
								<View className="flex-1 items-center justify-center">
									<Text className="text-sm text-defaultGray">Aucun fournisseur trouvé</Text>
								</View>
							) : (
								<ScrollView
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
						</React.Fragment>
					)}
				</BackgroundLayout>
			);
		},
	)();
}

const CardSearchSupplier = ({ supplier }: { supplier: Supplier & { productName: string; productId: string, categoryName: string } }) => {
	return (
		<View>
			<Text className="text-md font-semibold text-defaultGray mb-3">{supplier.productName}</Text>
			<CardSupplier
				icon={
					<ImagePlaceholder source={supplier.logo_mini?.url ?? ""} style={{ width: 26, height: 26, borderRadius: 4 }} />
				}
				supplier={supplier}
				link={{
					pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]`,
					params: {
						"supplier-category": supplier.productId,
						"supplier-category-name": supplier.categoryName,
						"supplier-product-name": supplier.productName,
						supplier: supplier.id,
					},
				}}
			/>
		</View>
	);
};
