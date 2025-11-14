import { createAnimatedPressable, CustomPressableProps, PressableOpacity, PressableScale } from "pressto";
import { withUniwind } from "uniwind";

// Extend CustomPressableProps to include className
type CustomPressablePropsWithClassName = CustomPressableProps & { className?: string };

const PressableScaleOpacity = createAnimatedPressable((progress) => {
	"worklet";
	return {
		transform: [
			{ rotate: `${progress * 0.3}deg` },
			{
				translateX: progress * 2,
			},
			{
				scale: 1 - progress * 0.02,
			},
		],
		opacity: 1 - progress * 0.4,
	};
});


const StyledPressableScaleOpacity = withUniwind(PressableScaleOpacity);
const StyledPressableOpacity = withUniwind(PressableOpacity);
const StyledPressableScale = withUniwind(PressableScale);

const MyTouchableScaleOpacity = ({ children, ...props }: CustomPressablePropsWithClassName) => {
	return <StyledPressableScaleOpacity {...props}>{children}</StyledPressableScaleOpacity>;
};

const MyTouchableOpacity = ({ children, ...props }: CustomPressablePropsWithClassName) => {
	return <StyledPressableOpacity {...props}>{children}</StyledPressableOpacity>;
};

const MyTouchableScale = ({ children, ...props }: CustomPressablePropsWithClassName) => {
	return <StyledPressableScale {...props}>{children}</StyledPressableScale>;
};


export { MyTouchableOpacity, MyTouchableScale, MyTouchableScaleOpacity };
