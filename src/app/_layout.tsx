import "react-native-reanimated";
import "@/styles/app.css";

import { onlineManager, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "@/context/push-notifications";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { getChatRoomsQuery } from "@/api/queries/chat-room-queries";
import { Platform, AppState, AppStateStatus } from "react-native";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { PortalHost } from '@rn-primitives/portal';
import * as Sentry from "@sentry/react-native";
import { queryClient } from "@/api/_queries";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import * as Network from "expo-network";
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
		shouldPlaySound: false,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
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
	console.log("onAppStateChange", status);
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
	const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();
	const [ready, setReady] = React.useState(false);

	// refetch on app focus
	React.useEffect(() => {
		// Image.prefetch(require("@/assets/images/icon.png")).catch(() => {});
		const subscription = AppState.addEventListener("change", onAppStateChange);

		Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["app-users"],
				queryFn: getAppUsersQuery,
			}),
			queryClient.prefetchQuery({
				queryKey: ["supplier-categories"],
				queryFn: getSupplierCategoriesQuery,
			}),
		]).finally(() => {
			prefetchSomeData();
			setReady(true);
			SplashScreen.hideAsync();
		});

		return () => subscription.remove();
	}, []);

	// TODO
	React.useEffect(() => {
		if (isUpdatePending) {
			Updates.reloadAsync();
		}
	}, [isUpdatePending]);

	// TODO
	React.useEffect(() => {
		if (isUpdateAvailable) {
			Updates.fetchUpdateAsync();
		}
	}, [isUpdateAvailable]);

	if (!ready) null;

	return (
		<NotificationProvider>
			<GestureHandlerRootView>
				<BottomSheetModalProvider>
					<KeyboardProvider>
						<StatusBar style="dark" translucent />
						{/* already added by expo router on every route */}
						{/* <SafeAreaProvider> */}
						<Stack
							screenOptions={{
								headerShown: false,
								animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
								gestureEnabled: false,
								fullScreenGestureEnabled: false,
							}}
						>
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="login" />
						</Stack>
						<PortalHost />
						{/* </SafeAreaProvider> */}
					</KeyboardProvider>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</NotificationProvider>
	);
};

const prefetchSomeData = async () => {
	queryClient.prefetchQuery({
		queryKey: ["chat-rooms"],
		queryFn: getChatRoomsQuery,
	});
	// queryClient.prefetchQuery({
	// 	queryKey: ["supplier-categories"],
	// 	queryFn: getSupplierCategoriesQuery,
	// });
	// queryClient.prefetchQuery({
	// 	queryKey: ["app-users"],
	// 	queryFn: getAppUsersQuery,
	// });
};
