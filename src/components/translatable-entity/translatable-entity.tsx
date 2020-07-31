import {
  Component,
  ComponentInterface,
  Host,
  h,
  Prop,
  State,
} from "@stencil/core";
import { TranslatorInstance } from "../../global/app";
import { Subscription } from "rxjs";

@Component({
  tag: "kryptand-t",
  styleUrl: "translatable-entity.css",
})
export class TranslatableEntity implements ComponentInterface {
  @Prop() name: string;
  @State() value: string;
  private subscription: Subscription;
  componentWillLoad() {
    this.subscription = TranslatorInstance.translate$(this.name).subscribe(
      (value) => (this.value = value)
    );
  }
  disconnectedCallback() {
    if (!this.subscription) {
      return;
    }
    this.subscription.unsubscribe();
  }

  render() {
    return <Host innerHTML={this.value}></Host>;
  }
}
