import { formatMoney } from "./money";
import { settleDebts } from "./bill";
import { CARD } from "./ui";

const HEADING = "mb-3 text-sm uppercase tracking-wide text-muted";

function Person({ person, showBreakdown }) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-baseline justify-between gap-4">
        <span>{person.participant.name}</span>
        <span className="font-medium">{formatMoney(person.owes)}</span>
      </div>
      {showBreakdown && person.breakdown.length > 0 && (
        <p className="mt-1 text-xs text-muted">
          {person.breakdown.map((part) => `${part.name} ${formatMoney(part.amount)}`).join(" + ")}
        </p>
      )}
    </li>
  );
}

function Transfers({ bill }) {
  if (bill.unpaid !== 0) {
    return (
      <p className="text-sm text-muted">Cuando los pagos cubran el total, acá aparece quién le pasa plata a quién.</p>
    );
  }

  const transfers = settleDebts(bill.balances);
  if (transfers.length === 0)
    return <p className="text-sm text-muted">Cada uno pagó lo suyo: nadie le debe a nadie.</p>;

  return (
    <ul className="space-y-3">
      {transfers.map((transfer, i) => (
        <li key={i} className={`${CARD} flex items-baseline justify-between gap-4`}>
          <span>
            <strong className="font-medium">{transfer.from.name}</strong>
            <span className="mx-2 text-muted">→</span>
            <strong className="font-medium">{transfer.to.name}</strong>
          </span>
          <span className="shrink-0 font-medium text-primary">{formatMoney(transfer.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Result({ bill, hasExtras }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className={HEADING}>Totales individuales</h2>
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {bill.people.map((person) => (
            <Person key={person.participant.id} person={person} showBreakdown={hasExtras} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className={HEADING}>Para quedar a mano</h2>
        <Transfers bill={bill} />
      </section>
    </div>
  );
}
