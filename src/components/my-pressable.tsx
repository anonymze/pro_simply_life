import { cssInterop } from "nativewind";
import { createAnimatedPressable, CustomPressableProps, PressableOpacity, PressableScale } from "pressto";

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

const MyTouchableScaleOpacity = ({ children, ...props }: CustomPressablePropsWithClassName) => {
	return <PressableScaleOpacity {...props}>{children}</PressableScaleOpacity>;
};

const MyTouchableOpacity = ({ children, ...props }: CustomPressablePropsWithClassName) => {
	return <PressableOpacity {...props}>{children}</PressableOpacity>;
};

const MyTouchableScale = ({ children, ...props }: CustomPressablePropsWithClassName) => {
	return <PressableScale {...props}>{children}</PressableScale>;
};

cssInterop(PressableScaleOpacity, { className: "style" });
cssInterop(PressableOpacity, { className: "style" });
cssInterop(PressableScale, { className: "style" });

export { MyTouchableOpacity, MyTouchableScale, MyTouchableScaleOpacity };
