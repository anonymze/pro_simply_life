import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/cn";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import React from "react";
import { View } from "react-native";

export default function Page() {
	const assetId = require("@/assets/videos/guide.mov");

	const videoSource: VideoSource = {
		assetId,
		metadata: {
			title: "Simply Life présentation",
			artist: "Groupe Valorem",
		},
	};

	const player1 = useVideoPlayer(videoSource);

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
				<VideoView player={player1} className="h-full w-full" allowsFullscreen nativeControls />
			</View>
		</BackgroundLayout>
	);
}
