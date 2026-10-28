import { useState, useRef } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { BUTTON, ICON_BUTTON, INPUT } from "./ui";

export function Participants({ participants, onAdd, onRename, onRemove }) {
  const nameInputRef = useRef();
  const [name, setName] = useState("");

  const add = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    nameInputRef.current?.focus();
  };

  return (
    <>
      {participants.length > 0 && (
        <ul className="mb-4 divide-y divide-border rounded-xl border border-border bg-surface">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center gap-3 px-3 py-2">
              <input
                className="flex-1 rounded-lg bg-transparent px-1 py-1 text-sm outline-none focus:bg-background"
                aria-label={`Nombre de ${participant.name}`}
                value={participant.name}
                onChange={(event) => onRename(participant.id, event.target.value)}
              />
              <button
                className={`${ICON_BUTTON} hover:text-rose-400`}
                aria-label={`Borrar a ${participant.name}`}
                title="Borrar"
                onClick={() => onRemove(participant.id)}
              >
                <TrashIcon className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="flex gap-3">
        <input
          ref={nameInputRef}
          className={INPUT}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre"
          aria-label="Nombre del nuevo participante"
          autoFocus={participants.length === 0}
        />
        <button type="submit" className={`${BUTTON} shrink-0`}>
          Agregar
        </button>
      </form>
    </>
  );
}
