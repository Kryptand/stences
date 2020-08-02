const replaceTemplateStr = (str, obj) => str.replace(/{{(.*?)}}/g, () => obj);

export interface Transpiler {
  transform(searchString, value?: any): string;
}

export class DefaultTranspiler implements Transpiler {
  transform(translation: string, value?: any) {
    if (!value) {
      return translation;
    }
    return replaceTemplateStr(translation, value);
  }
}
