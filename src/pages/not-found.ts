import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("not-found")
export class NotFoundPage extends LitElement {
  static styles = css`
    .text-center {
      text-align: center;
    }
    .italic {
      font-style: italic;
    }
    .mt-8 {
      margin-top: 8px;
    }
  `;

  render() {
    return html`
      <div>
        <h4 class="text-center">
          404 | Well, That about Wraps It Up for This Page
        </h4>
        <blockquote>
          <p>
            ’I refuse to prove that I exist,’ says Page, ’for proof denies
            faith, and without faith I am nothing.’
          </p>
          <p>
            ’But,’ says Man, ’The Babel fish is a dead giveaway, isn’t it? It
            could not have evolved by chance. It proves you exist, and so
            therefore, by your own arguments, you don’t. QED.’
          </p>
          <p id="oh-dear-text">
            ’Oh dear,’ says Page, ’I hadn’t thought of that,’ and promptly
            disappears in a puff of logic.
          </p>
          <p class="italic mt-8">
            – Thanks to&nbsp;
            <a
              href="https://www.elastic.co/de/whatever"
              target="_blank"
              rel="noopener"
            >
              https://www.elastic.co
            </a>
            &nbsp;for this story
          </p>
        </blockquote>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "not-found": NotFoundPage;
  }
}
