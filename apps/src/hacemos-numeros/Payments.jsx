import { AmountInput } from "./AmountInput";
import { formatMoney, parseMoney, toAmountInput } from "./money";
import { GHOST_BUTTON } from "./ui";

const AMOUNT_INPUT =
  "w-32 rounded-lg border bg-background px-2 py-1 text-right text-sm outline-none focus:border-primary";

function PaymentsStatus({ unpaid }) {
  if (unpaid === 0) return <p className="mt-2 text-xs text-muted">Los pagos cubren el total.</p>;
  return (
    <p className="mt-2 text-xs text-amber-400">
      {unpaid > 0
        ? `Falta decir quién pagó ${formatMoney(unpaid)}.`
        : `Los pagos se pasan del total por ${formatMoney(-unpaid)}.`}
    </p>
  );
}

// `unpaid` is null while there is no valid total to compare the payments to.
export function Payments({ participants, payments, total, unpaid, onChange, onPaidAll }) {
  return (
    <>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {participants.map((participant) => {
          const value = payments[participant.id] ?? "";
          const invalid = value.trim() !== "" && parseMoney(value) === null;
          return (
            <li key={participant.id} className="flex items-center gap-3 px-3 py-2">
              <label htmlFor={`paid-${participant.id}`} className="min-w-0 flex-1 truncate text-sm">
                {participant.name}
              </label>
              {total !== null && (
                <button
                  type="button"
                  className={`${GHOST_BUTTON} text-xs`}
                  onClick={() => onPaidAll(participant.id, toAmountInput(total))}
                  title="Pagó toda la cuenta"
                >
                  Pagó todo
                </button>
              )}
              <AmountInput
                id={`paid-${participant.id}`}
                className={`${AMOUNT_INPUT} ${invalid ? "border-rose-400" : "border-border"}`}
                value={value}
                onChange={(amount) => onChange(participant.id, amount)}
              />
            </li>
          );
        })}
      </ul>
      {unpaid !== null && <PaymentsStatus unpaid={unpaid} />}
    </>
  );
}
