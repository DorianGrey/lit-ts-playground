import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { msg, str, localized } from "@lit/localize";

/**
 * Sample element from the Vite Lit-TS template, just for illustration purposes.
 */
@localized()
@customElement("counter-sample")
export class CounterElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  @property()
  name = "World";

  @state()
  count = 0;

  render() {
    return html`
      <h1>${msg(str`Hello, ${this.name}!`)}</h1>
      <button @click=${this._onClick} part="button">
        ${msg(str`Click Count: ${this.count}`)}
      </button>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "counter-sample": CounterElement;
  }
}
