import "system-font-css/system-font.css";
import "./global.css";

import "./pages/counter";
import "./pages/not-found";
import "./app-drawer";
import "./router";

import { allLocales } from "./locales/locale-codes";
import { getLocale, setLocale } from "./locale-config";
import { html, render } from "lit";

const browserSupportedLanguages = navigator.languages.map((it) =>
  it.slice(0, 2)
) as unknown as typeof allLocales;
// kinda unlikely to have to force-cast this, but the locale overview is more strict
// than the string array.
const firstMatchingSupportedLanguage = browserSupportedLanguages.find((it) =>
  allLocales.includes(it)
);

if (
  firstMatchingSupportedLanguage &&
  firstMatchingSupportedLanguage !== getLocale()
) {
  setLocale(firstMatchingSupportedLanguage);
}

const outlet = document.getElementById("outlet");
if (!outlet) {
  throw new Error("Outlet container not found");
}
render(html`<app-drawer></app-drawer>`, outlet);
