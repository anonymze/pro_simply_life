import { getPrivateEquitiesQuery } from "@/api/queries/private-equity-queries";
import { getSupplierProductQuery } from "@/api/queries/supplier-products-queries";
import CardSupplier from "@/components/card/card-supplier";
import { MyTouchableOpacity } from "@/components/my-pressable";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { PrivateEquity } from "@/types/private-equity";
import { Supplier } from "@/types/supplier";
import { cn } from "@/utils/cn";
import { CLUB_DEALS_ID, GIRARDIN_INDUSTRIEL_ID, PRIVATE_EQUITY_ID, SCREEN_DIMENSIONS } from "@/utils/helper";
import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { MailIcon, PhoneIcon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const {
		"supplier-product": supplierProductId,
		"supplier-category": supplierCategoryId,
		"supplier-category-name": supplierCategoryName,
		"supplier-product-name": supplierProductName,
		// "multiple-supplier-products": multipleSupplierProducts,
	} = useLocalSearchParams<{
		"supplier-product": string;
		"supplier-category": string;
		"supplier-category-name": string;
		"supplier-product-name": string;
	}>();

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
	supplierCategoryId: string;
	supplierCategoryName: string;
	supplierProductId: string;
	supplierProductName: string;
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
						<Text className="mb-2 mt-4 text-base font-semibold text-defaultGray">{letter}</Text>
						{groupedSuppliers[letter].map((supplier) => (
							<CardSupplier
								enveloppe={supplierProductId === GIRARDIN_INDUSTRIEL_ID}
								clubDeals={supplierProductId === CLUB_DEALS_ID}
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

const REFERENT_NAME = "David DUGUANT";
const REFERENT_PHONE = "0783185728";
const REFERENT_EMAIL = "dugandpatrimoine@gmail.com";

const ReferentCard = () => {
	return (
		<View className="mb-4 flex-row items-center gap-2 rounded-xl border border-defaultGray/10 bg-white px-3 py-2">
			<View className="shrink gap-0.5">
				<Text className="text-xs text-primaryLight">Référent</Text>
				<Text selectable className="text-sm font-semibold text-primary">
					{REFERENT_NAME}
				</Text>
			</View>
			<View className="ml-auto flex-row items-center gap-4">
				<TouchableOpacity
					onLongPress={() => Linking.openURL(`sms:${REFERENT_PHONE}`)}
					onPress={() => Linking.openURL(`tel:${REFERENT_PHONE}`)}
					className="rounded-full bg-primaryUltraLight p-2.5"
				>
					<PhoneIcon size={14} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => Linking.openURL(`mailto:${REFERENT_EMAIL}`)}
					className="rounded-full bg-primaryUltraLight p-2.5"
				>
					<MailIcon size={14} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

// Type labels mapping
const PRIVATE_EQUITY_TYPE_LABELS: Record<PrivateEquity["type"], string> = {
	capital: "Capital investissement",
	dettes: "Dettes privées obligataires",
	assurance: "Éligibles assurances vies",
};

const PrivateEquityComponent = ({
	supplierCategoryId,
	supplierCategoryName,
	supplierProductId,
	supplierProductName,
}: {
	supplierCategoryId: string;
	supplierCategoryName: string;
	supplierProductId: string;
	supplierProductName: string;
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

	if (!data || isError) return null

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

	for (const type of Object.keys(groupedByType) as PrivateEquity["type"][]) {
		groupedByType[type].sort((a, b) => {
			const nameA = typeof a.supplier === "string" ? "" : a.supplier?.name ?? "";
			const nameB = typeof b.supplier === "string" ? "" : b.supplier?.name ?? "";
			return nameA.localeCompare(nameB, "fr", { sensitivity: "base" });
		});
	}

	// Get ordered types (capital, dettes, assurance)
	const orderedTypes = (["capital", "dettes", "assurance"] as const).filter(
		(type) => groupedByType[type] && groupedByType[type].length > 0,
	);


	return (
		<>
			<ReferentCard />

			<LegendList
				showsHorizontalScrollIndicator={false}
				data={orderedTypes}
				horizontal
				className="mb-4"
				style={{ maxHeight: 48 }}
				extraData={currentIndex}
				renderItem={({ item: type, index }) => {
					const isActive = currentIndex === index;

					return (
						<MyTouchableOpacity
							hitSlop={5}
							className={cn(
								"mr-3.5 flex h-12 items-center justify-center rounded-lg px-3.5",
								isActive ? "bg-primary" : "bg-darkGray",
							)}
							onPress={() => {
								setCurrentIndex(index);
								const scrollX = index * (SCREEN_DIMENSIONS.width - 28 + 16); // width + gap
								scrollRef.current?.scrollTo({ x: scrollX, animated: true });
							}}
						>
							<Text className={cn("text-sm font-bold", isActive ? "text-white" : "text-primary")}>
								{PRIVATE_EQUITY_TYPE_LABELS[type]}
							</Text>
						</MyTouchableOpacity>
					);
				}}
			/>

			{/* Suppliers grouped by type */}
			<ScrollView
				scrollViewRef={scrollRef as React.RefObject<ScrollView>}
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEnabled={false}
				decelerationRate={"fast"}
				contentContainerStyle={{ gap: 16 }}
			>
				{orderedTypes.map((type) => (
					<View key={type} style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
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
