import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import React from "react";

import CardEvent from "./card/card-event";


const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 38;
const cardWidth = screenWidth - horizontalPadding;

export default function Carousel<T>({ data, children }: { data: T[]; children: (data: T[], cardWidth: number) => React.ReactNode }) {
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
					return cardWidth * idx - 4 * idx;
				})}
				contentContainerStyle={{ paddingRight: 42, gap: 16 }} // keep right padding for last card
				scrollEventThrottle={undefined}
				style={{ flexGrow: 0 }}
			>
				{children(data, cardWidth)}
			</ScrollView>
			<View className="mt-4 flex-row items-center gap-2">
				{data.map((_, idx) => (
					<Animated.View
						key={idx}
						style={useAnimatedStyle(() => ({
							backgroundColor: withSpring(currentIndex === idx ? "#000" : "rgba(0, 0, 0, 0.3)", {
								damping: 15,
								stiffness: 150,
							}),
						}))}
						className="size-[0.42rem] rounded-full"
					/>
				))}
			</View>
		</>
	);
}
