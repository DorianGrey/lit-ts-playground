import { Router } from "esroute";
import { html, noChange, TemplateResult } from "lit";
import { AsyncDirective, directive } from "lit/async-directive.js";
import { PartInfo, PartType } from "lit/directive.js";

export const router = new Router<TemplateResult>(
  {
    "/": ({ go }) => go("/counter"),
    counter: () => html`<counter-sample></counter-sample>`,
    experiments: {
      map: async () => {
        await import("./pages/map");
        return html`<map-page></map-page>`;
      },
      "large-list": async () => {
        await import("./pages/large-list");
        return html`<large-list-page></large-list-page>`;
      },
    },
  },
  {
    notFound: () => html`<not-found></not-found>`,
  }
);

class RenderRoutesDirective extends AsyncDirective {
  private _router?: Router<TemplateResult>;
  private _unsubscribe?: () => void;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.CHILD)
      throw new Error(
        "The `renderRoutes` directive must be used as a child directive."
      );
  }

  override render(router: Router<TemplateResult>) {
    if (this._router !== router) {
      this._unsubscribe?.();
      this._router = router;
      if (this.isConnected) this._subscribe();
    }
    return noChange;
  }

  override disconnected() {
    this._unsubscribe?.();
  }

  override reconnected() {
    this._subscribe();
  }

  private _subscribe() {
    this._unsubscribe = this._router?.onResolve(({ value }) =>
      this.setValue(value)
    );
  }
}

export const renderRoutes = directive(RenderRoutesDirective);
