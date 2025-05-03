import frTranslations from "./fr";
import esTranslations from "./es";
import enTranslations from "./en";

// we use the lang en for the source of truth for typescript
const en: typeof enTranslations = enTranslations;
const fr: typeof enTranslations = frTranslations;
const es: typeof enTranslations = esTranslations;

export default { en, fr, es };
