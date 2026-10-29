import { useEffect, useRef, useState } from "react";
import { DIFFICULTIES, EASY, HARD, MAX_DIGITS, MEDIUM, MIN_DIGITS } from "./puzzle";

const LABEL = "mb-1 block text-xs uppercase tracking-wide text-muted";
const INPUT =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const BUTTON = "rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover";
const PRIMARY_BUTTON = "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:opacity-90";

const DIGIT_COUNTS = Array.from({ length: MAX_DIGITS - MIN_DIGITS + 1 }, (_, i) => MIN_DIGITS + i);

const DIFFICULTY_HINTS = {
  [EASY]: "2 pistas que dicen mucho.",
  [MEDIUM]: "3 pistas.",
  [HARD]: "4 pistas que dicen poco cada una.",
};

// Edits a draft of the settings; nothing changes until "Aplicar". Mount it
// only while open: it opens itself as a native modal dialog, which handles
// focus, Escape and the backdrop.
export function SettingsDialog({ settings, onApply, onClose }) {
  const dialog = useRef(null);
  const [draft, setDraft] = useState(settings);

  useEffect(() => dialog.current.showModal(), []);

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

        <label className={LABEL} htmlFor="digits">
          Dígitos
        </label>
        <select
          id="digits"
          className={INPUT}
          value={draft.digits}
          onChange={(event) => update({ digits: Number(event.target.value) })}
        >
          {DIGIT_COUNTS.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>

        <fieldset className="mt-4">
          <legend className={LABEL}>Dificultad</legend>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map(({ id, label }) => (
              <label
                key={id}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm has-focus-visible:ring-2 has-focus-visible:ring-primary ${
                  draft.difficulty === id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-surface-hover"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={id}
                  checked={draft.difficulty === id}
                  onChange={() => update({ difficulty: id })}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-2 text-xs text-muted">{DIFFICULTY_HINTS[draft.difficulty]}</p>

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
