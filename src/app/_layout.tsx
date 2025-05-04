import "react-native-reanimated";
import "@/styles/app.css";

import { onlineManager, QueryClientProvider, focusManager, useQueryClient } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { getChatRoomsQuery } from "@/api/queries/chat-room-queries";
import { Platform, AppState, AppStateStatus } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { queryClient } from "@/api/_queries";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";


Sentry.init({
	dsn: "https://b03eb0b4608556d0eed1d4cad51d1786@o4509069379043328.ingest.de.sentry.io/4509114349715536",
	// TODO
	enabled: false,
	// Configure Session Replay
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.mobileReplayIntegration()],

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
});

// here we set if we should show the alert of push notifications even if the app is running
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	fade: true,
	duration: 600,
});

// refetch on network change
onlineManager.setEventListener((setOnline) => {
	const eventSubscription = Network.addNetworkStateListener((state) => {
		setOnline(!!state.isConnected);
	});
	return eventSubscription.remove;
});

// refetch on app focus
function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

export default Sentry.wrap(function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Layout />
		</QueryClientProvider>
	);
});

const Layout = () => {
	const [loaded] = useFonts({
		// AtkinsonRegular: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Regular-102a.woff2"),
		// AtkinsonBold: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Bold-102a.woff2"),
		// AtkinsonItalic: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Italic-102a.woff2"),
	});

	React.useEffect(() => {
		if (loaded) SplashScreen.hideAsync();
	}, [loaded]);

	// refetch on app focus
	React.useEffect(() => {
		prefetchSomeData();
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);

	if (!loaded) return null;

	return (
		<GestureHandlerRootView>
			<BottomSheetModalProvider>
			<KeyboardProvider>
				<StatusBar style="light" translucent />
				<SafeAreaProvider>
					<SafeAreaView pointerEvents="box-none" className="flex-1 bg-primaryLight" edges={["right", "left", "top"]}>
						<Stack
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
			</KeyboardProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
};

const prefetchSomeData = async () => {
	queryClient.prefetchQuery({
		queryKey: ["chat-rooms"],
		queryFn: getChatRoomsQuery,
	});
};
