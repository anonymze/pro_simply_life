import { getSupplierCategoryQuery } from "@/api/queries/supplier-categories-queries";
import { getSupplierProductQuery } from "@/api/queries/supplier-products-queries";
import CardSupplierProduct from "@/components/card/card-supplier-product";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import CardSupplier from "@/components/card/card-supplier";
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
	const { "supplier-product": supplierProductId, "supplier-category": supplierCategoryId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier-product", supplierProductId],
		queryFn: getSupplierProductQuery,
		enabled: !!supplierProductId,
	});

	if (!data) return null;

	// sort and group suppliers by first letter
	const groupedSuppliers = React.useMemo(
		() =>
			data.suppliers
				.slice()
				.sort((a, b) => a.name.localeCompare(b.name, "fr"))
				.reduce(
					(acc, supplier) => {
						const letter = supplier.name[0].toUpperCase();
						if (!acc[letter]) acc[letter] = [];
						acc[letter].push(supplier);
						return acc;
					},
					{} as Record<string, typeof data.suppliers>,
				),
		[data],
	);

	return (
		<BackgroundLayout className="p-4">
			<Title className="mb-2 mt-0" title={data.name} />
			<Text className="mb-7 text-xs text-defaultGray">Liste des fournisseurs</Text>
			<InputSearch onSubmit={() => {}} />
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
			>
				<View className="gap-2">
					{Object.keys(groupedSuppliers)
						.sort()
						.map((letter) => (
							<View key={letter} className="gap-2">
								<Text className="mb-2 mt-4 text-base font-semibold text-defaultGray">{letter}</Text>
								{groupedSuppliers[letter].map((supplier) => (
									<CardSupplier
										icon={<ImagePlaceholder source={supplier.logo?.url} style={{ width: 22, height: 22 }} />}
										key={supplier.id}
										supplier={supplier}
										link={{
											pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]`,
											params: {
												"supplier-category": supplierCategoryId,
												"supplier-product": supplierProductId,
												supplier: supplier.id,
											},
										}}
									/>
								))}
							</View>
						))}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}
