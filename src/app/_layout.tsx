import "react-native-reanimated";
import "@/styles/app.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Stack } from "expo-router";


export default function RootLayout() {
	return (
		<>
			<StatusBar style="light" translucent />
			<SafeAreaProvider>
				<SafeAreaView className="flex-1 bg-primaryLight" edges={["right", "left", "top"]}>
					<Stack
						initialRouteName="(app)/index"
						screenOptions={{
							headerShown: false,
							animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
							gestureEnabled: false,
							fullScreenGestureEnabled: false,
						}}
					>
						<Stack.Screen name="login" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</>
	);
}
