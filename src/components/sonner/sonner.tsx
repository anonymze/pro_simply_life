import { Portal } from "@rn-primitives/portal";
import * as ToastPrimitive from "@rn-primitives/toast";
import React from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	SharedValue,
	SlideInUp,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { SonnerRN } from "./types/sonner";

const DEFAULT_SECONDS = 300;
const DEFAULT_ANIMATION = {
	damping: 130,
	stiffness: 1500,
	duration: 0,
	mass: 4,
};
const DETECTION_TOP = -40;
const DETECTION_BOTTOM = 100;

export default function Sonner({
	toastId,
	title,
	dispatchToast,
	...options
}: SonnerRN.ToastArgs & {
	toastId: SonnerRN.ToastId;
	dispatchToast: React.ActionDispatch<[action: SonnerRN.ToastDispatch]>;
}) {
	const [duration, setDuration] = React.useState(options.duration ?? DEFAULT_SECONDS);
	const sonnerUniqueId = React.useId();
	const insets = useSafeAreaInsets();
	const { shared, styles } = useAnimation();

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			dispatchToast({ type: "CLEAR" });
		}, duration * 1000);

		return () => clearTimeout(timeout);
	}, [dispatchToast, toastId]);

	return (
		<Portal name={sonnerUniqueId}>
			<GestureDetector
				gesture={gestureAnimation({
					sharedScale: shared.scale,
					sharedTranslate: shared.translate,
					sharedOpacity: shared.opacity,
					dispatchToast,
				})}
			>
				<Animated.View
					entering={SlideInUp.springify()
						.damping(options.damping ?? DEFAULT_ANIMATION.damping)
						.stiffness(options.stiffness ?? DEFAULT_ANIMATION.stiffness)
						.mass(options.mass ?? DEFAULT_ANIMATION.mass)
						.duration(options.duration ?? DEFAULT_ANIMATION.duration)}
					style={[
						{
							top: insets.top + 4,
						},
						styles,
					]}
					className="absolute w-full px-4"
				>
					<ToastPrimitive.Root
						type={options.type}
						open={true}
						onOpenChange={(bool) => {
							// if (bool) return;
							dispatchToast({
								type: "CLEAR",
							});
						}}
						className="flex-row items-center justify-between gap-x-2 rounded-xl bg-gray-200 p-4"
					>
						<View className="flex-1 gap-y-1">
							<ToastPrimitive.Title className="text-foreground text-3xl">{title}</ToastPrimitive.Title>
							{options.description && (
								<ToastPrimitive.Description className="text-lg text-dark" numberOfLines={2}>
									{options.description}
								</ToastPrimitive.Description>
							)}
						</View>
						{options.action && (
							<View className="gap-y-2">
								<ToastPrimitive.Action className="border border-primary px-4 py-2">
									<Text className="text-dark">Action</Text>
								</ToastPrimitive.Action>
							</View>
						)}
					</ToastPrimitive.Root>
				</Animated.View>
			</GestureDetector>
		</Portal>
	);
}

const useAnimation = () => {
	const sharedTranslate = useSharedValue(0);
	const sharedOpacity = useSharedValue(1);
	const sharedScale = useSharedValue(1);

	const animatedstyles = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: sharedTranslate.value }, { scale: sharedScale.value }],
			opacity: sharedOpacity.value,
		};
	});

	return {
		shared: {
			scale: sharedScale,
			opacity: sharedOpacity,
			translate: sharedTranslate,
		},
		styles: animatedstyles,
	};
};

const gestureAnimation = ({
	sharedTranslate,
	sharedScale,
	sharedOpacity,
	dispatchToast,
}: {
	sharedTranslate: SharedValue<number>;
	sharedOpacity: SharedValue<number>;
	sharedScale: SharedValue<number>;
	dispatchToast: React.ActionDispatch<[action: SonnerRN.ToastDispatch]>;
}) => {
	return Gesture.Pan()
		.onUpdate((e) => {
			sharedTranslate.value = e.translationY;
			sharedOpacity.value = Math.max(1 - Math.abs(e.translationY) / 400, 0.6);
		})
		.onFinalize((e) => {
			if (e.translationY <= DETECTION_TOP) return;
			if (e.translationY >= DETECTION_BOTTOM) return;

			sharedScale.value = withSpring(1, {
				damping: 70,
				stiffness: 1200,
			});

			sharedTranslate.value = withSpring(0, {
				damping: DEFAULT_ANIMATION.damping,
				stiffness: DEFAULT_ANIMATION.stiffness,
			});
			sharedOpacity.value = withTiming(1);
		})
		.onEnd((e) => {
			if (e.translationY <= DETECTION_TOP) {
				sharedOpacity.value = withTiming(0);
				sharedScale.value = withTiming(0.95);
				sharedTranslate.value = withTiming(
					e.translationY - 200,
					{
						duration: 200,
					},
					(finished) => {
						"worklet";
						if (finished) scheduleOnRN(dispatchToast, { type: "CLEAR" });
					},
				);
			} else if (e.translationY >= DETECTION_BOTTOM) {
				sharedOpacity.value = withTiming(0);
				sharedTranslate.value = withTiming(-100);
				sharedScale.value = withTiming(0.95, undefined, (finished) => {
					"worklet";
					if (finished) scheduleOnRN(dispatchToast, { type: "CLEAR" });
				});
			}
		})
		.onTouchesDown(() => {
			sharedScale.value = withSpring(0.98, {
				duration: 100,
			});
		});
};
