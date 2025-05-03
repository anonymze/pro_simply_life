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
