import { getPrivateEquitiesQuery } from "@/api/queries/private-equity-queries";
import { getSupplierProductQuery } from "@/api/queries/supplier-products-queries";
import CardSupplier from "@/components/card/card-supplier";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { PrivateEquity } from "@/types/private-equity";
import { Supplier } from "@/types/supplier";
import { cn } from "@/utils/cn";
import { GIRARDIN_INDUSTRIEL_ID, PRIVATE_EQUITY_ID, SCREEN_DIMENSIONS } from "@/utils/helper";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const {
		"supplier-product": supplierProductId,
		"supplier-category": supplierCategoryId,
		"supplier-category-name": supplierCategoryName,
		"supplier-product-name": supplierProductName,
		// "multiple-supplier-products": multipleSupplierProducts,
	} = useLocalSearchParams();

	const isPrivateEquity = PRIVATE_EQUITY_ID === supplierProductId;

	// Get the main supplier product data
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

			{isPrivateEquity ? (
				<PrivateEquityComponent
					supplierCategoryId={supplierCategoryId}
					supplierCategoryName={supplierCategoryName}
					supplierProductId={supplierProductId}
					supplierProductName={supplierProductName}
				/>
			) : (
				<SupplierListComponent
					groupedSuppliers={groupedSuppliers}
					supplierCategoryId={supplierCategoryId}
					supplierCategoryName={supplierCategoryName}
					supplierProductId={supplierProductId}
					supplierProductName={supplierProductName}
				/>
			)}
		</BackgroundLayout>
	);
}

const SupplierListComponent = ({
	groupedSuppliers,
	supplierCategoryId,
	supplierCategoryName,
	supplierProductId,
	supplierProductName,
}: {
	groupedSuppliers: Record<string, Supplier[]>;
	supplierCategoryId: string | string[];
	supplierCategoryName: string | string[];
	supplierProductId: string | string[];
	supplierProductName: string | string[];
}) => {
	return (
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
	);
};

// Type labels mapping
const PRIVATE_EQUITY_TYPE_LABELS: Record<PrivateEquity["type"], string> = {
	capital: "Capital investissement",
	dettes: "Dettes privées obligatoires",
	assurance: "Éligibles assurances vies",
};

const PrivateEquityComponent = ({
	supplierCategoryId,
	supplierCategoryName,
	supplierProductId,
	supplierProductName,
}: {
	supplierCategoryId: string | string[];
	supplierCategoryName: string | string[];
	supplierProductId: string | string[];
	supplierProductName: string | string[];
}) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["private-suppliers"],
		queryFn: getPrivateEquitiesQuery,
	});

	const [currentIndex, setCurrentIndex] = React.useState(0);
	const scrollRef = React.useRef<ScrollView>(null);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
			</View>
		);
	}

	if (!data || isError) {
		return null;
	}

	// Group private equities by type
	const groupedByType = data.docs.reduce(
		(acc, privateEquity) => {
			const type = privateEquity.type;
			if (!acc[type]) acc[type] = [];
			acc[type].push(privateEquity);
			return acc;
		},
		{} as Record<PrivateEquity["type"], PrivateEquity[]>,
	);

	// Get ordered types (capital, dettes, assurance)
	const orderedTypes = (["capital", "dettes", "assurance"] as const).filter(
		(type) => groupedByType[type] && groupedByType[type].length > 0,
	);

	return (
		<>
			{/* Type filter tabs */}
			<FlashList
				showsHorizontalScrollIndicator={false}
				data={orderedTypes}
				horizontal
				className="mb-4"
				estimatedItemSize={45}
				renderItem={({ item: type, index }) => {
					const isActive = currentIndex === index;

					return (
						<Pressable
							hitSlop={5}
							className={cn(
								"mr-3.5 flex w-full h-12 items-center justify-center rounded-lg px-3.5",
								isActive ? "bg-primary" : "bg-darkGray",
							)}
							onPress={() => {
								setCurrentIndex(index);
								const scrollX = index * (SCREEN_DIMENSIONS.width - 28 + 16); // width + gap
								scrollRef.current?.scrollTo({ x: scrollX, animated: true });
							}}
						>
							<Text className={cn("font-bold text-sm", isActive ? "text-white" : "text-primary")}>
								{PRIVATE_EQUITY_TYPE_LABELS[type]}
							</Text>
						</Pressable>
					);
				}}
			></FlashList>

			{/* Suppliers grouped by type */}
			<ScrollView
				ref={scrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEnabled={false}
				decelerationRate={"fast"}
				contentContainerStyle={{ gap: 16 }}
			>
				{orderedTypes.map((type) => (
					<View key={type} style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
						<ScrollView
							className="flex-1"
							showsVerticalScrollIndicator={false}
							style={{ backgroundColor: config.theme.extend.colors.background }}
							contentContainerStyle={{ paddingBottom: 10 }}
						>
							<View className="gap-2">
								{groupedByType[type]?.map((privateEquity) => {
									const supplier = typeof privateEquity.supplier === "string" ? null : privateEquity.supplier;

									if (!supplier) return null;

									return (
										<CardSupplier
											key={privateEquity.id}
											privateEquity={privateEquity}
											icon={
												<ImagePlaceholder
													transition={300}
													contentFit="contain"
													placeholder={supplier.logo_mini?.blurhash}
													source={supplier.logo_mini?.url}
													style={{ width: 26, height: 26, borderRadius: 4 }}
												/>
											}
											supplier={supplier}
											link={{
												pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]`,
												params: {
													"supplier-category": supplierCategoryId,
													"supplier-category-name": supplierCategoryName,
													"supplier-product": supplierProductId,
													"supplier-product-name": supplierProductName,
													"private-equity": privateEquity.id,
													supplier: supplier.id,
												},
											}}
										/>
									);
								})}
							</View>
						</ScrollView>
					</View>
				))}
			</ScrollView>
		</>
	);
};
