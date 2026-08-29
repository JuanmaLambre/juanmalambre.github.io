import { useEffect, useState } from "react";
import { Layout } from "../shared/Layout";
import { BOARD_SIZE, RED, BLUE, ASSASSIN, NEUTRAL, buildBoard } from "./board";
import { createSeed, resolveSeed, syncUrl } from "./seed";

const CELL_STYLES = {
  [RED]: "bg-team-red text-white",
  [BLUE]: "bg-team-blue text-white",
  [NEUTRAL]: "bg-stone-300 text-stone-300",
  [ASSASSIN]: "bg-neutral-950 text-white ring-1 ring-inset ring-neutral-700",
};

const CELL_SYMBOLS = {
  [RED]: "✕",
  [BLUE]: "◯",
  [NEUTRAL]: "",
  [ASSASSIN]: "✴",
};

const CELL_LABELS = {
  [RED]: "Rojo",
  [BLUE]: "Azul",
  [NEUTRAL]: "Neutral",
  [ASSASSIN]: "Asesino",
};

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
  const { startingTeam, cells } = buildBoard(seed);

  useEffect(() => syncUrl(seed), [seed]);

  const reset = () => setSeed(createSeed());

  return (
    <Layout title="Código Secreto">
      <div className="flex flex-col items-center">
        <StartingTeam startingTeam={startingTeam} />

        <div
          className="grid w-full max-w-md gap-2"
          style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
        >
          {cells.map((cell, i) => (
            <div
              key={i}
              title={CELL_LABELS[cell]}
              className={`flex aspect-square select-none items-center justify-center rounded-lg text-2xl ${CELL_STYLES[cell]}`}
            >
              {CELL_SYMBOLS[cell]}
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover"
          >
            Nuevo tablero
          </button>
          <span className="text-xs text-muted">seed: {seed}</span>
        </div>
      </div>
    </Layout>
  );
}
