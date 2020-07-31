import { Observable, of } from "rxjs";
import { TranslationEntries } from "./translation-entry";
import { fromFetch } from "rxjs/fetch";
import { catchError, map, switchMap } from "rxjs/operators";

const buildMapFromPlainObj = (obj) => {
  let map = new Map();
  Object.keys(obj).forEach((key) => {
    map.set(key, obj[key]);
  });
  return map;
};
export interface TranslationLoaderOptions {
  path: string;
}

export const DEFAULT_TRANSLATION_LOADER_OPTIONS: TranslationLoaderOptions = {
  path: `assets/i18n/`,
};

export interface TranslationLoader {
  fetchTranslations(loacle: string): Observable<TranslationEntries>;
}

export class DefaultTranslationLoader implements TranslationLoader {
  private options: TranslationLoaderOptions = DEFAULT_TRANSLATION_LOADER_OPTIONS;

  public configure(options: TranslationLoaderOptions) {
    this.options = options;
  }
  private translationCache: Map<string, any> = new Map();
  fetchTranslations(locale: string): Observable<TranslationEntries> {
    const { path } = this.options;
    const reqUrl = `${path}${locale}.json`;
    const translation = this.translationCache.get(reqUrl);
    if (translation) {
      return of(translation);
    }
    return fromFetch(reqUrl).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }
        return of({ error: true, message: `Error ${response.status}` });
      }),
      catchError((err) => {
        console.error(err);
        return of({ error: true, message: err.message });
      }),
      map((values) => {
        const mappedValue = buildMapFromPlainObj(values);
        this.translationCache.set(reqUrl, mappedValue);
        return mappedValue;
      })
    );
  }
}
