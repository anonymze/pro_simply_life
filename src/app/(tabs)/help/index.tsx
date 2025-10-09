import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/cn";
import { useEvent } from "expo";
import * as ScreenOrientation from "expo-screen-orientation";
import { useVideoPlayer, VideoView } from "expo-video";
import { View } from "react-native";

const videoSource = require("@/assets/videos/guide.mp4");

export default function Page() {
	const player = useVideoPlayer(videoSource, (player) => {
		player.loop = true;
		player.play();
	});

	const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

	const handleFullscreenEnter = async () => {
		await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
	};

	const handleFullscreenExit = async () => {
		await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
	};

	return (
		<BackgroundLayout className={cn("pt-safe flex-1 justify-center px-4 pb-4")}>
			<View className="aspect-video items-center justify-center overflow-hidden rounded-xl">
				<VideoView
					player={player}
					style={{
						width: "100%",
						height: "100%",
					}}
					allowsFullscreen
					nativeControls
					onFullscreenEnter={handleFullscreenEnter}
					onFullscreenExit={handleFullscreenExit}
				/>
			</View>
		</BackgroundLayout>
	);
}
