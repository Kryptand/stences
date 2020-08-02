import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "test-page",
  styleUrl: "test-page.css",
  shadow: true,
})
export class TestPage {
  render() {
    return <Host>test</Host>;
  }
}
