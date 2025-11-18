import { Dimensions } from "react-native";
import Constants from "expo-constants";

/**
 * @description correctly type Object.keys
 */
export const getKeysTypedObject = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/**
 * @description a text replacer which return a string with %s replaced by your values in order
 */
export const sprintf = (str: string, ...args: string[]) => {
	return args.reduce((acc, curr) => acc.replace(/%s/, curr), str);
};

/**
 * @description pause the thread for a given time
 */
export const sleep = (time: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

/**
 * @description truncate a text to a given length
 */
export const truncateText = (text: string, maxLength: number) => {
	if (text.length > maxLength) {
		return text.slice(0, maxLength - 3) + "...";
	}
	return text;
};

/**
 * @description generate y axis tick values
 * @param maxAmount the max amount
 * @param numberOfTicks the number of ticks
 */
export const generateYAxisTickValues = (maxAmount: number, numberOfTicks: number): number[] => {
	const maxAmountFixed = Number(maxAmount.toFixed(0));
	const maxChart = Number((maxAmountFixed * 1.05).toFixed(0));
	if (numberOfTicks < 2) return [0, maxChart]; // Needs at least 2 ticks (start and end)

	const finalMax = maxChart;
	const tickValues: number[] = [];
	const interval = Math.max(1, Number((finalMax / (numberOfTicks - 1)).toFixed(0))); // Ensure minimum interval of 1

	for (let i = 0; i < numberOfTicks; i++) {
		tickValues.push(i * interval);
	}

	// Remove duplicates and sort
	return [...new Set(tickValues)].sort((a, b) => a - b);
};

/**
 * @description check if a user is new (less than 3 months in the organization)
 * @param entry_date the user's entry date
 */
export const isNewEmployee = (entry_date?: string): boolean => {
	if (!entry_date) return false;

	const entryDate = new Date(entry_date);
	const currentDate = new Date();
	const threeMonthsAgo = new Date();
	threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

	return entryDate > threeMonthsAgo;
};

export const needImportantVersion = () => {
	return (VERSION_NUMBER ?? "") < "1.2.8";
};

export const excludedProductSupplierIds = [
	// dettes privées obligatoires
	"46c9b876-9b9b-4779-b8ff-e4af9d56914e",
	// capital investissement
	"2b78beef-9304-4ea2-aa2a-22ab551a22ae",
	// éligibles assurances vies
	"8fbcc7b1-6c44-45f5-af85-bb500ab4166c",
	// 150 OB TER
	"6871100f-d1ae-4326-93f9-d4f5117243ab",
	// FCPR
	"949d4203-a2f3-40cc-b5cc-fcfe4464ccd8",
];

export const PRIVATE_EQUITY_ID = "42369074-6134-4d77-8a91-46f9a2efb1c4";
export const GIRARDIN_INDUSTRIEL_ID = "36a662a2-c846-41a2-942e-b8748e34feed";
export const OB_TER_ID = "6871100f-d1ae-4326-93f9-d4f5117243ab";
export const USER_LEONIE_ID = "3aec92de-0d1f-4909-ae0b-71156f40b854";
export const USER_MATHIEU_ID = "da45b442-babf-4c37-af20-2f79c57fb51f";
export const USER_DEV_ID = "9e817b3c-50bf-4564-a653-28516ef84f59";
export const USER_DEV_2_ID = "34346fc6-2fe6-4009-92b3-5936073c7c19";
export const FCPR_ID = "949d4203-a2f3-40cc-b5cc-fcfe4464ccd8";

export const SCREEN_DIMENSIONS = Dimensions.get("window");
export const VERSION_NUMBER = Constants.expoConfig?.version;
export const APP_URL_ANDROID = "https://play.google.com/store/apps/details?id=com.anonymze.simplylife";
export const APP_URL_IOS = "https://apps.apple.com/updates";
// export const APP_URL_IOS = "https://apps.apple.com/app/id6742592384";
// itms-apps://itunes.apple.com/app/id6742592384`
