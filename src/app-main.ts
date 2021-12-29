import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Application's main element.
 * Only exists to render the `app-drawer` element, which otherwise would not be translated properly.
 * See README for details.
 */
@customElement("app-main")
export class AppMainElement extends LitElement {
  render() {
    return html`<app-drawer></app-drawer>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-main": AppMainElement;
  }
}
