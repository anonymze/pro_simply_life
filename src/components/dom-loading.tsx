import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import type { DOMProps } from "expo/dom";
import { sleep } from "@/utils/helper";
import config from "tailwind.config";
import React from "react";

interface Props {
	loaderComponent: React.ReactNode;
	DomComponent: React.ComponentType<{
		dom: DOMProps;
	}>;
	minimumDurationLoader?: number;
}

export function DOMLoading({ loaderComponent, DomComponent, minimumDurationLoader = 800 }: Props) {
	const [loading, setLoading] = React.useState(false);
	const durationRef = React.useRef(0);

	return (
		<View className="flex-1">
			{loading && loaderComponent}
			<DomComponent
				dom={{
					scrollEnabled: true,
					onLayout: () => {
						durationRef.current = Date.now();
						setLoading(true);
					},
					onLoadEnd: async () => {
						const time = Date.now() - durationRef.current;
						if (time < minimumDurationLoader) await sleep(minimumDurationLoader - time);
						setLoading(false);
					},
				}}
			/>
		</View>
	);
}

export function DOMLoaderComponent({ text }: { text: string }) {
	return (
		<Animated.View
			exiting={FadeOut.duration(600)}
			className="absolute inset-0 z-50 flex items-center justify-center bg-background"
		>
			<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
			<Text className="mt-4 font-medium text-black">{text}</Text>
		</Animated.View>
	);
}
