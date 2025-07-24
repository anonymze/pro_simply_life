import { getStructuredProductQuery } from "@/api/queries/structured-product-queries";
import { Brochure } from "@/components/brochure";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/libs/tailwind";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const { structured: structuredId } = useLocalSearchParams();

	const { data: structuredProduct } = useQuery({
		queryKey: ["struct", structuredId],
		queryFn: getStructuredProductQuery,
		enabled: !!structuredId,
	});

	if (!structuredProduct) return null;

	const percentage = (structuredProduct.current / structuredProduct.max) * 100;

	return (
		<BackgroundLayout className={cn("px-4 pb-4")}>
			<Title title={structuredProduct.supplier.name} />

			<ScrollView
				className="flex-1 "
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<View className="rounded-2xl  bg-white p-4 shadow-sm shadow-defaultGray/10">
					<View className="items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-5">
						<Text className="text-primaryLight">Enveloppe globale</Text>
						<Text className="font-bold text-2xl text-primary">{structuredProduct.max.toLocaleString()}€</Text>
					</View>
					<Text className="text-md mt-5 font-semibold text-primary">% de l'enveloppe remplise</Text>
					<View className="mt-5">
						<View className="flex-row">
							<View
								className="gap-1"
								style={{
									// minWidth: structuredProduct.max / structuredProduct.current,
									width: percentage > 10 ? `${10}%` : 22,
								}}
							>
								<Text className="text-center text-xs text-primaryLight">
									{Math.ceil((structuredProduct.current / structuredProduct.max) * 100)}%
								</Text>
								<View className="h-1.5 w-full rounded-full bg-production" />
							</View>
						</View>
					</View>
					<View className="mt-6 flex-row items-center gap-2">
						<View className="size-2 rounded-full bg-production" />
						<Text className="text-backgroundChat">Solde enveloppe</Text>
						<Text className="ml-auto font-light text-sm text-primaryLight">{structuredProduct.current}€</Text>
					</View>
					<Text className="text-md mb-1 mt-5 font-medium text-primary">Broker : {structuredProduct.broker}</Text>
					<Text className="text-md mb-1 mt-1 font-medium text-primary">
						Sous-jacent : {structuredProduct.sousjacent}
					</Text>
					<Text className="text-md mb-1 mt-1 font-medium text-primary">Maturité : {structuredProduct.mature}</Text>
					<Text className="text-md mb-1 mt-1 font-medium text-primary">
						Coupon de remboursement : {structuredProduct.coupon}
					</Text>
					<Text className="text-md mb-1 mt-1 font-medium text-primary">
						Fréquence de remboursement : {structuredProduct.frequency}
					</Text>
					<Text className="text-md mb-1 mt-1 font-medium text-primary">
						Seuil de remboursement : {structuredProduct.refund}
					</Text>
					<Text className="text-md mb-1 mt-1 font-medium text-primary">
						Seuil de perte en capital : {structuredProduct.capital}
					</Text>
					<Text className="text-md mb-3 mt-6 font-medium text-primary">Date de début de commercialisation</Text>
					<Text className=" text-sm text-primaryLight">
						{new Date(structuredProduct.start_comm).toLocaleDateString()}
					</Text>
					<Text className="text-md mb-3 mt-6 font-medium text-primary">Date de fin de commercialisation</Text>
					<Text className=" text-sm text-primaryLight">
						{new Date(structuredProduct.end_comm).toLocaleDateString()}
					</Text>
					<Text className="text-md mb-3 mt-6 font-medium text-primary">Date de constations</Text>
					<Text className=" text-sm text-primaryLight">
						{new Date(structuredProduct.constatation).toLocaleDateString()}
					</Text>
				</View>

				<View className="mt-4 gap-3">
					{structuredProduct.offers?.map((offer) => (
						<Brochure
							key={offer.id}
							title={offer.name}
							brochure={offer.file}
							updatedAt={structuredProduct.updatedAt}
							link={{
								pathname: "/structured/pdf/[pdf]",
								params: {
									pdf: offer.file.filename,
								},
							}}
						/>
					))}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}
