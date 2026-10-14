import { useEffect, useRef, useState } from "react";
import {
  MAX_SIDE,
  MIN_BOMBS,
  MIN_SIDE,
  MIN_TEAM_CELLS,
  defaultTeamCells,
  maxBombs,
  maxTeamCells,
  neutralCells,
} from "./board";

const LABEL = "mb-1 block text-xs uppercase tracking-wide text-muted";
const INPUT =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const BUTTON = "rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover";
const PRIMARY_BUTTON = "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:opacity-90";

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const SIDES = range(MIN_SIDE, MAX_SIDE);

const pluralize = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

function NumberSelect({ id, label, value, options, onChange }) {
  return (
    <div>
      <label className={LABEL} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={INPUT} value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// Edits a draft of the settings; nothing changes on the board until "Aplicar".
// Mount it only while open: it opens itself as a native modal dialog, which
// handles focus, Escape and the backdrop.
export function SettingsDialog({ settings, onApply, onClose }) {
  const dialog = useRef(null);
  const [draft, setDraft] = useState(settings);

  useEffect(() => dialog.current.showModal(), []);

  // A new size resets the team count to that size's default, since the old
  // count may not fit or may look off on the new board. The bombs are kept
  // unless they no longer fit.
  const resize = (change) =>
    setDraft((current) => {
      const { rows, cols } = { ...current, ...change };
      const team = defaultTeamCells(rows, cols);
      return { rows, cols, team, bombs: Math.min(current.bombs, maxBombs({ rows, cols, team })) };
    });

  const update = (change) => setDraft((current) => ({ ...current, ...change }));

  const apply = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => event.target === dialog.current && dialog.current.close()}
      className="m-auto w-full max-w-sm rounded-xl border border-border bg-surface p-0 text-foreground backdrop:bg-black/60"
    >
      <form onSubmit={apply} className="p-6">
        <h2 className="mb-5 text-lg font-semibold">Configuración</h2>

        <div className="grid grid-cols-2 gap-4">
          <NumberSelect
            id="rows"
            label="Filas"
            value={draft.rows}
            options={SIDES}
            onChange={(rows) => resize({ rows })}
          />
          <NumberSelect
            id="cols"
            label="Columnas"
            value={draft.cols}
            options={SIDES}
            onChange={(cols) => resize({ cols })}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <NumberSelect
            id="team"
            label="Casillas por equipo"
            value={draft.team}
            options={range(MIN_TEAM_CELLS, maxTeamCells(draft))}
            onChange={(team) => update({ team })}
          />
          <NumberSelect
            id="bombs"
            label="Bombas"
            value={draft.bombs}
            options={range(MIN_BOMBS, maxBombs(draft))}
            onChange={(bombs) => update({ bombs })}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          +1 para el equipo que empieza · {pluralize(draft.bombs, "bomba", "bombas")} ·{" "}
          {pluralize(neutralCells(draft), "neutral", "neutrales")}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className={BUTTON} onClick={() => dialog.current.close()}>
            Cancelar
          </button>
          <button type="submit" className={PRIMARY_BUTTON}>
            Aplicar
          </button>
        </div>
      </form>
    </dialog>
  );
}
