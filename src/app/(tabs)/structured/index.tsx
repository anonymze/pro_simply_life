import { queryClient } from "@/api/_queries";
import { getStructuredProductsQuery } from "@/api/queries/structured-product-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { StructuredProduct } from "@/types/structured-product";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["structured"],
			queryFn: getStructuredProductsQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Produits structurés" className="mb-7" />

					<FlashList
						data={data.docs}
						renderItem={(item) => {
							return <Card structuredProduct={item.item} />;
						}}
						estimatedItemSize={100}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 10 }}
						ItemSeparatorComponent={() => <View className="h-2.5" />}
					/>
				</BackgroundLayout>
			);
		},
	)();
}

function Card({ structuredProduct }: { structuredProduct: StructuredProduct }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["struct", structuredProduct.id], structuredProduct);
	}, [structuredProduct]);

	return (
		<Link
			href={{
				pathname: "/(tabs)/structured/[structured]",
				params: { structured: structuredProduct.id },
			}}
			push
			asChild
		>
			<TouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 shadow-sm shadow-defaultGray/10"
			>
				<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
					<ImagePlaceholder
						transition={300}
						contentFit="contain"
						placeholder={structuredProduct.supplier.logo_mini?.blurhash}
						source={structuredProduct.supplier.logo_mini?.url}
						style={{ width: 26, height: 26, borderRadius: 4 }}
					/>
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{structuredProduct.supplier.name}</Text>
				</View>
				<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
}

// axa thema -  cardif - generali - oddo - suravenir - swiss life - oradea

// assureurs liste -> exemple :  oradea enveloppe + taux de remplissage

// memo
// -> 1 onglet produit encours
// / 1 coupon annuel / 1 barriere de rgressivité / date de conatstation
// assureur
