import { getSupplierProductQuery } from "@/api/queries/supplier-products-queries";
import CardSupplier from "@/components/card/card-supplier";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { GIRARDIN_INDUSTRIEL_ID, PRIVATE_EQUITY_ID, SCREEN_DIMENSIONS } from "@/utils/helper";
import { Picker } from "@expo/ui/swift-ui";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import config from "tailwind.config";

export default function Page() {
	const scrollRef = React.useRef<ScrollView>(null);
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
			<Text className="mb-5 text-sm text-defaultGray">Liste des fournisseurs</Text>

			{supplierProductId === PRIVATE_EQUITY_ID && (
				<Picker
					style={{ width: SCREEN_DIMENSIONS.width - 28, marginBottom: 16, marginHorizontal: "auto" }}
					variant="segmented"
					options={["Capital investissement", "Dettes privées obligtoires", "Éligible assurance vie"]}
					selectedIndex={null}
					onOptionSelected={({ nativeEvent: { index } }) => {
						if (index === 0) {
							scrollRef.current?.scrollTo({ x: 0, animated: true });
						} else {
							scrollRef.current?.scrollToEnd({ animated: true });
						}
					}}
				/>
			)}

			{supplierProductId === PRIVATE_EQUITY_ID ? (
				<ScrollView
					ref={scrollRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					decelerationRate={"fast"}
					contentContainerStyle={{ gap: 16 }}
				>
					<View style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
						<ScrollView
							className="flex-1"
							showsVerticalScrollIndicator={false}
							style={{ backgroundColor: config.theme.extend.colors.background }}
							contentContainerStyle={{ paddingBottom: 10 }}
						>
							<View className="gap-2">
								{Object.keys(groupedSuppliers).map((letter) => (
									<View key={letter} className="gap-2">
										<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{letter}</Text>
										{groupedSuppliers[letter].map((supplier) => (
											<CardSupplier
												enveloppe={false}
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
					</View>
				</ScrollView>
			) : (
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 10 }}
				>
					<View className="gap-2">
						{Object.keys(groupedSuppliers).map((letter) => (
							<View key={letter} className="gap-2">
								<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{letter}</Text>
								{groupedSuppliers[letter].map((supplier) => (
									<CardSupplier
										enveloppe={supplierProductId === GIRARDIN_INDUSTRIEL_ID}
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
			)}
		</BackgroundLayout>
	);
}
