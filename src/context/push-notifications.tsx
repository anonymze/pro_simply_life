import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { registerForPushNotificationsAsync } from "@/utils/register-push-notifications";
import { EventSubscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";


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
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [notification, setNotification] = useState<Notifications.Notification | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const notificationListener = useRef<EventSubscription>(null);
	const responseListener = useRef<EventSubscription>(null);

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => setExpoPushToken(token))
			.catch((error) => setError(error));

			// when notification is received, works when app is background and active
		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			console.log("🔔 Notification Received: ", notification);
			setNotification(notification);
		});

		// when notification is clicked, can redirect inside etc...
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(
				"🔔 Notification Response: user interacted with notification",
				JSON.stringify(response, null, 2),
				JSON.stringify(response.notification.request.content.data, null, 2),
			);
		});

		return () => {
			if (notificationListener.current) {
				notificationListener.current.remove();
			}
			if (responseListener.current) {
				responseListener.current.remove();
			}
		};
	}, []);

	return (
		<NotificationContext.Provider value={{ expoPushToken, notification, error }}>
			{children}
		</NotificationContext.Provider>
	);
};
