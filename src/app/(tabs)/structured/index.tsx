import { queryClient } from "@/api/_queries";
import { getStructuredProductsQuery } from "@/api/queries/structured-product-queries";
import { MyTouchableScaleOpacity } from "@/components/my-pressable";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { StructuredProduct } from "@/types/structured-product";
import { cn } from "@/utils/cn";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { Link } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from "tailwind.config";

export default function Page() {
	const insets = useSafeAreaInsets();
	return withQueryWrapper(
		{
			queryKey: ["structured"],
			queryFn: getStructuredProductsQuery,
		},
		({ data }) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const enCours = data.docs.filter((product) => {
				const startComm = new Date(product.start_comm);
				const endComm = new Date(product.end_comm);
				return today >= startComm && today < endComm;
			});

			const aVenir = data.docs.filter((product) => {
				const startComm = new Date(product.start_comm);
				return today < startComm;
			});

			return (
				<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
					<Title title="Produits structurés" className="mb-7" />

					<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
						{enCours.length > 0 && (
							<View className="mb-6">
								<Text className="mb-3 text-base font-semibold text-primary">En cours</Text>
								{enCours.map((product, index) => (
									<View key={product.id}>
										<Card structuredProduct={product} />
										{index < enCours.length - 1 && <View className="h-2.5" />}
									</View>
								))}
							</View>
						)}

						{aVenir.length > 0 && (
							<View className="mb-6">
								<Text className="mb-3 text-base font-semibold text-primary">À venir</Text>
								{aVenir.map((product, index) => (
									<View key={product.id}>
										<Card structuredProduct={product} />
										{index < enCours.length - 1 && <View className="h-2.5" />}
									</View>
								))}
							</View>
						)}
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}

function Card({ structuredProduct, disabled = false }: { structuredProduct: StructuredProduct; disabled?: boolean }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["struct", structuredProduct.id], structuredProduct);
	}, [structuredProduct]);

	if (disabled) {
		return (
			<View className="w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 opacity-80">
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
					<Text className="text-lg font-semibold text-primary">{structuredProduct.supplier.name}</Text>
					<Text className={cn("text-sm text-primaryLight")}>
						{new Date(structuredProduct.start_comm).toLocaleDateString("fr-FR", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</Text>
				</View>
			</View>
		);
	}

	return (
		<Link
			href={{
				pathname: "/(tabs)/structured/[structured]",
				params: { structured: structuredProduct.id },
			}}
			push
			asChild
		>
			<MyTouchableScaleOpacity
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
					<Text className="text-lg font-semibold text-primary">{structuredProduct.supplier.name}</Text>
					<Text className={cn("text-sm text-primaryLight")}>{structuredProduct.name}</Text>
				</View>
				<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</MyTouchableScaleOpacity>
		</Link>
	);
}
