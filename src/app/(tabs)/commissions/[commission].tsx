import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { getCommissionMonthlyAndYearlyDataQuery } from "@/api/queries/commission-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { CommissionLight } from "@/types/commission";
import { useLocalSearchParams } from "expo-router";
import { DownloadIcon } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { downloadFile } from "@/utils/download";
import { cn } from "@/utils/libs/tailwind";
import Title from "@/components/ui/title";
import { cssInterop } from "nativewind";
import { VideoView } from "expo-video";
import config from "tailwind.config";
import React from "react";


cssInterop(VideoView, {
	className: "style",
});

export default function Page() {
	const { commission: commissionId } = useLocalSearchParams();
	const [idLoadingDownload, setIdLoadingDownload] = React.useState<string | null>(null);

	const { data: commissions } = useQuery({
		queryKey: ["commissions", commissionId],
		queryFn: getCommissionMonthlyAndYearlyDataQuery,
		enabled: !!commissionId,
	});

	if (!commissions) return null;

	return (
		<BackgroundLayout className={cn("bg-white px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<View className="flex-row items-center gap-2 border-b border-primaryUltraLight pb-3">
				<Text className="w-24 text-center text-sm  text-primary">Fournisseur</Text>
				<Text className="w-32 text-center text-sm text-primary">Type</Text>
				<Text className="w-20 text-center text-sm text-primary">Montant</Text>
				<Text className="ml-auto text-center text-sm text-primary">Fichier</Text>
			</View>
			<FlashList
				data={commissions as unknown as CommissionLight[]}
				extraData={idLoadingDownload}
				renderItem={({ item }) => {
					return (
						<View className="my-4 flex-row items-center gap-2">
							<View className="w-24 items-center justify-center gap-2">
								<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
									<ImagePlaceholder
										transition={300}
										contentFit="cover"
										placeholder={item.supplier.logo_mini?.blurhash}
										placeholderContentFit="cover"
										source={item.supplier.logo_mini?.url}
										style={{ width: 26, height: 26, borderRadius: 4 }}
									/>
								</View>
								<Text className="text-center font-semibold text-sm text-primary" numberOfLines={1}>
									{item.supplier.name}
								</Text>
							</View>
							<View className="w-32 items-center justify-center gap-2">
								{item.structured_product ? (
									<Text className="rounded-full bg-[#F0F9FF] p-1 px-2 text-xs text-[#026AA2]">Produit structuré</Text>
								) : (
									<>
										{item.informations?.production && (
											<Text className="rounded-full bg-[#FEF3F2] p-1 px-2 text-xs text-[#B42318]">Production</Text>
										)}
										{item.informations?.encours && (
											<Text className="rounded-full bg-[#EEF4FF] p-1 px-2 text-xs text-[#3538CD]">Encours</Text>
										)}
									</>
								)}
							</View>
							<View className="w-20 items-center justify-center gap-2">
								{item.structured_product ? (
									<Text className="text-sm text-[#026AA2]">{item.informations?.up_front}€</Text>
								) : (
									<>
										{item.informations?.production && (
											<Text className="text-sm text-[#B42318]">{item.informations?.production}€</Text>
										)}
										{item.informations?.encours && (
											<Text className="text-sm text-[#3538CD]">{item.informations?.encours}€</Text>
										)}
									</>
								)}
							</View>
							<View className="ml-auto">
								{item.informations?.pdf && (
									<TouchableOpacity
										disabled={idLoadingDownload === item.id}
										onPress={() => {
											if (
												!item.informations?.pdf?.url ||
												!item.informations?.pdf?.filename ||
												!item.informations?.pdf?.mimeType
											)
												return;

											setIdLoadingDownload(item.id);
											downloadFile(
												item.informations?.pdf.url,
												item.informations?.pdf.filename,
												item.informations?.pdf.mimeType,
											)
												.then(() => {
													// Alert.alert("PDF téléchargée !");
												})
												.catch((_) => {
													Alert.alert(
														"La PDF n'a pas pu être téléchargée",
														"Vérifiez que le nom du fichier n'existe pas déjà sur votre appareil ou que vous avez assez d'espace de stockage.",
													);
												})
												.finally(() => {
													setIdLoadingDownload(null);
												});
										}}
										className={cn(
											"rounded-full p-3",
											idLoadingDownload === item.id ? "bg-gray-200" : "bg-primaryUltraLight active:bg-primary",
										)}
									>
										{idLoadingDownload === item.id ? (
											<ActivityIndicator
												size="small"
												style={{ width: 16, height: 16 }}
												color={config.theme.extend.colors.primary}
											/>
										) : (
											<DownloadIcon
												size={16}
												color={
													idLoadingDownload === item.id
														? config.theme.extend.colors.defaultGray
														: config.theme.extend.colors.primary
												}
											/>
										)}
									</TouchableOpacity>
								)}
							</View>
						</View>
					);
				}}
				estimatedItemSize={42}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 16 }}
				ItemSeparatorComponent={() => <View className="border-b border-primaryUltraLight" />}
			/>
		</BackgroundLayout>
	);
}
