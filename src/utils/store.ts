import { MMKV } from "react-native-mmkv";
import { AppUser } from "@/types/user";


const storage = new MMKV();

const USER_INFOS_KEY = "user.data";

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
	storage.delete(USER_INFOS_KEY);
};

export { setStorageUserInfos, getStorageUserInfos, removeStorageUserInfos };
