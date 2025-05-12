import { SFSymbol } from "expo-symbols";


export const tintIos = {
	Hotel: "brown",
	Restaurant: "red",
	Avocat: "blue",
	Agence: "purple",
};

export const iconIos: {
	[key: string]: SFSymbol;
} = {
	Hotel: "cup.and.saucer.fill",
	Restaurant: "fork.knife",
	Avocat: "scalemass.fill",
	Agence: "building.2",
};

const iconAndroid: Record<string, string> = {
	Restaurant: require("@/assets/icons/restaurant.png"),
	Hotel: require("@/assets/icons/hotel.png"),
	Avocat: require("@/assets/icons/lawyer.png"),
	Agence: require("@/assets/icons/agency.png"),
};

export const getAndroidIcon = (name: string) => {
	const icon = iconAndroid[name as keyof typeof iconAndroid];
	return icon ?? require("@/assets/icons/unknown.png");
};