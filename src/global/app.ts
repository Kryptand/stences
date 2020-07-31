import "@ionic/core";
import { Translator } from "../helpers/translation/translation";
import { DefaultTranslationLoader } from "../helpers/translation/translation-loader";

export const TranslatorInstance = new Translator(
  new DefaultTranslationLoader(),
  "de-DE"
);
export default () => {
  TranslatorInstance.initializeTranslations();
};
