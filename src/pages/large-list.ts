import { localized } from "@lit/localize";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

// See https://github.com/PolymerLabs/uni-virtualizer/issues/103#issuecomment-875580352 for why.
import { Layout1d } from "@lit-labs/virtualizer";

interface AccountSample {
  id: number;
  principal: string;
  age: number;
}

const sampleData: AccountSample[] = new Array(1_000_000)
  .fill(0)
  .map<AccountSample>((_, idx) => ({
    id: idx + 1,
    principal: `Account${idx + 1}`,
    age: Math.round(Math.random() * 100),
  }));

const renderAccountItem = (account: AccountSample) => html`
  <div class="account-entry">
    <div>${account.id}</div>
    <div>${account.principal}</div>
    <div>${account.age}</div>
  </div>
`;

@localized()
@customElement("large-list-page")
export class LargeListPage extends LitElement {
  static styles = css`
    .account-entry {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      padding: 1rem;
      width: 100%;
    }

    lit-virtualizer {
      height: calc(100vh - var(--header-height));
      max-height: 1024px;
    }
  `;

  render() {
    return html`
      <lit-virtualizer
        .items=${sampleData}
        .renderItem=${renderAccountItem}
        .layout=${Layout1d}
      ></lit-virtualizer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "large-list-page": LargeListPage;
  }
}
