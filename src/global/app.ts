import "@ionic/core";
import { Translator } from "../helpers/translation/translation";
import { DefaultTranslationLoader } from "../helpers/translation/translation-loader";
import { DefaultTranspiler } from "../helpers/translation/transpiler";

export const TranslatorInstance = new Translator(
  new DefaultTranslationLoader(),
  new DefaultTranspiler(),
  "de-DE"
);
export default () => {
  TranslatorInstance.initializeTranslations();
};
