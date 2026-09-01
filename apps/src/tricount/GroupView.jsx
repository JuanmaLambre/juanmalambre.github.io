import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { BUTTON, ICON_BUTTON, INPUT, LABEL } from "./ui";

// A participant that already appears in an expense cannot be removed: the
// amounts of that expense would stop adding up.
function participantsInUse(group) {
  const used = new Set();
  for (const expense of group.expenses) {
    used.add(expense.payerId);
    for (const share of expense.shares) used.add(share.participantId);
  }
  return used;
}

export function GroupView({ group, onRenameGroup, onAddParticipant, onRenameParticipant, onRemoveParticipant }) {
  const [name, setName] = useState("");
  const used = participantsInUse(group);

  const add = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddParticipant(trimmed);
    setName("");
  };

  return (
    <div className="space-y-8">
      <section>
        <label className={LABEL} htmlFor="group-name">
          Nombre del grupo
        </label>
        <input
          id="group-name"
          className={INPUT}
          value={group.name}
          onChange={(event) => onRenameGroup(event.target.value)}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Participantes</h2>
        {group.participants.length === 0 ? (
          <p className="mb-3 text-sm text-muted">Todavía no hay participantes.</p>
        ) : (
          <ul className="mb-4 divide-y divide-border rounded-xl border border-border bg-surface">
            {group.participants.map((participant) => (
              <li key={participant.id} className="flex items-center gap-3 px-3 py-2">
                <input
                  className="flex-1 rounded-lg bg-transparent px-1 py-1 text-sm outline-none focus:bg-background"
                  aria-label={`Nombre de ${participant.name}`}
                  value={participant.name}
                  onChange={(event) => onRenameParticipant(participant.id, event.target.value)}
                />
                <button
                  className={`${ICON_BUTTON} hover:text-rose-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted`}
                  disabled={used.has(participant.id)}
                  aria-label={`Borrar a ${participant.name}`}
                  title={
                    used.has(participant.id)
                      ? "Participa en algún gasto: borrá esos gastos primero."
                      : "Borrar"
                  }
                  onClick={() => onRemoveParticipant(participant.id)}
                >
                  <TrashIcon className="size-5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={add} className="flex gap-3">
          <input
            className={INPUT}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre"
            aria-label="Nombre del nuevo participante"
          />
          <button type="submit" className={`${BUTTON} shrink-0`}>
            Agregar
          </button>
        </form>
      </section>
    </div>
  );
}
