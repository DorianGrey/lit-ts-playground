import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { msg, str, localized } from "@lit/localize";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@localized()
@customElement("x-counter")
export class CounterElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = "World";

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
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
    "x-counter": CounterElement;
  }
}
