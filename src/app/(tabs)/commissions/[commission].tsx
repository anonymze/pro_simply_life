import { getCommissionMonthlyAndYearlyDataQuery } from "@/api/queries/commission-queries";
import BackgroundLayout from "@/layouts/background-layout";
import { CommissionLight } from "@/types/commission";
import { cn } from "@/utils/libs/tailwind";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";


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
		<BackgroundLayout className={cn("bg-white px-4 pb-4")}>
			{/* <View className="flex-row items-center gap-2 border-b border-primaryUltraLight pb-3">
				<Text className="w-24 text-center text-sm  text-primary">Fournisseur</Text>
				<Text className="w-32 text-center text-sm text-primary">Type</Text>
				<Text className="w-20 text-center text-sm text-primary">Montant</Text>
				<Text className="ml-auto text-center text-sm text-primary">Fichier</Text>
			</View> */}
			<View className="flex-row items-center justify-around gap-2 border-b border-primaryUltraLight pb-3">
				<Text className="w-40 text-center text-sm text-primary">Type</Text>
				<Text className="w-40 text-center text-sm text-primary">Montant</Text>
			</View>
			<FlashList
				data={commissions as unknown as CommissionLight[]}
				extraData={idLoadingDownload}
				renderItem={({ item }) => {
					return (
						<View className="my-4 flex-row items-center justify-around gap-2">
							{item.structured_product ? (
								<View className="w-40 items-center justify-center gap-2">
									<Text className="rounded-full bg-[#F0F9FF] p-1 px-2 text-xs text-[#026AA2]">Produit structuré</Text>
								</View>
							) : (
								<View className="w-40 items-center justify-center gap-2">
									{item.informations?.production ? (
										<Text className="rounded-full bg-[#FEF3F2] p-1 px-2 text-xs text-[#B42318]">Production</Text>
									) : null}
									{item.informations?.encours ? (
										<Text className="rounded-full bg-[#EEF4FF] p-1 px-2 text-xs text-[#3538CD]">Encours</Text>
									) : null}
								</View>
							)}
							{item.structured_product ? (
								<View className="w-40 items-center justify-center gap-2">
									<Text className="text-sm text-[#026AA2]">{item.informations?.up_front?.toLocaleString('fr-FR')}€</Text>
								</View>
							) : (
								<View className="w-40 items-center justify-center gap-2">
									{item.informations?.production ? (
										<Text className="text-sm text-[#B42318]">{item.informations?.production?.toLocaleString('fr-FR')}€</Text>
									) : null}
									{item.informations?.encours ? (
										<Text className="text-sm text-[#3538CD]">{item.informations?.encours?.toLocaleString('fr-FR')}€</Text>
									) : null}
								</View>
							)}
						</View>
					);
				}}
				// estimatedItemSize={42}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 16 }}
				ItemSeparatorComponent={() => <View className="border-b border-primaryUltraLight" />}
			/>
		</BackgroundLayout>
	);
}
