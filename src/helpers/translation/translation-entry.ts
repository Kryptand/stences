export type LanguageScopedTranslationEntry = Map<string, TranslationEntries>;
export type TranslationEntries = Map<string, string>;
export interface TranslationEntry {
  key: string;
  value: string;
}
