import { Component, Host, h } from "@stencil/core";
import { TranslationEntry } from "../../helpers/translation/translation-entry";
import { TranslatorInstance } from "../../global/app";

@Component({
  tag: "home-page",
  styleUrl: "home-page.css",
  shadow: true,
})
export class HomePage {
  loadDynamicTranslation() {
    console.debug("fas");
    const translationEntry: TranslationEntry = {
      key: "dynamic-key",
      value: "<p>dynamischer <h1>wert</h1></p>",
    };
    TranslatorInstance.addTranslationEntries([translationEntry]);
  }
  person = {
    name: "Peter",
  };
  render() {
    return (
      <Host>
        {" "}
        <ion-button href="/test" routerDirection="forward">
          Home
        </ion-button>
        <ion-button onClick={() => this.loadDynamicTranslation()}>
          dynamic translation
        </ion-button>
        <select-language></select-language>
        <kryptand-t name="test" value={this.person.name}></kryptand-t>
        <kryptand-t name="dynamic-key"></kryptand-t>
      </Host>
    );
  }
}
