import { cn } from "@/utils/cn";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import React from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

const screenWidth = SCREEN_DIMENSIONS.width;
const horizontalPadding = 38;
const cardWidth = screenWidth - horizontalPadding;
const gap = 16;

export default function Carousel<T>({
	data,
	children,
}: {
	data: T[];
	children: (data: T[], cardWidth: number) => React.ReactNode;
}) {
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const handleScrollEnd = React.useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const offsetX = event.nativeEvent.contentOffset.x;
			const index = Math.round(offsetX / cardWidth);
			setCurrentIndex(~~index);
		},
		[cardWidth],
	);

	return (
		<>
			<ScrollView
				onScroll={handleScrollEnd}
				horizontal
				showsHorizontalScrollIndicator={false}
				className="-mr-4"
				decelerationRate={0.1}
				snapToOffsets={data.map((_, idx) => {
					if (idx === 0) return 0;
					return cardWidth * idx;
				})}
				contentContainerStyle={{ paddingRight: gap * 2, gap }} // keep right padding for last card
				scrollEventThrottle={undefined}
				style={{ flexGrow: 0 }}
			>
				{children(data, cardWidth - gap)}
			</ScrollView>
			<View className="mt-4 flex-row items-center justify-center gap-3">
				{data.map((_, idx) => (
					<Dot key={idx} isActive={currentIndex === idx} />
				))}
			</View>
		</>
	);
}

const Dot = React.memo(({ isActive }: { isActive: boolean }) => {
	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: withSpring(isActive ? "#4E5BA6" : "#D5D9EB", {
			damping: 15,
			stiffness: 150,
		}),
	}));

	return (
		<Animated.View style={animatedStyle} className={cn("size-[0.42rem] rounded-full", isActive && "size-[0.50rem]")} />
	);
});
