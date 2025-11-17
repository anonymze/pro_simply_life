import { AppUser } from "@/types/user";
import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

const USER_INFOS_KEY = "user.data";
const FIRST_COMMISSION_KEY = "commission.data";
const FIRST_LOGIN_KEY = "user.first_login";

let cachedUser: AppUser | null = null;

const setStorageUserInfos = (infos: AppUser) => {
	cachedUser = infos;
	storage.set(USER_INFOS_KEY, JSON.stringify(infos));
};

const getStorageUserInfos = () => {
	if (cachedUser) return cachedUser;

	const data = storage.getString(USER_INFOS_KEY);
	if (!data) return null;
	cachedUser = JSON.parse(data) as AppUser;
	return cachedUser;
};

const removeStorageUserInfos = () => {
	cachedUser = null;
	storage.remove(USER_INFOS_KEY);
};

const getStorageFirstCommission = () => {
	return storage.getBoolean(FIRST_COMMISSION_KEY) ?? false;
};

const setStorageFirstCommission = (state: boolean) => {
	storage.set(FIRST_COMMISSION_KEY, state);
};

const setStorageFirstLogin = (state: boolean) => {
	storage.set(FIRST_LOGIN_KEY, state);
};

const getStorageFirstLogin = () => {
	return storage.getBoolean(FIRST_LOGIN_KEY) ?? false;
};

export {
	getStorageFirstCommission,
	getStorageFirstLogin,
	getStorageUserInfos,
	removeStorageUserInfos,
	setStorageFirstCommission,
	setStorageFirstLogin,
	setStorageUserInfos,
};
