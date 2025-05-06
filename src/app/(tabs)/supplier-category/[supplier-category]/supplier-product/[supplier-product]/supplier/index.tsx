import { getSupplierCategoryQuery } from "@/api/queries/supplier-categories-queries";
import { getSupplierProductQuery } from "@/api/queries/supplier-products-queries";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import CardSupplier from "@/components/card/card-supplier";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";
import config from "tailwind.config";
import { Image } from "expo-image";
import React from "react";


export default function Page() {
	const { "supplier-product": supplierProductId, "supplier-category": supplierCategoryId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier-product", supplierProductId],
		queryFn: getSupplierProductQuery,
		enabled: !!supplierProductId,
	});

	if (!data) return null;

	console.log(data.suppliers);

	return (
		<BackgroundLayout className="p-4">
			<Title className="mb-2 mt-0" title={data.name} />
			<Text className="mb-7 text-xs text-defaultGray">Liste des fournisseurs</Text>
			<InputSearch onSubmit={() => {}} />
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
			>
				<View className="mt-5 gap-2">
					{data.suppliers.map((supplier) => (
						<CardSupplier
							icon={supplier.logo ? <Image source={supplier.logo.url} style={{ width: 22, height: 22 }} /> : undefined}
							key={supplier.id}
							supplier={supplier}
							link={{
								pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier`,
								params: {
									"supplier-category": supplierCategoryId,
									"supplier-product": supplierProductId,
									supplier: supplier.id,
								},
							}}
						/>
					))}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}
