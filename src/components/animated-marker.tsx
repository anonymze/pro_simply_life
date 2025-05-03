import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import { View, StyleSheet, Text, Pressable } from "react-native";
// import { Marker, Callout } from "expo-maps";
// import * as WebBrowser from 'expo-web-browser';
import config from "tailwind.config";
import { Image } from "expo-image";
import { useEffect } from "react";

interface AnimatedMarkerProps {
	latitude: number;
	longitude: number;
	title: string;
	description?: string;
	delay?: number;
	image?: any;
	customCallout?: boolean;
}

export default function AnimatedMapMarker({
	latitude,
	longitude,
	title,
	image,
	description = "",
	delay = 0,
	customCallout = false,
}: AnimatedMarkerProps) {
	const scale = useSharedValue(0.01);

	useEffect(() => {
		// use requestAnimationFrame to ensure the component is mounted
		// before starting the animation
		const animationFrame = requestAnimationFrame(() => {
			scale.value = withDelay(delay, withSpring(1, { damping: 11, stiffness: 100 }));
		});

		return () => cancelAnimationFrame(animationFrame);
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	return (
		<></>
		// <Marker
		// 	coordinate={{
		// 		latitude,
		// 		longitude,
		// 	}}
		// 	title={customCallout ? undefined : title}
		// 	description={customCallout ? undefined : description}
		// 	tracksViewChanges={false} // improve performance by disabling view tracking
		// >
		// 	<Animated.View
		// 		entering={FadeIn.delay(delay)}
		// 		style={animatedStyle}
		// 		className="h-10 w-10 rounded-full border-2 border-white"
		// 	>
		// 		{image ? (
		// 			<Image
		// 				placeholder={require("@/assets/images/icon.png")}
		// 				placeholderContentFit="contain"
		// 				source={process.env.EXPO_PUBLIC_API_URL + image.url}
		// 				style={styles.marker}
		// 				contentFit="cover"
		// 			/>
		// 		) : (
		// 			<View className="h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary">
		// 				<View className="h-4 w-4 rounded-full bg-white" />
		// 			</View>
		// 		)}
		// 	</Animated.View>

		// 	{customCallout && (
		// 		<Callout
		// 			onPress={async () => {
		// 				// await WebBrowser.openBrowserAsync(description);
		// 			}}
		// 		>
		// 			<View style={styles.calloutContainer}>
		// 				<Text style={styles.calloutTitle}>{title}</Text>
		// 				{description ? <Text style={styles.calloutLink}>Visiter le site internet</Text> : null}
		// 			</View>
		// 		</Callout>
		// 	)}
		// </Marker>
	);
}

const styles = StyleSheet.create({
	marker: {
		width: "100%",
		height: "100%",
		borderRadius: 99,
	},
	calloutContainer: {
		width: 180,
		padding: 0,
	},
	calloutTitle: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 5,
	},
	calloutLink: {
		zIndex: 1000,
		fontSize: 14,
		color: config.theme.extend.colors.primary,
		textDecorationLine: "underline",
		textAlign: "center",
	},
});
