import { formatMoney } from "./money";
import { computeBalances, settleDebts } from "./settlement";
import { CARD } from "./ui";

function Balance({ participant, balance }) {
  const [tone, label] =
    balance > 0
      ? ["text-emerald-400", "le deben"]
      : balance < 0
        ? ["text-rose-400", "debe"]
        : ["text-muted", "está a mano"];

  return (
    <li className="flex items-baseline justify-between gap-4 px-4 py-3">
      <span>{participant.name}</span>
      <span className={`text-sm ${tone}`}>
        {balance === 0 ? label : `${label} ${formatMoney(Math.abs(balance))}`}
      </span>
    </li>
  );
}

export function BalancesView({ group }) {
  if (group.participants.length === 0) {
    return <p className="text-sm text-muted">Todavía no hay participantes.</p>;
  }

  const balances = computeBalances(group);
  const transfers = settleDebts(balances);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Saldos</h2>
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {balances.map((entry) => (
            <Balance key={entry.participant.id} {...entry} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Para quedar a mano</h2>
        {transfers.length === 0 ? (
          <p className="text-sm text-muted">Ya está todo saldado.</p>
        ) : (
          <ul className="space-y-3">
            {transfers.map((transfer, i) => (
              <li key={i} className={`${CARD} flex items-baseline justify-between gap-4`}>
                <span>
                  <strong className="font-medium">{transfer.from.name}</strong>
                  <span className="mx-2 text-muted">→</span>
                  <strong className="font-medium">{transfer.to.name}</strong>
                </span>
                <span className="shrink-0 font-medium text-primary">
                  {formatMoney(transfer.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
