/** Locale-aware counts: plural form by Intl.PluralRules, digits by Intl.NumberFormat. */

type PluralForms = { readonly one: string; readonly other: string };

export function formatNumber(locale: string, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** "1 coin" / "5 coins": the number, then the noun in its plural category. */
export function counted(
  locale: string,
  count: number,
  forms: PluralForms,
): string {
  const form =
    new Intl.PluralRules(locale).select(count) === "one"
      ? forms.one
      : forms.other;
  return `${formatNumber(locale, count)} ${form}`;
}
