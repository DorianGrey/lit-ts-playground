import "system-font-css/system-font.css";
import "./global.css";

import "./my-element";
import "./app-drawer";
import "./app-main";

import { allLocales } from "./locales/locale-codes";
import { getLocale, setLocale } from "./locale-config";

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
