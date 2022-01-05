import { allLocales } from "../locales/locale-codes";
import { getLocale } from "../locale-config";

const formatters = Object.fromEntries(
  allLocales.map((it) => [
    it,
    new Intl.NumberFormat(it, { maximumFractionDigits: 4 }),
  ])
);

/**
 * Very primitive number localization formatting support, but it will do the trick
 * for a lot of relevant purposes.
 * Relies on the standardized
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat">
 * Intl.NumberFormat
 * </a>.
 * For rerendering in case the selected language changes, it relies on the
 * rerender trigger of the `@localized` annotation from `@lit/localize`,
 * so make sure to add it to every component using the formatter (might
 * already be present due to text localization).
 *
 * @param value Value to format.
 * @returns The formatted number.
 */
export function fmtNumber(value: number): string {
  const formatter = formatters[getLocale()];

  return formatter.format(value);
}
