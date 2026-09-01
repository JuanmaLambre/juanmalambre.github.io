import { useState } from "react";
import { equalPercents, formatPercent, parseMoney, parsePercent, toAmountInput } from "./money";
import { BUTTON, GHOST_BUTTON, INPUT, LABEL, PRIMARY_BUTTON } from "./ui";

// Percentages live in the draft as strings so a half-typed "33." keeps working
// while editing; they are parsed only when saving.
const sharesFromIds = (ids) =>
  Object.fromEntries(equalPercents(ids.length).map((percent, i) => [ids[i], formatPercent(percent)]));

function createDraft(participants, expense) {
  if (!expense) {
    return {
      name: "",
      amount: "",
      payerId: participants[0]?.id ?? "",
      shares: sharesFromIds(participants.map((participant) => participant.id)),
    };
  }
  return {
    name: expense.name,
    amount: toAmountInput(expense.amount),
    payerId: expense.payerId,
    shares: Object.fromEntries(
      expense.shares.map((share) => [share.participantId, formatPercent(share.percent)]),
    ),
  };
}

function validate(draft, participants) {
  const name = draft.name.trim();
  if (!name) return { error: "Poné un nombre para el gasto." };

  const amount = parseMoney(draft.amount);
  if (amount === null) return { error: "El monto tiene que ser un número mayor a cero." };

  if (!participants.some((participant) => participant.id === draft.payerId)) {
    return { error: "Elegí quién pagó." };
  }

  const entries = Object.entries(draft.shares);
  if (entries.length === 0) return { error: "Elegí al menos un participante." };

  const shares = [];
  for (const [participantId, value] of entries) {
    const percent = parsePercent(value);
    if (percent === null) return { error: "Los porcentajes tienen que ir entre 0 y 100." };
    shares.push({ participantId, percent });
  }

  // Que no sumen 100% se avisa pero no bloquea: el gasto se reparte
  // proporcionalmente a los porcentajes cargados. Todo en cero sí es un
  // problema: nadie cargaría el gasto y los saldos dejarían de cerrar.
  if (shares.reduce((sum, share) => sum + share.percent, 0) <= 0) {
    return { error: "Al menos un participante tiene que tener un porcentaje mayor a cero." };
  }

  return { expense: { name, amount, payerId: draft.payerId, shares } };
}

export function ExpenseForm({ participants, expense, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => createDraft(participants, expense));
  const [error, setError] = useState(null);

  const selectedIds = Object.keys(draft.shares);
  const total = selectedIds.reduce((sum, id) => sum + (parsePercent(draft.shares[id]) ?? 0), 0);
  const balanced = Math.abs(total - 100) <= 0.01;

  const update = (change) => setDraft((current) => ({ ...current, ...change }));

  // Adding or removing someone splits the expense evenly again: that is the
  // usual next step, and any custom percentage can be typed afterwards.
  const toggleParticipant = (participantId) => {
    const ids = participants
      .map((participant) => participant.id)
      .filter((id) => (id === participantId ? !selectedIds.includes(id) : selectedIds.includes(id)));
    update({ shares: sharesFromIds(ids) });
  };

  const setPercent = (participantId, value) =>
    update({ shares: { ...draft.shares, [participantId]: value } });

  const submit = (event) => {
    event.preventDefault();
    const result = validate(draft, participants);
    if (result.error) return setError(result.error);
    onSave(result.expense);
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="expense-name">
            Nombre
          </label>
          <input
            id="expense-name"
            className={INPUT}
            value={draft.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Cena, super, nafta…"
            autoFocus
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="expense-amount">
            Monto
          </label>
          <input
            id="expense-amount"
            className={INPUT}
            inputMode="decimal"
            value={draft.amount}
            onChange={(event) => update({ amount: event.target.value })}
            placeholder="0,00"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="expense-payer">
            Pagó
          </label>
          <select
            id="expense-payer"
            className={INPUT}
            value={draft.payerId}
            onChange={(event) => update({ payerId: event.target.value })}
          >
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className={`${LABEL} mb-0`}>Se reparte entre</span>
          <button
            type="button"
            className={GHOST_BUTTON}
            onClick={() => update({ shares: sharesFromIds(selectedIds) })}
          >
            Partes iguales
          </button>
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {participants.map((participant) => {
            const selected = selectedIds.includes(participant.id);
            return (
              <li key={participant.id} className="flex items-center gap-3 px-3 py-2">
                <input
                  type="checkbox"
                  id={`share-${participant.id}`}
                  className="size-4 accent-primary"
                  checked={selected}
                  onChange={() => toggleParticipant(participant.id)}
                />
                <label htmlFor={`share-${participant.id}`} className="flex-1 text-sm">
                  {participant.name}
                </label>
                {selected && (
                  <span className="flex items-center gap-1">
                    <input
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-right text-sm outline-none focus:border-primary"
                      inputMode="decimal"
                      aria-label={`Porcentaje de ${participant.name}`}
                      value={draft.shares[participant.id]}
                      onChange={(event) => setPercent(participant.id, event.target.value)}
                    />
                    <span className="text-sm text-muted">%</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        {balanced ? (
          <p className="mt-2 text-xs text-muted">Total: {formatPercent(total)}%</p>
        ) : (
          <p className="mt-2 text-xs text-amber-400">
            Total: {formatPercent(total)}% — no suma 100%, el gasto se reparte proporcionalmente.
          </p>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button type="submit" className={PRIMARY_BUTTON}>
          Guardar
        </button>
        <button type="button" className={BUTTON} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
