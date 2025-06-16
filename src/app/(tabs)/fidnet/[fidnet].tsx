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


const width = Dimensions.get("window").width;

cssInterop(VideoView, {
	className: "style",
});

export default function Page() {
	const { fidnet: fidnetId } = useLocalSearchParams();

	const { data: fidnet } = useQuery({
		queryKey: ["fidnet", fidnetId],
		queryFn: getFidnetQuery,
		enabled: !!fidnetId,
	});

	if (!fidnet) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<Title
				title={`Newsletter du ${new Date(fidnet.date).toLocaleDateString("fr-FR", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}`}
			/>

			<Brochure
				title="Newsletter PDF"
				brochure={fidnet.file}
				updatedAt={fidnet.updatedAt}
				link={{
					pathname: "/fidnet/pdf/[pdf]",
					params: {
						pdf: fidnet.file.filename,
					},
				}}
			/>
		</BackgroundLayout>
	);
}
