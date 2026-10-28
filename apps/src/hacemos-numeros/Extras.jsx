import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AmountInput } from "./AmountInput";
import { formatMoney, parseMoney, toAmountInput } from "./money";
import { BUTTON, CARD, ICON_BUTTON, INPUT, LABEL, PRIMARY_BUTTON } from "./ui";

function createDraft(extra) {
  if (!extra) return { name: "", amount: "", participantIds: [] };
  return { name: extra.name, amount: toAmountInput(extra.amount), participantIds: extra.participantIds };
}

function validate(draft) {
  const amount = parseMoney(draft.amount);
  if (amount === null) return { error: "El monto tiene que ser un número mayor a cero." };
  if (draft.participantIds.length === 0) return { error: "Elegí quiénes participan de este gasto." };
  return { extra: { name: draft.name.trim() || "Gasto grupal", amount, participantIds: draft.participantIds } };
}

function ExtraForm({ participants, extra, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => createDraft(extra));
  const [error, setError] = useState(null);

  const update = (change) => setDraft((current) => ({ ...current, ...change }));

  // Kept in the order of the participant list, whatever order they were ticked in.
  const toggle = (participantId) =>
    update({
      participantIds: participants
        .map((participant) => participant.id)
        .filter((id) =>
          id === participantId ? !draft.participantIds.includes(id) : draft.participantIds.includes(id),
        ),
    });

  const submit = (event) => {
    event.preventDefault();
    const result = validate(draft);
    if (result.error) return setError(result.error);
    onSave(result.extra);
  };

  return (
    <form onSubmit={submit} className={CARD}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="extra-name">
            Qué es
          </label>
          <input
            id="extra-name"
            className={INPUT}
            value={draft.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Cervezas, vino, postre…"
            autoFocus
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="extra-amount">
            Cuánto
          </label>
          <AmountInput
            id="extra-amount"
            className={INPUT}
            value={draft.amount}
            onChange={(amount) => update({ amount })}
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className={`${LABEL} mb-0`}>Entre quiénes</span>
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center gap-3 px-3 py-2">
              <input
                type="checkbox"
                id={`extra-${participant.id}`}
                className="size-4 accent-primary"
                checked={draft.participantIds.includes(participant.id)}
                onChange={() => toggle(participant.id)}
              />
              <label htmlFor={`extra-${participant.id}`} className="flex-1 text-sm">
                {participant.name}
              </label>
            </li>
          ))}
        </ul>
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

function ExtraCard({ extra, participants, onEdit, onRemove }) {
  const names = participants
    .filter((participant) => extra.participantIds.includes(participant.id))
    .map((participant) => participant.name);

  return (
    <li className={`${CARD} flex items-center gap-3`}>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{extra.name}</span>
        <span className="block text-sm text-muted">
          {/* Everybody it named was removed: the bill charges it to the whole table. */}
          {names.length > 0 ? names.join(", ") : "Entre todos"}
        </span>
      </span>
      <span className="shrink-0 font-medium">{formatMoney(extra.amount)}</span>
      <span className="flex shrink-0 gap-1">
        <button className={ICON_BUTTON} onClick={onEdit} title="Editar" aria-label={`Editar ${extra.name}`}>
          <PencilSquareIcon className="size-5" />
        </button>
        <button
          className={`${ICON_BUTTON} hover:text-rose-400`}
          onClick={onRemove}
          title="Borrar"
          aria-label={`Borrar ${extra.name}`}
        >
          <TrashIcon className="size-5" />
        </button>
      </span>
    </li>
  );
}

export function Extras({ participants, extras, onAdd, onUpdate, onRemove }) {
  // null: the form is closed. "new" or an extra id: the form is open on it.
  const [editing, setEditing] = useState(null);
  const editingExtra = extras.find((extra) => extra.id === editing);

  const save = (extra) => {
    if (editingExtra) onUpdate(editingExtra.id, extra);
    else onAdd(extra);
    setEditing(null);
  };

  return (
    <div className="space-y-3">
      {extras.length > 0 && (
        <ul className="space-y-3">
          {extras.map((extra) =>
            extra.id === editing ? null : (
              <ExtraCard
                key={extra.id}
                extra={extra}
                participants={participants}
                onEdit={() => setEditing(extra.id)}
                onRemove={() => onRemove(extra.id)}
              />
            ),
          )}
        </ul>
      )}

      {editing ? (
        <ExtraForm
          key={editing}
          participants={participants}
          extra={editingExtra}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button className={BUTTON} onClick={() => setEditing("new")}>
          Agregar gasto grupal
        </button>
      )}
    </div>
  );
}
