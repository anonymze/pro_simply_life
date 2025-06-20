import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import config from "tailwind.config";
import { cn } from "@/utils/cn";
import React from "react";


const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 38;
const cardWidth = screenWidth - horizontalPadding;
const gap = 16;

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
					return cardWidth * idx;
				})}
				contentContainerStyle={{ paddingRight: gap * 2, gap }} // keep right padding for last card
				scrollEventThrottle={undefined}
				style={{ flexGrow: 0 }}
			>
				{children(data, cardWidth - gap)}
			</ScrollView>
			<View className="mt-4 flex-row items-center gap-3 justify-center">
				{data.map((_, idx) => (
					<Animated.View
						key={idx}
						style={useAnimatedStyle(() => ({
							backgroundColor: withSpring(currentIndex === idx ? "#4E5BA6" : "#D5D9EB", {
								damping: 15,
								stiffness: 150,
							}),
						}))}
						className={cn("size-[0.42rem] rounded-full", currentIndex === idx && "size-[0.50rem]")}
					/>
				))}
			</View>
		</>
	);
}
