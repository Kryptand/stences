import { BehaviorSubject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import {
  LanguageScopedTranslationEntry,
  TranslationEntries,
  TranslationEntry,
} from "./translation-entry";
import { TranslationLoader } from "./translation-loader";
import { Transpiler } from "./transpiler";

export class Translator {
  private defaultLangSub$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);
  readonly defaultLang$ = this.defaultLangSub$.getValue();
  get defaultLang() {
    return this.defaultLangSub$.getValue();
  }
  set defaultLang(lang: string) {
    this.defaultLangSub$.next(lang);
  }
  private currentLangSub$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);
  readonly currentLang$ = this.currentLangSub$.asObservable();

  get currentLang(): string {
    return this.currentLangSub$.getValue();
  }

  set currentLang(value: string) {
    this.currentLangSub$.next(value);
  }
  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.reloadTranslationsSub$.next();
  }

  private translationEntriesSub$: BehaviorSubject<
    LanguageScopedTranslationEntry
  > = new BehaviorSubject<LanguageScopedTranslationEntry>(new Map());
  readonly translationEntries$ = this.translationEntriesSub$.asObservable();

  get translationEntries(): LanguageScopedTranslationEntry {
    return this.translationEntriesSub$.getValue();
  }

  set translationEntries(value: LanguageScopedTranslationEntry) {
    this.translationEntriesSub$.next(value);
  }
  readonly translate = (key: string, value?: any) => {
    this.transpileValues(this.translationEntries, key, value);
  };
  readonly translate$ = (key: string, value?: any) =>
    this.translationEntries$.pipe(
      map((translationValues) => {
        if (translationValues == null) {
          return key;
        }
        return this.transpileValues(translationValues, key, value);
      })
    );

  private transpileValues(
    translationValues: Map<string, TranslationEntries>,
    key: string,
    value: any
  ) {
    const currTranslationValues = translationValues.get(this.currentLang);
    if (currTranslationValues == null) {
      return key;
    }
    const translatedString = currTranslationValues.get(key);
    if (translatedString == null) {
      return key;
    }
    return this.transpiler.transform(translatedString, value);
  }

  addTranslationEntries(
    translationEntries: TranslationEntry[],
    lang = this.currentLang
  ) {
    const currTranslations = this.translationEntries.get(lang);
    translationEntries.forEach((translationEntry) => {
      currTranslations.set(translationEntry.key, translationEntry.value);
    });
    this.translationEntries.set(lang, currTranslations);
    this.reloadTranslationsSub$.next();
  }

  private reloadTranslationsSub$: BehaviorSubject<void> = new BehaviorSubject<
    void
  >(null);
  constructor(
    private loader: TranslationLoader,
    private transpiler: Transpiler,
    defaultLanguage: string
  ) {
    this.defaultLang = defaultLanguage;
    this.currentLang = defaultLanguage;
  }

  initializeTranslations() {
    const translations = this.reloadTranslationsSub$.pipe(
      switchMap(() => this.loader.fetchTranslations(this.currentLang))
    );
    translations.subscribe((translationEntries) => {
      const translations = new Map();
      translations.set(this.currentLang, translationEntries);
      this.translationEntries = translations;
    });
  }
}
