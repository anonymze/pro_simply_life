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
	const interval = Number((finalMax / (numberOfTicks - 1)).toFixed(0));

	for (let i = 0; i < numberOfTicks; i++) {
		tickValues.push((i * interval)); // Round to 2 decimal places for currency
	}
	return tickValues;
};