import { getSupplierCategoryQuery } from "@/api/queries/supplier-categories-queries";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	const { "supplier-category": supplierCategoryId, "supplier-category-name": supplierCategoryName } = useLocalSearchParams();

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

	return (
		<BackgroundLayout className="p-4">
			<Title className="mb-2 mt-0" title={data.name} />
			<Text className="mb-5 text-xs text-defaultGray">{description}</Text>
			{/* <InputSearch onSubmitEditing={() => {}} /> */}
			<ScrollView
				showsVerticalScrollIndicator={false}
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
		</BackgroundLayout>
	);
}
