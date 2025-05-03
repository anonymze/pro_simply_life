import { getLanguageCodeLocale } from "@/i18n/translations";
import { i18n } from "@/i18n/translations";
import { router } from "expo-router";
import { Alert } from "react-native";

import { clearAllNativeCookies } from "./cookies";
import { removeStorageUserInfos } from "./store";


/**
 * @description logout the user
 */
export const logout = ({ alert = false }: { alert?: boolean } = {}) => {
	removeStorageUserInfos();
	clearAllNativeCookies();
	if (alert) {
		const languageCode = getLanguageCodeLocale();
		Alert.alert(i18n[languageCode]("SESSION_EXPIRED"), i18n[languageCode]("SESSION_EXPIRED_MESSAGE"));
	}
	router.replace("/login");
};
