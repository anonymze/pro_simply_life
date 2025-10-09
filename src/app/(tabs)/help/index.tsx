import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/cn";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const [isLoading, setIsLoading] = React.useState(true);

	const videoSource: VideoSource = {
		uri : "https://simply-life-admin.fr/api/media/file/guide.mp4",
		metadata: {
			title: "Simply Life présentation",
			artist: "Groupe Valorem",
		},
	};

	const player1 = useVideoPlayer(videoSource, (player) => {
		player.addListener('statusChange', (status) => {
			setIsLoading(status.status === 'loading');
		});
	});

	useFocusEffect(
		React.useCallback(() => {
			return () => {
				player1.pause();
			};
		}, [player1]),
	);

	return (
		<BackgroundLayout className={cn("pt-safe flex-1 justify-center px-4 pb-4")}>
			{/*<Title title="Présentation de Simply Life"></Title>*/}
			<View className="aspect-video items-center justify-center overflow-hidden rounded-xl">
				{isLoading && (
					<View className="absolute inset-0 z-10 items-center justify-center bg-black/20">
						<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
					</View>
				)}
				<VideoView player={player1} className="h-full w-full" allowsFullscreen nativeControls />
			</View>
		</BackgroundLayout>
	);
}
