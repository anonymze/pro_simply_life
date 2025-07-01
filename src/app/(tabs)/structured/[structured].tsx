import { getStructuredProductQuery } from "@/api/queries/structured-product-queries";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/libs/tailwind";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
	const { structured: structuredId } = useLocalSearchParams();

	const { data: structuredProduct } = useQuery({
		queryKey: ["struct", structuredId],
		queryFn: getStructuredProductQuery,
		enabled: !!structuredId,
	});

	if (!structuredProduct) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4")}>
			<Title title={structuredProduct.supplier.name} />

			<View className="rounded-2xl  bg-white p-4 shadow-sm shadow-defaultGray/10">
				<View className="items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-5">
					<Text className="text-primaryLight">Enveloppe globale</Text>
					<Text className="font-bold text-2xl text-primary">{structuredProduct.max}€</Text>
				</View>
				<Text className="text-md mt-5 font-semibold text-primary">% de l'enveloppe remplise</Text>
				<View className="mt-5">
					<View className="flex-row">
						<View
							className="mr-1 gap-1"
							style={{
								minWidth: structuredProduct.max / structuredProduct.current,
								flex: structuredProduct.max / structuredProduct.current,
							}}
						>
							<Text className="text-center text-xs text-primaryLight">10%</Text>
							<View className="h-1.5 w-full rounded-full bg-production" />
						</View>
					</View>
				</View>
				<View className="mt-6 flex-row items-center gap-2">
					<View className="size-2 rounded-full bg-production" />
					<Text className="text-backgroundChat">Enveloppe actuelle</Text>
					<Text className="ml-auto font-light text-sm text-primaryLight">{structuredProduct.current}€</Text>
				</View>
				<View className="mt-1 flex-row items-center gap-2">
					<View className="size-2 rounded-full bg-encours" />
					<Text className="text-backgroundChat">Coupon annuel</Text>
					<Text className="ml-auto font-light text-sm text-primaryLight">{structuredProduct.coupon}€</Text>
				</View>
				<View className="mt-1 flex-row items-center gap-2">
					<View className="size-2 rounded-full bg-structured" />
					<Text className="text-backgroundChat">Barrière de regressivité</Text>
					<Text className="ml-auto font-light text-sm text-primaryLight">{structuredProduct.barrier}€</Text>
				</View>
				<Text className="text-md mb-3 mt-6 font-medium text-primary">Date de constatation</Text>
				<Text className=" text-sm text-primaryLight">
					{new Date(structuredProduct.constatation).toLocaleDateString()}
				</Text>
			</View>
		</BackgroundLayout>
	);
}
