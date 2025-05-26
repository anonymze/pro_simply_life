import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming, } from "react-native-reanimated";
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Eraser, Eye, LucideProps, PenLine, RotateCcw, Undo } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import config from "tailwind.config";

import DrawPad, { DrawPadHandle } from "./drawpad";
import MaskedText from "./masket-text";


const ICON_PROPS: LucideProps = {
	size: 21,
	strokeWidth: 1.8,
};
const BTN_HEIGHT = 38;
const isWeb = Platform.OS === "web";

export default function Board() {
	const padRef = useRef<DrawPadHandle>(null);
	const pathLength = useSharedValue<number>(0);
	const playing = useSharedValue<boolean>(false);
	const signed = useSharedValue<boolean>(false);

	const handleErase = () => {
		if (padRef.current) {
			padRef.current.erase();
		}
	};
	const handleUndo = () => {
		if (padRef.current) {
			padRef.current.undo();
		}
	};
	const handleReset = () => {
		if (padRef.current) {
			padRef.current.erase();
		}
	};
	const handlePreview = () => {
		if (padRef.current) {
			padRef.current.play();
		}
	};

	const handleStop = () => {
		if (padRef.current) {
			padRef.current.stop();
		}
	};

	const handleSign = () => {
		if (padRef.current) {
			handleStop();
			setTimeout(() => {
				playing.value = true;
			}, 0);
			padRef.current.play();
		}
	};

	return (
		<View className="h-[300] overflow-hidden rounded-xl  border border-defaultGray">
			<HeaderBar onReset={handleReset} onPreview={handlePreview} pathLength={pathLength} />
			<DrawPad ref={padRef} stroke={"green"} pathLength={pathLength} playing={playing} />
			<ActionBar
				onErase={handleErase}
				onUndo={handleUndo}
				onStop={handleStop}
				onPlay={handleSign}
				pathLength={pathLength}
				signed={signed}
			/>
		</View>
	);
}

const ActionBar = ({
	onErase,
	onUndo,
	onStop,
	onPlay,
	pathLength,
	signed,
}: {
	onErase: () => void;
	onUndo: () => void;
	onStop: () => void;
	onPlay: () => void;
	pathLength: SharedValue<number>;
	signed: SharedValue<boolean>;
}) => {
	const buttonWidth = 140;
	const pressing = useSharedValue(false);
	const [inputType, setInputType] = useState<"touch" | "mouse" | "pen" | null>(null);

	useAnimatedReaction(
		() => pressing.value,
		(isPressing) => {
			if (isPressing) {
				runOnJS(onPlay)();
			} else {
				runOnJS(onStop)();
			}
		},
	);

	useEffect(() => {
		if (!isWeb) return;
		const handlePointer = (e: PointerEvent) => setInputType(e.pointerType as any);
		window.addEventListener("pointerdown", handlePointer);
		return () => window.removeEventListener("pointerdown", handlePointer);
	}, []);

	const progress = useDerivedValue(() => {
		const shouldAnimate = (signed.value || pressing.value) && pathLength.value > 0;
		const duration = pressing.value ? pathLength.value  : 500;

		return withTiming(shouldAnimate ? 1 : 0, { duration });
	});

	useAnimatedReaction(
		() => progress.value,
		(currentProgress) => {
			if (currentProgress === 1) {
				signed.value = pathLength.value > 0 && pressing.value;
			} else {
				signed.value = false;
			}
		},
	);

	const slideAnimatedStyle = useAnimatedStyle(() => ({
		width: signed.value || (isWeb && signed.value) ? buttonWidth : isWeb ? 0 : buttonWidth * progress.value,
	}));

	const signedAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withTiming(signed.value ? BTN_HEIGHT : 0),
				},
			],
		};
	});

	const startPressing = () => {
		pressing.value = !signed.value && pathLength.value > 0;
	};

	const stopPressing = () => {
		pressing.value = false;
	};

	return (
		<View className="h-14 flex-row items-center justify-between px-4">
			<Animated.View
				style={[
					{
						flexDirection: "row",
						gap: 16,
					},
					signedAnimatedStyle,
				]}
			>
				<TouchableOpacity onPress={onUndo} hitSlop={10}>
					<Undo color={config.theme.extend.colors.secondaryDark} size={20} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onErase} hitSlop={10}>
					<Eraser color={config.theme.extend.colors.secondaryDark} size={20} />
				</TouchableOpacity>
			</Animated.View>
			<View>
				<Pressable
					style={[styles.confirmBtnBlock, styles.confirmBtn, { width: buttonWidth }]}
					{...(isWeb && inputType !== "mouse"
						? {
								onTouchStart: startPressing,
								onTouchEnd: stopPressing,
								onTouchCancel: stopPressing,
							}
						: {
								onPressIn: startPressing,
								onPressOut: stopPressing,
							})}
				>
					<Animated.View
						style={[
							{
								backgroundColor: config.theme.extend.colors.primary,
								...StyleSheet.absoluteFillObject,
							},
							slideAnimatedStyle,
						]}
					/>
					<Animated.View style={[signedAnimatedStyle]}>
						<View style={styles.confirmBtnBlock}>
							<Text className="text-white">Signed</Text>
						</View>
						<View style={styles.confirmBtnBlock}>
							<MaskedText
								color={"#fff"}
								baseColor={"#000"}
								text="Hold to confirm"
								animatedStyle={slideAnimatedStyle}
								pathLength={pathLength}
								pressing={pressing}
							/>
						</View>
					</Animated.View>
				</Pressable>
			</View>
		</View>
	);
};

const HeaderBar = ({
	onReset,
	onPreview,
	pathLength,
}: {
	onPreview?: () => void;
	onReset?: () => void;
	pathLength: SharedValue<number>;
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withSpring(!!pathLength.value ? 0 : -50, {
						damping: 23,
						stiffness: 225,
					}),
				},
			],
			opacity: withTiming(!!pathLength.value ? 1 : 0, {
				duration: 500,
			}),
		};
	});

	return (
		<View className="h-12 flex-row items-center gap-4 px-4">
			<Pressable>
				<PenLine color={config.theme.extend.colors.primary} size={20} />
			</Pressable>
			<Text>Dessiner la signature</Text>
			<Animated.View
				style={[
					{
						flex: 1,
						flexDirection: "row",
						gap: 20,
						alignItems: "center",
						justifyContent: "flex-end",
					},
					animatedStyle,
				]}
			>
				<TouchableOpacity onPress={onPreview} hitSlop={10}>
					<Eye color={config.theme.extend.colors.secondaryDark} size={22} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onReset} hitSlop={10}>
					<RotateCcw color={config.theme.extend.colors.secondaryDark} size={19} />
				</TouchableOpacity>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	confirmBtn: {
		borderRadius: 6,
		overflow: "hidden",
		justifyContent: "flex-end",
		alignItems: "stretch",
	},
	confirmBtnBlock: {
		height: BTN_HEIGHT,
		alignItems: "center",
		justifyContent: "center",
	},
});
