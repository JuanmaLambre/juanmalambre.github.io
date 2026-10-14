import { useEffect, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Layout } from "../shared/Layout";
import { RED, BLUE, BOMB, NEUTRAL, buildBoard } from "./board";
import { createSeed, resolveSeed, resolveSettings, syncUrl } from "./seed";
import { SettingsDialog } from "./SettingsDialog";

const CELL_STYLES = {
  [RED]: "bg-team-red text-white",
  [BLUE]: "bg-team-blue text-white",
  [NEUTRAL]: "bg-stone-300 text-stone-300",
  [BOMB]: "bg-neutral-950 text-white ring-1 ring-inset ring-neutral-700",
};

const CELL_SYMBOLS = {
  [RED]: "✕",
  [BLUE]: "◯",
  [NEUTRAL]: "",
  [BOMB]: "✴",
};

const CELL_LABELS = {
  [RED]: "Rojo",
  [BLUE]: "Azul",
  [NEUTRAL]: "Neutral",
  [BOMB]: "Bomba",
};

// A marked cell (already guessed) fades to gray so the remaining ones stand out.
const MARKED_STYLE = "opacity-30";

const TEAM_NAMES = { [RED]: "Rojo", [BLUE]: "Azul" };
const TEAM_TEXT_COLORS = { [RED]: "text-team-red-light", [BLUE]: "text-team-blue-light" };

function StartingTeam({ startingTeam }) {
  return (
    <p className={`mb-6 text-center text-lg font-semibold ${TEAM_TEXT_COLORS[startingTeam]}`}>
      Empieza {TEAM_NAMES[startingTeam]}
    </p>
  );
}

export function CodigoSecreto() {
  const [seed, setSeed] = useState(resolveSeed);
  const [settings, setSettings] = useState(resolveSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [marked, setMarked] = useState(() => new Set());
  const { startingTeam, cells } = buildBoard(seed, settings);

  useEffect(() => syncUrl(seed, settings), [seed, settings]);

  const reset = () => {
    setSeed(createSeed());
    setMarked(new Set());
  };

  const applySettings = (next) => {
    setSettings(next);
    setMarked(new Set());
    setSettingsOpen(false);
  };

  const toggleMark = (index) =>
    setMarked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Layout title="Código Secreto">
      <div className="flex flex-col items-center">
        <StartingTeam startingTeam={startingTeam} />

        <div
          className="grid w-full max-w-md gap-2"
          style={{ gridTemplateColumns: `repeat(${settings.cols}, minmax(0, 1fr))` }}
        >
          {cells.map((cell, i) => (
            <button
              key={i}
              type="button"
              title={CELL_LABELS[cell]}
              aria-pressed={marked.has(i)}
              onClick={() => toggleMark(i)}
              className={`flex aspect-square select-none items-center justify-center rounded-lg text-2xl transition ${CELL_STYLES[cell]} ${marked.has(i) ? MARKED_STYLE : ""}`}
            >
              {CELL_SYMBOLS[cell]}
            </button>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-2">
          <button onClick={reset} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover">
            Nuevo tablero
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
