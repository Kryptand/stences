import { BehaviorSubject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { TranslationEntries, TranslationEntry } from "./translation-entry";
import { TranslationLoader } from "./translation-loader";

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
    TranslationEntries
  > = new BehaviorSubject<TranslationEntries>(new Map());
  readonly translationEntries$ = this.translationEntriesSub$.asObservable();

  get translationEntries(): TranslationEntries {
    return this.translationEntriesSub$.getValue();
  }

  set translationEntries(value: TranslationEntries) {
    this.translationEntriesSub$.next(value);
  }

  readonly translate$ = (key: string) =>
    this.translationEntries$.pipe(
      map((translationValues) => translationValues.get(key))
    );

  addTranslationEntries(...translationEntries: TranslationEntry[]) {
    translationEntries.forEach((translationEntry) => {
      this.translationEntries.set(translationEntry.key, translationEntry.value);
    });
  }

  private reloadTranslationsSub$: BehaviorSubject<void> = new BehaviorSubject<
    void
  >(null);
  constructor(private loader: TranslationLoader, defaultLanguage: string) {
    this.defaultLang = defaultLanguage;
    this.currentLang = defaultLanguage;
  }

  initializeTranslations() {
    const translations = this.reloadTranslationsSub$.pipe(
      switchMap(() => this.loader.fetchTranslations(this.currentLang))
    );
    translations.subscribe((translationEntries) => {
      this.translationEntries = translationEntries;
    });
  }
}
