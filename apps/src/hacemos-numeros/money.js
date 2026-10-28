const AMOUNT_FORMAT = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INTEGER_FORMAT = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

// Amounts are kept in cents so splitting an expense never drifts by floating
// point: the parts always add up to the total. Whole amounts skip the ",00".
export const formatMoney = (cents) =>
  `$ ${(cents % 100 === 0 ? INTEGER_FORMAT : AMOUNT_FORMAT).format(cents / 100)}`;

// Value for an <input>, written the way formatAmountInput leaves what people type:
// "1.234" for whole amounts and "1.234,56" otherwise.
export const toAmountInput = (cents) =>
  formatAmountInput(cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2).replace(".", ","));

// Rewrites what is being typed in an amount input with dots between the
// thousands. The comma is the decimal separator, so the dots in the input are
// the ones this adds and get dropped, except one typed at the very end: on a
// keypad without a comma that is how decimals start.
export function formatAmountInput(input) {
  const raw = String(input).replace(/\.$/, ",").replace(/[^\d,]/g, "");
  const commaIndex = raw.indexOf(",");
  const integer = (commaIndex === -1 ? raw : raw.slice(0, commaIndex)).replace(/^0+(?=\d)/, "");
  const grouped = integer && INTEGER_FORMAT.format(Number(integer));
  if (commaIndex === -1) return grouped;
  const decimals = raw.slice(commaIndex + 1).replace(/,/g, "").slice(0, 2);
  return `${grouped || "0"},${decimals}`;
}

export function parseMoney(input) {
  const raw = String(input).replace(/\s/g, "");
  if (!raw) return null;
  // "1.234,56" and "1.234" use the dots as thousands separators; "1234.56" and
  // "1234,56" both use their only separator as the decimal one.
  const thousands = raw.includes(",") || /^\d{1,3}(\.\d{3})+$/.test(raw);
  const normalized = thousands ? raw.replace(/\./g, "").replace(",", ".") : raw;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return cents > 0 ? cents : null;
}
