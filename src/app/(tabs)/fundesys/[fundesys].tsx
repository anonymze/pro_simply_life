import { View, Text, Platform, Dimensions } from "react-native";
import BackgroundLayout from "@/layouts/background-layout";
import { getFundesysQuery } from "@/api/queries/fundesys";
import { useVideoPlayer, VideoView } from "expo-video";
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
	const { fundesys: fundesysId } = useLocalSearchParams();

	const { data: fundesys } = useQuery({
		queryKey: ["fundesys", fundesysId],
		queryFn: getFundesysQuery,
		enabled: !!fundesysId,
	});

	if (!fundesys) return null;

	const player = useVideoPlayer(fundesys.video.url!, (player) => {
		// player.loop = true;
		// player.play();
	});

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-safe")}>
			<Title
				title={`Newsletter du ${new Date(fundesys.date).toLocaleDateString("fr-FR", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}`}
			/>

			<View className="rounded-2xl bg-white p-4">
				<Text className="text-sm text-primaryLight">Vidéo hebdo</Text>
				<View className="mx-auto mt-3 aspect-video overflow-hidden rounded-xl ">
					<VideoView player={player} className="h-full w-full" allowsFullscreen nativeControls={true} />
				</View>
			</View>

			<View className="mt-5">
				<Brochure
					title="Newsletter PDF"
					brochure={fundesys.file}
					updatedAt={fundesys.updatedAt}
					link={{
						pathname: "/fundesys/pdf/[pdf]",
						params: {
							pdf: fundesys.file.filename,
						},
					}}
				/>
			</View>
		</BackgroundLayout>
	);
}
