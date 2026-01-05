import { queryClient } from "@/api/_queries";
import { updateAppUserToken } from "@/api/queries/app-user-queries";
import { registerForPushNotificationsAsync } from "@/utils/register-push-notifications";
import { getStorageUserInfos } from "@/utils/store";
import { EventSubscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

type NotificationData =
	| { type: "message"; data: { chatRoomId: string; [key: string]: any } }
	| { type: "private"; data: { privateEquityId: string; [key: string]: any } }
	| {
			type: "supplier";
			data: {
				supplierId: string;
				supplierProductId: string;
				supplierCategoryId: string;
				[key: string]: any;
			};
	  }
	| { type: "selection"; data: { selectionId: string; [key: string]: any } }
	| { type: "fundesys"; data: { fundesysId: string; [key: string]: any } }
	| { type: "fidnet"; data: { fidnetId: string; [key: string]: any } }
	| { type: "agency"; data: { agencyLifeId: string; [key: string]: any } }
	| { type: "profil"; data: { userId: string; [key: string]: any } };

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
				if (token?.startsWith("ExponentPushToken[")) {
					updateAppUserToken(userInfos?.user?.id, token);
				}
			})
			.catch((error) => setError(error));

		// Check if app was opened from a notification (when app was completely closed)
		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (response) {
				const notifData = response.notification.request.content.data as NotificationData;
				switch (notifData.type) {
					case "message":
						router.push(`/chat/${notifData.data.chatRoomId}`);
						break;
					case "private":
						// router.push(`/private-equity/${notifData.data.privateEquityId}`);
						break;
					case "supplier":
						if (notifData.data.supplierProductId && notifData.data.supplierCategoryId && notifData.data.supplierId) {
							router.push({
								pathname:
									"/(tabs)/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]",
								params: {
									"supplier-category": notifData.data.supplierCategoryId,
									"supplier-product": notifData.data.supplierProductId,
									supplier: notifData.data.supplierId,
								},
							});
						}
						break;
					case "selection":
						router.push(`/selection/${notifData.data.selectionId}`);
						break;
					case "fundesys":
						router.push(`/fundesys/${notifData.data.fundesysId}`);
						break;
					case "fidnet":
						router.push(`/fidnet/${notifData.data.fidnetId}`);
						break;
					case "agency":
						router.push(`/event/${notifData.data.agencyLifeId}`);
						break;
					case "profil":
						router.push(`/profil`);
						break;
				}
			}
		});

		// Listen for token changes/updates
		tokenListener.current = Notifications.addPushTokenListener((token) => {
			setExpoPushToken(token.data);
			// Only update DB if it's a valid Expo token
			if (token.data?.startsWith("ExponentPushToken[")) {
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
			const notifData = response.notification.request.content.data as NotificationData;
			switch (notifData.type) {
				case "message":
					router.replace(`/chat/${notifData.data.chatRoomId}`);
					break;
				case "private":
					// router.replace(`/private-equity/${notifData.data.privateEquityId}`);
					break;
				case "supplier":
					if (notifData.data.supplierProductId && notifData.data.supplierCategoryId && notifData.data.supplierId) {
						router.replace({
							pathname:
								"/supplier-category",
						});
						router.push({
							pathname:
								"/(tabs)/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]",
							params: {
								"supplier-category": notifData.data.supplierCategoryId,
								"supplier-product": notifData.data.supplierProductId,
								supplier: notifData.data.supplierId,
							},
						});
					}
					break;
				case "selection":
					router.replace(`/selection/${notifData.data.selectionId}`);
					break;
				case "fundesys":
					router.replace(`/fundesys/${notifData.data.fundesysId}`);
					break;
				case "fidnet":
					router.replace(`/fidnet/${notifData.data.fidnetId}`);
					break;
				case "agency":
					router.replace(`/event/${notifData.data.agencyLifeId}`);
					break;
				case "profil":
					queryClient.invalidateQueries({
						queryKey: ["app-user-profil"],
					});
					router.replace(`/profil`);
					break;
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
