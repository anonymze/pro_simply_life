import { Button, StyleSheet } from "react-native";
import { useVideoPlayer } from "expo-video";
import { VideoView } from "expo-video";
import { View } from "react-native";
import { useEvent } from "expo";
import React from "react";

const videoSource = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function VideoScreen({ width, height, controls }: { width: number; height: number; controls: boolean }) {
	const player = useVideoPlayer(videoSource, (player) => {
		player.loop = false;
	});

	React.useEffect(() => {
		if (controls) {
			player.play();
		} else {
			player.pause();
		}
	}, [controls]);

	const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

	return (
		<View className="flex-1 items-center justify-center">
			<VideoView
				contentFit="cover"
				player={player}
				style={{
					width: width,
					height: height,
					borderRadius: 6,
				}}
				allowsFullscreen={false}
				allowsPictureInPicture={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 50,
	},
	video: {
		width: 140,
		height: 180,
	},
	controlsContainer: {
		padding: 10,
	},
});
