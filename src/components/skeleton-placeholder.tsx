import { createShimmerPlaceholder, ShimmerPlaceholderProps } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";


const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const SkeletonPlaceholder = ({
	width,
	height,
	style,
	shimmerColors,
}: {
	shimmerColors?: ShimmerPlaceholderProps["shimmerColors"];
	width: ShimmerPlaceholderProps["width"];
	height: ShimmerPlaceholderProps["height"];
	style?: ShimmerPlaceholderProps["style"];
}) => {
	return (
		<ShimmerPlaceholder
			style={style}
			shimmerColors={shimmerColors || ["#262626", "#303030", "#262626"]}
			duration={1600}
			isReversed
			height={height}
			width={width}
		/>
	);
};
