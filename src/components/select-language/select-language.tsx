import { Component, ComponentInterface, Host, h, State } from "@stencil/core";
import { TranslatorInstance } from "../../global/app";

@Component({
  tag: "select-language",
  styleUrl: "select-language.css",
  shadow: true,
})
export class SelectLanguage implements ComponentInterface {
  @State() selectedLang: string;
  componentWillLoad() {
    TranslatorInstance.currentLang$.subscribe(
      (currentLang) => (this.selectedLang = currentLang)
    );
  }

  changeLanguage(event) {
    const lang = event.target.value;
    TranslatorInstance.changeLanguage(lang);
  }
  render() {
    return (
      <Host>
        <select
          onInput={(changeEvt) => {
            this.changeLanguage(changeEvt);
          }}
        >
          <option value="de-DE" selected={this.selectedLang === "de-DE"}>
            DE
          </option>
          <option value="en-US" selected={this.selectedLang === "en-US"}>
            EN
          </option>
        </select>
      </Host>
    );
  }
}
