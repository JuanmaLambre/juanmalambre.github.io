const AMOUNT_FORMAT = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Amounts are kept in cents so splitting an expense never drifts by floating
// point: the parts always add up to the total.
export const formatMoney = (cents) => `$ ${AMOUNT_FORMAT.format(cents / 100)}`;

// Value for an <input>: plain digits with a dot, no thousands separator.
export const toAmountInput = (cents) => (cents / 100).toFixed(2);

export function parseMoney(input) {
  const raw = String(input).replace(/\s/g, "");
  if (!raw) return null;
  // "1.234,56" uses the dots as thousands separators; "1234.56" and "1234,56"
  // both use their only separator as the decimal one.
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return cents > 0 ? cents : null;
}

export function parsePercent(input) {
  const normalized = String(input).replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const percent = Number(normalized);
  return percent <= 100 ? percent : null;
}

// Drops the trailing zeros a computed percentage carries: 33.30 -> "33.3".
export const formatPercent = (percent) => String(Number(percent.toFixed(2)));

// Splits 100% between n participants without losing hundredths: the leftover
// basis points go to the first ones, so 3 participants get 33.34/33.33/33.33.
export function equalPercents(count) {
  const base = Math.floor(10000 / count);
  let leftover = 10000 - base * count;
  return Array.from({ length: count }, () => (base + (leftover-- > 0 ? 1 : 0)) / 100);
}
