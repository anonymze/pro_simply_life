import Animated, { useSharedValue, withDelay, withRepeat, withTiming, useAnimatedStyle, interpolate, } from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
import { Service } from "@/routes/services";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import { Image } from "expo-image";


const Ring = ({ delay }: { delay: number }) => {
	const ring = useSharedValue(0);
	useEffect(() => {
		ring.value = withDelay(
			delay,
			withRepeat(
				withTiming(1, {
					duration: 3000,
				}),
				-1,
				false,
			),
		);
	}, []);

	const ringStyle = useAnimatedStyle(() => {
		return {
			opacity: 1 - ring.value,
			transform: [
				{
					scale: (ring.value + 0.1) * 1.3,
				},
			],
		};
	});
	return <Animated.View style={[styles.ring, ringStyle]} />;
};

export default function CardLink({ service, pastille }: { service: Service; pastille?: boolean }) {
	return (
		<Link href={service.link ?? "/"} push asChild>
			<Pressable className="relative h-36 grow basis-1/3 items-center justify-center gap-3 rounded-xl bg-white p-4 active:opacity-70">
				{pastille && <Ring delay={0} />}

				<Image source={service.icon} style={{ width: 24, height: 24 }} />
				<Text className="text-center text-sm font-semibold">{service.name}</Text>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	ring: {
		position: "absolute",
		top: 5,
		right: 5,
		width: 20,
		height: 20,
		borderRadius: 99,
		borderColor: "#73cf59",
		borderWidth: 3,
	},
});
