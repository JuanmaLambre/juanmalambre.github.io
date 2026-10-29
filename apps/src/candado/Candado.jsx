import { useEffect, useRef, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Layout } from "../shared/Layout";
import { DIFFICULTIES } from "./puzzle";
import { createSeed, resolveSeed, resolveSettings, syncUrl } from "./seed";
import { SettingsDialog } from "./SettingsDialog";

const BUTTON = "rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover";
const PRIMARY_BUTTON =
  "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40";
const DIGIT_BOX =
  "flex size-9 items-center justify-center rounded-lg border font-mono text-lg sm:size-12 sm:text-2xl";

const EXACT_DOT = "text-primary";
const MISPLACED_DOT = "text-amber-300";

// Builds the puzzle in a worker; null while it is being generated.
function usePuzzle(seed, settings) {
  const key = `${seed}:${settings.digits}:${settings.difficulty}`;
  const [result, setResult] = useState(null);

  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    worker.onmessage = ({ data }) => setResult({ key, puzzle: data });
    worker.postMessage({ seed, settings });
    return () => worker.terminate();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps -- the key covers seed and settings

  return result?.key === key ? result.puzzle : null;
}

function Digits({ number, className = "border-border bg-surface" }) {
  return (
    <div className="flex gap-1 sm:gap-1.5">
      {[...number].map((digit, i) => (
        <span key={i} className={`${DIGIT_BOX} ${className}`}>
          {digit}
        </span>
      ))}
    </div>
  );
}

function Count({ value, label, dotClassName }) {
  return (
    <span className={`flex items-center gap-1.5 whitespace-nowrap ${value === 0 ? "text-muted" : ""}`}>
      <span className={value === 0 ? "" : dotClassName}>●</span>
      <span className="w-3 text-right font-mono font-semibold">{value}</span> {label}
    </span>
  );
}

function Clue({ clue }) {
  return (
    <li className="flex items-center gap-4">
      <Digits number={clue.number} />
      <div className="flex flex-col text-sm">
        <Count value={clue.exact} label="bien" dotClassName={EXACT_DOT} />
        <Count value={clue.misplaced} label="mal" dotClassName={MISPLACED_DOT} />
      </div>
    </li>
  );
}

function Legend() {
  return (
    <p className="mb-5 text-center text-sm text-muted">
      <span className={EXACT_DOT}>●</span> bien ubicados · <span className={MISPLACED_DOT}>●</span> están pero mal
      ubicados
    </p>
  );
}

// One cell per digit, so the answer can be worked out a digit at a time and in
// any order: typing moves to the next cell, Backspace on an empty cell goes
// back, the arrows move around, and pasting fills from the current cell on.
function GuessForm({ digits, onGuess }) {
  const [cells, setCells] = useState(() => Array(digits).fill(""));
  const inputs = useRef([]);
  const filled = cells.filter(Boolean);
  const isRepeated = (digit) => digit !== "" && cells.indexOf(digit) !== cells.lastIndexOf(digit);
  const repeated = cells.some(isRepeated);

  const focus = (index) => inputs.current[Math.max(0, Math.min(digits - 1, index))]?.select();

  const fill = (index, typed) => {
    const newDigits = [...typed.replace(/\D/g, "")].slice(0, digits - index);
    setCells((current) => current.map((cell, i) => (i >= index && i < index + newDigits.length ? newDigits[i - index] : cell)));
    if (newDigits.length > 0) focus(index + newDigits.length);
  };

  const change = (index, value) => {
    if (value === "") return setCells((current) => current.with(index, ""));
    // Typing into a cell that already holds a digit leaves both, on either side
    // of the caret: keep the one that is new.
    const typed = [...value.replace(/\D/g, "")].find((digit) => digit !== cells[index]) ?? value.slice(-1);
    if (/\d/.test(typed)) fill(index, typed);
  };

  const keyDown = (index, event) => {
    if (event.key === "Backspace" && cells[index] === "") {
      event.preventDefault();
      setCells((current) => current.with(Math.max(0, index - 1), ""));
      focus(index - 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focus(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focus(index + 1);
    }
  };

  const paste = (index, event) => {
    event.preventDefault();
    fill(index, event.clipboardData.getData("text"));
  };

  const submit = (event) => {
    event.preventDefault();
    if (filled.length === digits && !repeated) onGuess(cells.join(""));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <div className="flex gap-1 sm:gap-1.5">
          {cells.map((cell, i) => (
            <input
              key={i}
              ref={(input) => {
                inputs.current[i] = input;
              }}
              aria-label={`Dígito ${i + 1}`}
              inputMode="numeric"
              autoComplete="off"
              autoFocus={i === 0}
              value={cell}
              onChange={(event) => change(i, event.target.value)}
              onKeyDown={(event) => keyDown(i, event)}
              onPaste={(event) => paste(i, event)}
              onFocus={(event) => event.target.select()}
              className={`${DIGIT_BOX} bg-background text-center caret-transparent outline-none selection:bg-transparent focus:border-primary ${
                isRepeated(cell) ? "border-amber-300 text-amber-300" : "border-border"
              }`}
            />
          ))}
        </div>
        <button type="submit" className={PRIMARY_BUTTON} disabled={filled.length !== digits || repeated}>
          Probar
        </button>
      </div>
      {repeated && <p className="text-sm text-amber-300">Los dígitos no se repiten.</p>}
    </form>
  );
}

// The play area for one puzzle; mount it with a `key` per puzzle so the
// guesses start over with each new one. The clues, the answer cells and the
// solution share a left edge, so each digit lines up with the ones above it.
function Game({ puzzle, digits, onNewGame }) {
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [outcome, setOutcome] = useState(null);

  const guess = (value) => {
    if (value === puzzle.secret) setOutcome("solved");
    else setWrongGuesses((current) => [value, ...current.filter((other) => other !== value)]);
  };

  return (
    <div>
      <Legend />
      <div className="mx-auto w-fit">
        <ol className="flex flex-col gap-3">
          {puzzle.clues.map((clue) => (
            <Clue key={clue.number} clue={clue} />
          ))}
        </ol>

        <div className="mt-8 flex min-h-28 flex-col items-start gap-3">
          {outcome ? (
            <>
              <div className="flex items-center gap-4">
                <Digits
                  number={puzzle.secret}
                  className={outcome === "solved" ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface"}
                />
                <p className="text-sm">{outcome === "solved" ? "¡Abriste el candado!" : "Era este número."}</p>
              </div>
              <button onClick={onNewGame} className={PRIMARY_BUTTON}>
                Otro número
              </button>
            </>
          ) : (
            <>
              <GuessForm digits={digits} onGuess={guess} />
              {wrongGuesses.length > 0 && (
                <p className="text-sm text-muted">
                  No es <span className="font-mono">{wrongGuesses.join(", ")}</span>.
                </p>
              )}
              <button onClick={() => setOutcome("revealed")} className="text-xs text-muted hover:text-foreground">
                Ver la solución
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const difficultyLabel = (id) => DIFFICULTIES.find((difficulty) => difficulty.id === id).label;

export function Candado() {
  const [seed, setSeed] = useState(resolveSeed);
  const [settings, setSettings] = useState(resolveSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const puzzle = usePuzzle(seed, settings);

  useEffect(() => syncUrl(seed, settings), [seed, settings]);

  const newGame = () => setSeed(createSeed());

  const applySettings = (next) => {
    setSettings(next);
    setSettingsOpen(false);
  };

  return (
    <Layout
      title="Candado"
      subtitle={`${settings.digits} dígitos distintos · ${difficultyLabel(settings.difficulty)}`}
    >
      {puzzle ? (
        <Game key={`${seed}:${settings.digits}:${settings.difficulty}`} puzzle={puzzle} digits={settings.digits} onNewGame={newGame} />
      ) : (
        <p className="py-24 text-center text-sm text-muted">Generando pistas…</p>
      )}

      <div className="mt-12 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <button onClick={newGame} className={BUTTON}>
            Nuevo número
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            title="Configuración"
            aria-label="Configuración"
            className="rounded-lg border border-border p-2 text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <Cog6ToothIcon className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">seed: {seed}</p>
      </div>

      {settingsOpen && (
        <SettingsDialog settings={settings} onApply={applySettings} onClose={() => setSettingsOpen(false)} />
      )}
    </Layout>
  );
}
