import { MMKV } from "react-native-mmkv";
import { AppUser } from "@/types/user";

const storage = new MMKV();

const USER_INFOS_KEY = "user.data";

const setStorageUserInfos = (infos: AppUser) => storage.set(USER_INFOS_KEY, JSON.stringify(infos));

const getStorageUserInfos = () => {
	const data = storage.getString(USER_INFOS_KEY);
	if (!data) return null;
	return JSON.parse(data) as AppUser;
};

const removeStorageUserInfos = () => storage.delete(USER_INFOS_KEY);

export { setStorageUserInfos, getStorageUserInfos, removeStorageUserInfos };
