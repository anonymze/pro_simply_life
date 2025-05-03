import CookieManager from '@react-native-cookies/cookies';


export const clearAllNativeCookies = async () => {
	try {
		await CookieManager.clearAll();
	} catch (error) {
		console.error("error clearing native cookies:", error);
	}
};

export const getAllNativeCookies = async () => {
	try {
		return  CookieManager.getAll();
	} catch (error) {
		console.error("error getting native cookies:", error);
	}
};
