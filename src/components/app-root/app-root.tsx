import { Component, h, Host } from "@stencil/core";
import {
  createAbortableRequest,
  RequestStorageInstance,
} from "../../helpers/utils";

@Component({
  tag: "app-root",
  styleUrl: "app-root.css",
})
export class AppRoot {
  private isInitialized = false;

  componentWillLoad() {
    const request = createAbortableRequest(
      "http://slowwly.robertomurray.co.uk/delay/10000/url/http://www.google.co.uk"
    ).ready;
    request.then((req) => console.debug(req));
  }
  private abortRequests() {
    if (!this.isInitialized) {
      return;
    }
    console.debug("pop");
    console.debug(JSON.stringify(RequestStorageInstance.abortableRequests));
    RequestStorageInstance.abortAllRequests();
    console.debug(RequestStorageInstance.abortableRequests);
  }
  componentDidRender() {
    this.isInitialized = true;
  }
  render() {
    return (
      <Host>
        <ion-app>
          <ion-router
            onIonRouteWillChange={() => this.abortRequests()}
            useHash={false}
          >
            <ion-route url="/" component="home-page" />
            <ion-route url="/test" component="test-page" />
          </ion-router>
          <ion-nav />
        </ion-app>
      </Host>
    );
  }
}
