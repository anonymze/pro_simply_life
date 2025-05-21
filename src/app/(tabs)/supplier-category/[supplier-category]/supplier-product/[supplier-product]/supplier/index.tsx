import { getSupplierProductQuery } from "@/api/queries/supplier-products-queries";
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
	const {
		"supplier-product": supplierProductId,
		"supplier-category": supplierCategoryId,
		"supplier-category-name": supplierCategoryName,
		"supplier-product-name": supplierProductName,
	} = useLocalSearchParams();

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
		<BackgroundLayout className="px-4 pt-4">
			<Title className="mb-2 mt-0" title={data.name} />
			<Text className="mb-5 text-xs text-defaultGray">Liste des fournisseurs</Text>
			{/* <InputSearch onSubmitEditing={() => {}} /> */}
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 10 }}
			>
				<View className="gap-2">
					{Object.keys(groupedSuppliers).map((letter) => (
						<View key={letter} className="gap-2">
							<Text className="mb-2 mt-4 text-base font-semibold text-defaultGray">{letter}</Text>
							{groupedSuppliers[letter].map((supplier) => (
								<CardSupplier
									icon={
										<ImagePlaceholder
											transition={300}
											contentFit="contain"
											placeholder={supplier.logo_mini?.blurhash}
											source={supplier.logo_mini?.url}
											style={{ width: 26, height: 26, borderRadius: 4 }}
										/>
									}
									key={supplier.id}
									supplier={supplier}
									link={{
										pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]`,
										params: {
											"supplier-category": supplierCategoryId,
											"supplier-category-name": supplierCategoryName,
											"supplier-product": supplierProductId,
											"supplier-product-name": supplierProductName,
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
