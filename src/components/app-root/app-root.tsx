import { Component, h, Host } from "@stencil/core";
import { RequestStorageInstance } from "../../helpers/utils";

@Component({
  tag: "app-root",
  styleUrl: "app-root.css",
})
export class AppRoot {
  cancelPendingRequests() {
    RequestStorageInstance.abortAllRequests();
  }
  render() {
    return (
      <Host>
        <select-language></select-language>
        <kryptand-t name="test"></kryptand-t>

      </Host>
    );
  }
  t;
}
