import { updateAppUserToken } from "@/api/queries/app-user-queries";
import { registerForPushNotificationsAsync } from "@/utils/register-push-notifications";
import { getStorageUserInfos } from "@/utils/store";
import { EventSubscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

interface NotificationContextType {
	expoPushToken: string | null;
	notification: Notifications.Notification | null;
	error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}
	return context;
};

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
	const userInfos = getStorageUserInfos();
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [notification, setNotification] = useState<Notifications.Notification | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const notificationListener = useRef<EventSubscription>(null);
	const responseListener = useRef<EventSubscription>(null);
	const tokenListener = useRef<EventSubscription>(null);

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => {
				setExpoPushToken(token);
				// Only update DB if it's a valid Expo token
				if (token?.startsWith('ExponentPushToken[')) {
					updateAppUserToken(userInfos?.user?.id, token);
				}
			})
			.catch((error) => setError(error));

		// Check if app was opened from a notification (when app was completely closed)
		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (!response) return;

			if ("chatRoomId" in response.notification.request.content.data) {
				router.replace(`/chat/${response.notification.request.content.data.chatRoomId}`);
			}
		});

		// Listen for token changes/updates
		tokenListener.current = Notifications.addPushTokenListener((token) => {
			setExpoPushToken(token.data);
			// Only update DB if it's a valid Expo token
			if (token.data?.startsWith('ExponentPushToken[')) {
				updateAppUserToken(userInfos?.user?.id, token.data);
			}
		});

		// when notification is received, works when app is background and active
		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			setNotification(notification);
		});

		// when notification is clicked, can redirect inside etc...
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			if (!response.notification) return;

			if ("chatRoomId" in response.notification.request.content.data) {
				router.replace(`/chat/${response.notification.request.content.data.chatRoomId}`);
			}
		});

		return () => {
			if (notificationListener.current) {
				notificationListener.current.remove();
			}
			if (responseListener.current) {
				responseListener.current.remove();
			}
			if (tokenListener.current) {
				tokenListener.current.remove();
			}
		};
	}, []);

	return (
		<NotificationContext.Provider value={{ expoPushToken, notification, error }}>
			{children}
		</NotificationContext.Provider>
	);
};
