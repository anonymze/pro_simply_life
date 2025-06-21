import { getCommissionMonthlyDataQuery } from "@/api/queries/commission-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { CommissionLight } from "@/types/commission";
import { Platform, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { cn } from "@/utils/libs/tailwind";
import Title from "@/components/ui/title";
import { cssInterop } from "nativewind";
import { VideoView } from "expo-video";


cssInterop(VideoView, {
	className: "style",
});

export default function Page() {
	const { commission: commissionId } = useLocalSearchParams();

	const { data: commissions } = useQuery({
		queryKey: ["commissions", commissionId],
		queryFn: getCommissionMonthlyDataQuery,
		enabled: !!commissionId,
	});

	if (!commissions) return null;

	console.log(commissions);

	return (
		<BackgroundLayout className={cn("bg-white px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<View className="flex-row items-center justify-between border-b border-primaryUltraLight pb-3">
				<Text className="text-sm text-primary">Fournisseur</Text>
				<Text className="text-sm text-primary">Type</Text>
				<Text className="text-sm text-primary">Montant</Text>
				<Text className="text-sm text-primary">PDF</Text>
			</View>
			<FlashList
				data={commissions as unknown as CommissionLight[]}
				renderItem={({ item }) => {
					return (
						<View className="flex-row items-center justify-between">
							<View className="size-8 items-center justify-center rounded-2xl bg-background">
								<ImagePlaceholder
									transition={300}
									contentFit="cover"
									// contentPosition="top"
									placeholder={item.supplier.logo_mini?.blurhash}
									placeholderContentFit="cover"
									source={item.supplier.logo_mini?.url}
									style={{ width: 20, height: 20, borderRadius: 99 }}
								/>
							</View>
							{/* <Text className="text-sm text-primary">{item.type}</Text>
							<Text className="text-sm text-primary">{item.amount}</Text>
							<Text className="text-sm text-primary">{item.pdf}</Text> */}
						</View>
					);
				}}
				estimatedItemSize={42}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 16 }}
				ItemSeparatorComponent={() => <View className="h-5 border-b border-primaryUltraLight" />}
			/>
		</BackgroundLayout>
	);
}
