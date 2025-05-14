import { getSupplierCategoryQuery } from "@/api/queries/supplier-categories-queries";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import CardSearchSupplier from "@/components/card/card-search-supplier";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardSupplier from "@/components/card/card-supplier";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Supplier } from "@/types/supplier";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";
import config from "tailwind.config";
import React from "react";


export default function Page() {
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
					.slice(0, 3)
					.map((supplier) => supplier.name)
					.join(", ") + (data.product_suppliers.length > 3 ? "..." : "");
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
			<InputSearch
				placeholder="Rechercher un fournisseur..."
				onSubmitEditing={(input) => {
					setSearch(input.nativeEvent.text);
				}}
				onClear={() => {
					setSearch("");
				}}
			/>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
			>
				{search.length < 3 ? (
					<>
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
					</>
				) : (
					<>
						{!filteredData?.length ? (
							<View className="flex-1 items-center justify-center">
								<Text className="text-sm text-defaultGray">Aucun fournisseur trouvé</Text>
							</View>
						) : (
							<View className="mt-5 gap-5">
								{filteredData.map((supplier) => (
									<CardSearchSupplier key={supplier.productId + supplier.id} supplier={supplier} />
								))}
							</View>
						)}
					</>
				)}
			</ScrollView>
		</BackgroundLayout>
	);
}
