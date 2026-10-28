import { useEffect, useState } from "react";
import { AmountInput } from "./AmountInput";
import { Layout } from "../shared/Layout";
import { computeBill } from "./bill";
import { Extras } from "./Extras";
import { parseMoney } from "./money";
import { Participants } from "./Participants";
import { Payments } from "./Payments";
import { Result } from "./Result";
import { createId, createState, loadState, saveState } from "./storage";
import { INPUT } from "./ui";

function Step({ number, title, hint, children }) {
  return (
    <section>
      <h2 className="mb-1 flex items-baseline gap-2 text-sm uppercase tracking-wide text-muted">
        <span className="text-primary">{number}.</span> {title}
      </h2>
      {hint && <p className="mb-3 text-sm text-muted">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

// Payments left empty or mistyped count as zero: the status under the list
// keeps saying how much is missing until they are fixed.
const parsePayments = (payments) =>
  Object.fromEntries(Object.entries(payments).map(([id, value]) => [id, parseMoney(value) ?? 0]));

export function HacemosNumeros() {
  const [state, setState] = useState(loadState);

  useEffect(() => saveState(state), [state]);

  const update = (change) => setState((current) => ({ ...current, ...change(current) }));

  const total = parseMoney(state.total);
  const totalInvalid = state.total.trim() !== "" && total === null;
  const bill = computeBill({
    participants: state.participants,
    total,
    payments: parsePayments(state.payments),
    extras: state.extras,
  });

  const participants = {
    onAdd: (name) => update((current) => ({ participants: [...current.participants, { id: createId(), name }] })),
    onRename: (id, name) =>
      update((current) => ({
        participants: current.participants.map((participant) =>
          participant.id === id ? { ...participant, name } : participant,
        ),
      })),
    // Removing someone also takes them out of what they paid and of every group expense.
    onRemove: (id) =>
      update((current) => ({
        participants: current.participants.filter((participant) => participant.id !== id),
        payments: Object.fromEntries(Object.entries(current.payments).filter(([payerId]) => payerId !== id)),
        extras: current.extras.map((extra) => ({
          ...extra,
          participantIds: extra.participantIds.filter((participantId) => participantId !== id),
        })),
      })),
  };

  const extras = {
    onAdd: (extra) => update((current) => ({ extras: [...current.extras, { ...extra, id: createId() }] })),
    onUpdate: (id, extra) =>
      update((current) => ({
        extras: current.extras.map((candidate) => (candidate.id === id ? { ...candidate, ...extra } : candidate)),
      })),
    onRemove: (id) => update((current) => ({ extras: current.extras.filter((extra) => extra.id !== id) })),
  };

  const startOver = () => {
    if (!window.confirm("¿Empezar una cuenta nueva? Se borran el total, los pagos y los gastos grupales.")) return;
    const keepPeople = window.confirm("¿Mantener a los mismos participantes?");
    setState(createState(keepPeople ? state.participants : []));
  };

  const hasPeople = state.participants.length > 0;

  return (
    <Layout title="Hacemos números">
      <div className="flex justify-end mb-4">
        <button className="ml-full text-sm text-muted hover:text-rose-400" onClick={startOver}>
          Borrar cuentas
        </button>
      </div>

      <div className="space-y-10">
        <Step number={1} title="Participantes">
          <Participants participants={state.participants} {...participants} />
        </Step>

        {hasPeople && (
          <Step number={2} title="Total de la cuenta">
            <AmountInput
              className={`${INPUT} ${totalInvalid ? "border-rose-400" : ""}`}
              aria-label="Total de la cuenta"
              value={state.total}
              onChange={(total) => update(() => ({ total }))}
            />
            {totalInvalid && (
              <p className="mt-2 text-xs text-rose-400">El total tiene que ser un número mayor a cero.</p>
            )}
          </Step>
        )}

        {hasPeople && (
          <Step number={3} title="Quiénes pagaron">
            <Payments
              participants={state.participants}
              payments={state.payments}
              total={total}
              unpaid={bill && !bill.error ? bill.unpaid : null}
              onChange={(id, value) => update((current) => ({ payments: { ...current.payments, [id]: value } }))}
              onPaidAll={(id, value) => update(() => ({ payments: { [id]: value } }))}
            />
          </Step>
        )}

        {hasPeople && (
          <Step
            number={4}
            title="Gastos grupales"
            hint="Lo que se reparte sólo entre algunos. El resto del total se divide en partes iguales."
          >
            <Extras participants={state.participants} extras={state.extras} {...extras} />
          </Step>
        )}

        {bill?.error && <p className="text-sm text-rose-400">{bill.error}</p>}
        {bill && !bill.error && (
          <div className="border-t border-border pt-8">
            <Result bill={bill} hasExtras={state.extras.length > 0} />
          </div>
        )}
      </div>
    </Layout>
  );
}
