import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/cn";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import React from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	const videoSource: VideoSource = "https://hygg6eprd9.ufs.sh/f/Qer9vZjDP19L6PdHXE1ko40UhbTnpIzZsguy7M8OdCFvY3VN";

	const player1 = useVideoPlayer(videoSource, (player) => {
		player.loop = false;
		player.muted = false;
		player.allowsExternalPlayback = true;
	});

	React.useEffect(() => {
		// Set a timeout to handle infinite loading
		const timeout = setTimeout(() => {
			if (isLoading) {
				console.log('Video loading timeout - setting ready state');
				setIsLoading(false);
			}
		}, 5000);

		const statusListener = player1.addListener('statusChange', (status) => {
			console.log('Video status:', status.status, 'error:', status.error);

			if (status.status === 'idle' || status.status === 'readyToPlay') {
				setIsLoading(false);
				clearTimeout(timeout);
			} else if (status.status === 'error') {
				setIsLoading(false);
				setError(status.error?.message || 'Erreur de chargement de la vidéo');
				clearTimeout(timeout);
			}
		});

		return () => {
			statusListener.remove();
			clearTimeout(timeout);
		};
	}, [player1]);

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
				{error && (
					<View className="absolute inset-0 z-10 items-center justify-center bg-black/80">
						<Text className="text-white">{error}</Text>
					</View>
				)}
				<VideoView player={player1} className="h-full w-full" allowsFullscreen nativeControls />
			</View>
		</BackgroundLayout>
	);
}
