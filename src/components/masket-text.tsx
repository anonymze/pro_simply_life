import Animated, { SharedValue } from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { StyleSheet, Text, View } from "react-native";


export interface MaskedTextProps {
  color: string;
  baseColor: string;
  text: string;
  animatedStyle?: any;
  pressing?: SharedValue<boolean>;
  pathLength?: SharedValue<number>;
}

export default function MaskedText({ color, text, animatedStyle }: MaskedTextProps) {
	return (
		<>
			<Text>{text}</Text>
			<MaskedView
				style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
				maskElement={
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text>{text}</Text>
					</View>
				}
			>
				<Animated.View style={[{ flex: 1, height: "100%", backgroundColor: color }, animatedStyle]} />
			</MaskedView>
		</>
	);
}
