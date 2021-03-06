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
      gap: 1rem;
      align-items: center;
      position: fixed;
      top: 0;
      height: var(--header-height);
      width: 100%;
      z-index: 1024;
    }

    .content {
      margin-top: var(--header-height);
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

    select {
      background-color: var(--header-bg-color);
      color: var(--header-text-color);
      padding: 8px;
      border: none;
      height: 100%;
      margin-right: 8px;
    }

    option {
      background-color: var(--header-bg-color);
      color: var(--header-text-color);
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    .nav-bla a {
      color: var(--header-text-color);
      display: block;
      text-decoration: none;
    }

    .nav-bla li {
      padding: 16px 8px;
      background-color: var(--header-bg-color);
      transition: all 0.25s linear;
    }

    .nav-bla li:hover {
      filter: brightness(125%);
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
        <nav class="nav-bla">
          <ul>
            <li>
              <a href="/counter" @click="${this.navClicked}"
                >${msg(str`Counter example`)}</a
              >
            </li>
            <li>
              <a href="/experiments/map" @click="${this.navClicked}"
                >${msg(str`Map experiment`)}</a
              >
            </li>
            <li>
              <a href="/experiments/large-list" @click="${this.navClicked}"
                >${msg(str`Large list experiment`)}</a
              >
            </li>
          </ul>
        </nav>
        <div>${msg(str`Some header!`)}</div>
        <select @change=${this.languageChanged}>
          <option value="de">${msg(str`German`)}</option>
          <option value="en">${msg(str`English`)}</option>
        </select>
      </header>
      <main class="content">
        <slot></slot>
      </main>
    `;
  }

  private navClicked(): void {
    this.shadowRoot?.getElementById("burger-toggle")?.click();
  }

  private languageChanged(evt: Event): void {
    setLocale((evt.currentTarget as HTMLSelectElement).value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-drawer": AppDrawer;
  }
}
