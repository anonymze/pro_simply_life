import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { cn } from "@/utils/cn";
import React from "react";

import CardEvent from "./card-event";


const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 38;
const cardWidth = screenWidth - horizontalPadding;

export default function Carousel({ data }: { data: any[] }) {
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
					return cardWidth * idx + 16 * idx;
				})}
				contentContainerStyle={{ paddingRight: 24, gap: 16 }} // keep right padding for last card
				scrollEventThrottle={undefined}
				style={{ flexGrow: 0 }}
			>
				{data.map((item) => (
					<CardEvent
						key={item}
						date="2025-05-05"
						title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
						type="Masterclass"
						description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus cupiditate eius aliquid. Labore molestiae iste	obcaecati sunt suscipit alias aliquam soluta, autem accusamus. Exercitationem, ipsa odit! Adipisci ipsam vero	officia!"
						width={cardWidth}
					/>
				))}
			</ScrollView>
			<View className="mt-4 flex-row items-center gap-2">
				{data.map((item, idx) => (
					<Animated.View 
						key={item} 
						style={useAnimatedStyle(() => ({
							backgroundColor: withSpring(
								currentIndex === idx ? '#000' : 'rgba(0, 0, 0, 0.3)',
								{ damping: 15, stiffness: 150 }
							),
						}))}
						className="size-1.5 rounded-full"
					/>
				))}
			</View>
		</>
	);
}
