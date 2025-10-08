import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import config from "tailwind.config";


export async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: config.theme.extend.colors.primary,
		});
	}

	if (!Device.isDevice) throw new Error("Must use physical device for push notifications");

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		// Alert.alert("Permission notification refusée", "Vous ne serez pas notifiés sur différentes fonctionnalités de l'application.");
	}

	const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

	if (!projectId) throw new Error("Project ID not found");

	try {
		const pushTokenString = (
			await Notifications.getExpoPushTokenAsync({
				projectId,
			})
		).data;
		console.log("✅ Expo Push Token:", pushTokenString);
		return pushTokenString;
	} catch (e: unknown) {
		console.error("❌ Failed to get Expo push token:", e);
		throw new Error(`Failed to get Expo push token: ${e}`);
	}
}
