import { Dimensions } from "react-native";

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

export const excludedProductSupplierIds = [
	"46c9b876-9b9b-4779-b8ff-e4af9d56914e",
	"6871100f-d1ae-4326-93f9-d4f5117243ab",
	"2b78beef-9304-4ea2-aa2a-22ab551a22ae",
	"8fbcc7b1-6c44-45f5-af85-bb500ab4166c",
];

export const PRIVATE_EQUITY_ID = "42369074-6134-4d77-8a91-46f9a2efb1c4";
export const GIRARDIN_INDUSTRIEL_ID = "36a662a2-c846-41a2-942e-b8748e34feed";

export const SCREEN_DIMENSIONS = Dimensions.get("window");
