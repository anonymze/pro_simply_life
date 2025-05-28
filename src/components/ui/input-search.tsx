import Animated, { FadeIn, FadeOut, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Dimensions, Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { CircleXIcon, SearchIcon } from "lucide-react-native";
import config from "tailwind.config";
import { cn } from "@/utils/cn";
import React from "react";


const widthTextInput = Dimensions.get("window").width - 28;
const widthTextInputAnimated = widthTextInput - 56;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

interface InputSearchProps extends TextInputProps {
	onClear?: () => void;
	clearable?: boolean;
}

export type InputSearchRef = {
	clear: () => void;
};

const InputSearch = React.forwardRef<InputSearchRef, InputSearchProps>(({ onClear, clearable = true, ...props }, ref) => {
	const inputRef = React.useRef<TextInput>(null);
	const [value, setValue] = React.useState("");

	const inputAnimatedStyle = useAnimatedStyle(() => {
		if (!clearable) return { width: "100%" };
		return {
			width: withSpring(value.length > 0 ? widthTextInputAnimated : widthTextInput, {
				damping: 23,
				stiffness: 225,
			}),
		};
	});

	const handleClear = () => {
		inputRef.current?.clear();
		setValue("");
		onClear?.();
	};

	React.useImperativeHandle(ref, () => ({
		clear: handleClear,
	}));

	return (
		<View className="flex-row items-center">
			<AnimatedView style={inputAnimatedStyle}>
				<TextInput
					ref={inputRef}
					returnKeyType="search"
					autoCapitalize="none"
					keyboardType="default"
					textContentType="oneTimeCode"
					autoCorrect={false}
					placeholder={props.placeholder ?? "Rechercher..."}
					onChangeText={(text) => {
						setValue(text);
						props.onChangeText?.(text);
					}}
					className={cn(
						"flex-grow rounded-xl bg-darkGray py-5 pl-12 text-primary placeholder:text-primaryLight",
						!clearable && "py-4",
						props.className,
					)}
					{...props}
				/>
				<SearchIcon
					style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: "-50%" }] }}
					size={18}
					color={config.theme.extend.colors.primary}
				/>
				{value.length > 0 && (
					<AnimatedPressable
						entering={FadeIn.duration(150)}
						exiting={FadeOut.duration(150)}
						className="absolute right-2 h-full w-10 items-center justify-center rounded-full"
						onPress={handleClear}
					>
						<CircleXIcon size={18} color={config.theme.extend.colors.defaultGray} />
					</AnimatedPressable>
				)}
			</AnimatedView>
			{clearable && value.length > 0 && (
				<AnimatedPressable
					entering={FadeIn.duration(150)}
					exiting={FadeOut.duration(150)}
					className="ml-2"
					onPress={handleClear}
				>
					<Text className="text-sm text-primary">Annuler</Text>
				</AnimatedPressable>
			)}
		</View>
	);
});

InputSearch.displayName = "InputSearch";

export default InputSearch;