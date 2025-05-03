import { getLocales } from "expo-localization";
import { sprintf } from "@/utils/helper";
import { I18n } from "@/types/i18n";

import langs from "./langs";


const getLanguageCodeLocale = (): I18n => {
	const { languageCode } = getLocales()[0] as { languageCode: I18n };
	
	const supportedLanguages = Object.values(I18n);
	
	if (supportedLanguages.includes(languageCode)) {
		return languageCode;
	}
	
	return I18n.DEFAULT;
};


const i18n: Record<I18n, (str: keyof typeof langs[I18n], ...args: string[]) => string> = {
	en: (str, ...args) => sprintf(langs.en[str], ...args),
	fr: (str, ...args) => sprintf(langs.fr[str], ...args),
	es: (str, ...args) => sprintf(langs.es[str], ...args),
};

export { i18n, getLanguageCodeLocale };