import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { msg, str, localized } from "@lit/localize";
import { setLocale } from "./locale-config";

@localized()
@customElement("app-drawer")
export class AppDrawer extends LitElement {
  static styles = css`
    header {
      background-color: var(--header-bg-color);
      color: var(--header-text-color);
      display: grid;
      grid-template-columns: 50px 1fr auto;
      align-items: center;
      position: fixed;
      top: 0;
      height: var(--header-height);
      width: 100%;
    }

    .content {
      margin: var(--header-height) 8px 8px 8px;
    }

    #burger-toggle {
      /* Hide this one by default - only toggle by label! */
      display: none;
    }

    #burger-toggle:checked + .burger-button {
      background-color: var(--header-text-color);
    }

    #burger-toggle:checked + .burger-button > div {
      background-color: var(--header-bg-color);
    }

    #burger-toggle:checked + .burger-button > .line-1 {
      transform: rotate(45deg);
      top: calc(50% - var(--drawer-burger-line-height) / 2);
    }

    #burger-toggle:checked + .burger-button > .line-2 {
      opacity: 0;
    }

    #burger-toggle:checked + .burger-button > .line-3 {
      transform: rotate(-45deg);
      top: calc(50% - var(--drawer-burger-line-height) / 2);
    }

    .burger-button {
      height: 100%;
      width: 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.25s linear;
    }

    .burger-button > div {
      height: var(--drawer-burger-line-height);
      border-radius: 8px;
      background-color: var(--header-text-color);
      width: 80%;
      position: absolute;
      opacity: 1;
      transition: all 0.25s linear;
    }

    .line-1 {
      top: calc(25% - var(--drawer-burger-line-height) / 2);
    }

    .line-2 {
      top: calc(50% - var(--drawer-burger-line-height) / 2);
    }

    .line-3 {
      top: calc(75% - var(--drawer-burger-line-height) / 2);
    }

    .nav-bla {
      position: absolute;
      top: var(--header-height);
      background-color: var(--header-bg-color);
      width: var(--menu-width);
      transform: translateX(calc(-1 * var(--menu-width)));
      transition: all 0.25s linear;
      height: 100vh;
    }

    #burger-toggle:checked ~ .nav-bla {
      transform: translateX(0);
    }
  `;

  render() {
    return html`
      <header>
        <input type="checkbox" id="burger-toggle" />
        <label for="burger-toggle" class="burger-button">
          <div class="line-1"></div>
          <div class="line-2"></div>
          <div class="line-3"></div>
        </label>
        <div class="nav-bla">
          <h1>${msg(str`Content here!`)}</h1>
        </div>
        <div>${msg(str`Some header!`)}</div>
        <select @change=${this.languageChanged}>
          <option>DE</option>
          <option>EN</option>
        </select>
      </header>
      <my-element class="content">
        <p>${msg(str`This is child content`)}</p>
      </my-element>
    `;
  }

  private languageChanged(evt: Event): void {
    setLocale((evt.currentTarget as HTMLSelectElement).value.toLowerCase());
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-drawer": AppDrawer;
  }
}
