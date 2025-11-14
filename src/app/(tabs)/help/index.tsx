import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/cn";
import { useFocusEffect } from "@react-navigation/native";
import { useEvent } from "expo";
// import * as ScreenOrientation from "expo-screen-orientation";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const videoSource = require("@/assets/videos/guide.mp4");

export default function Page() {
    const insets = useSafeAreaInsets();
	const [isLoading, setIsLoading] = useState(true);

	const player = useVideoPlayer(videoSource, (player) => {
		player.loop = false;
		player.play();
	});

	// const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

	// Hide loader when video metadata has loaded
	const { status } = useEvent(player, "statusChange", { status: player.status });

	// Update loading state based on player status
	if (status === "readyToPlay" && isLoading) {
		setIsLoading(false);
	}

	useFocusEffect(
		useCallback(() => {
			return () => {
				// When screen loses focus, pause the video
				player.pause();
			};
		}, [player]),
	);

	// const handleFullscreenEnter = async () => {
	// 	await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
	// };

	// const handleFullscreenExit = async () => {
	// 	await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
	// };

	return (
		<BackgroundLayout className={cn("flex-1 justify-center px-4 pb-4")} style={{ paddingTop: insets.top }}>
			<View className="aspect-video items-center justify-center overflow-hidden rounded-xl">
				{isLoading && (
					<View className="absolute inset-0 z-10 items-center justify-center bg-black/50">
						<ActivityIndicator size="large" color="#fff" />
					</View>
				)}
				<VideoView
					player={player}
					style={{
						width: "100%",
						height: "100%",
					}}
					allowsFullscreen
					nativeControls
					// onFullscreenEnter={handleFullscreenEnter}
					// onFullscreenExit={handleFullscreenExit}
				/>
			</View>
		</BackgroundLayout>
	);
}
