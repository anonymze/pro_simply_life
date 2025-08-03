import { getStructuredProductQuery } from "@/api/queries/structured-product-queries";
import { Brochure } from "@/components/brochure";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { brokerLabels } from "@/types/structured-product";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { LinkIcon } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
		<>
			<View className="items-center rounded-b-2xl bg-white pb-4">
				<ImagePlaceholder
					transition={300}
					contentFit="contain"
					placeholder={structuredProduct.supplier.logo_full?.blurhash}
					source={structuredProduct.supplier.logo_full?.url}
					style={{ width: "95%", height: 60 }}
				/>
				<View className="mt-4 flex-row items-center gap-3">
					<Text className="font-bold text-xl">{structuredProduct.supplier.name}</Text>
					{structuredProduct.supplier.website && (
						<TouchableOpacity
							className="rounded-full bg-primaryUltraLight p-2.5"
							onPress={async () => await WebBrowser.openBrowserAsync(structuredProduct.supplier.website!)}
						>
							<LinkIcon size={14} color={config.theme.extend.colors.primary} />
						</TouchableOpacity>
					)}
				</View>
			</View>
			<BackgroundLayout className="px-4 pt-6">
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 16 }}
				>
					<View className="rounded-2xl  bg-white p-4 shadow-sm shadow-defaultGray/10">
						<View className="items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-5">
							<Text className="text-primaryLight">Enveloppe globale</Text>
							<Text className="font-bold text-2xl text-primary">{structuredProduct.max.toLocaleString()}€</Text>
						</View>
						<Text className="text-md mt-5 font-semibold text-primary">Taux de remplissage actuel</Text>
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
					</View>

					<Text className="mb-2 mt-5 font-semibold text-primary">Partenaires</Text>
					<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
						<Text className="text-sm text-primaryLight">Assureur</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.supplier.name}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Broker</Text>
						<Text selectable className="font-semibold text-primary">
							{brokerLabels[structuredProduct.broker]}
						</Text>
					</View>

					<Text className="mb-2 mt-5 font-semibold text-primary">Commercialisation</Text>
					<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
						<Text className="text-sm text-primaryLight">Date de début</Text>
						<Text selectable className="font-semibold text-primary">
							{new Date(structuredProduct.start_comm).toLocaleString("fr-FR", {
								day: "numeric",
								month: "numeric",
								year: "numeric",
							})}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Date de fin</Text>
						<Text selectable className="font-semibold text-primary">
							{new Date(structuredProduct.end_comm).toLocaleString("fr-FR", {
								day: "numeric",
								month: "numeric",
								year: "numeric",
							})}
						</Text>
					</View>

					<Text className="mb-2 mt-5 font-semibold text-primary">Structure produit</Text>
					<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
						<Text className="text-sm text-primaryLight">Date de constations</Text>
						<Text selectable className="font-semibold text-primary">
							{new Date(structuredProduct.constatation).toLocaleString("fr-FR", {
								day: "numeric",
								month: "numeric",
								year: "numeric",
							})}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Sous-jacent</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.sousjacent}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Maturité</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.mature}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Coupon de remboursement anticipé</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.coupon}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Fréquence de remboursement anticipé</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.frequency}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Seuil de remboursement anticipé</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.refund}
						</Text>
						<View className="my-2 h-px w-full bg-defaultGray/15" />
						<Text className="text-sm text-primaryLight">Seuil de perte en capital à maturité</Text>
						<Text selectable className="font-semibold text-primary">
							{structuredProduct.capital}
						</Text>
					</View>

					{structuredProduct.offers?.length ? (
						<>
							<Text className="mb-2 mt-5 font-semibold text-primary">Brochures</Text>
							<View className="gap-2">
								{structuredProduct.offers!.map((offer) => (
									<Brochure
										title="Brochure"
										key={offer.id}
										brochure={offer.file}
										updatedAt={structuredProduct.updatedAt}
										link={{
											pathname: "structured/pdf/[pdf]",
											params: {
												pdf: offer.file.filename,
											},
										}}
									/>
								))}
							</View>
						</>
					) : null}
				</ScrollView>
			</BackgroundLayout>
		</>
	);
}
