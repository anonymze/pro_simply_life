import { getCommissionQuery } from "@/api/queries/commission-queries";
import { View, Text, Platform, Dimensions } from "react-native";
import BackgroundLayout from "@/layouts/background-layout";
import { getFundesysQuery } from "@/api/queries/fundesys";
import { useVideoPlayer, VideoView } from "expo-video";
import { getFidnetQuery } from "@/api/queries/fidnet";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Brochure } from "@/components/brochure";
import { cn } from "@/utils/libs/tailwind";
import Title from "@/components/ui/title";
import { cssInterop } from "nativewind";


cssInterop(VideoView, {
	className: "style",
});

export default function Page() {
	const { commission: commissionId } = useLocalSearchParams();

	const { data: commission } = useQuery({
		queryKey: ["commission", commissionId],
		queryFn: getCommissionQuery,
		enabled: !!commissionId,
	});

	if (!commission) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<Title
				title={`Commission du ${new Date(commission.date).toLocaleDateString("fr-FR", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}`}
			/>
		</BackgroundLayout>
	);
}
