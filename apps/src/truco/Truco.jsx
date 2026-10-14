import { useEffect, useState } from "react";
import { homeUrl } from "../shared/apps";
import { Board } from "./Board";
import { MAX_POINTS, clampPoints } from "./score";
import { DEFAULT_NAMES, createState, loadState, saveState } from "./storage";
import "./truco.css";

function TeamSide({ team, defaultName, gameOver, onAdd, onRemove, onRename }) {
  const won = team.points >= MAX_POINTS;
  const label = team.name.trim() || defaultName;

  return (
    <section className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <input
        value={team.name}
        onChange={(event) => onRename(event.target.value)}
        onBlur={() => onRename(label)}
        onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
        maxLength={20}
        aria-label={`Nombre del equipo ${defaultName}`}
        className="truco-name w-full truncate rounded-md bg-transparent px-2 py-1 text-center text-xl outline-none sm:text-2xl"
      />

      <div className="relative flex w-full justify-center">
        <span className={`truco-points text-4xl ${won ? "text-brasa" : ""}`}>{team.points}</span>
        <button
          onClick={onRemove}
          disabled={team.points === 0}
          aria-label={`Sacar un punto a ${label}`}
          className="truco-remove absolute top-1/2 right-0 size-7 -translate-y-1/2 text-lg leading-none"
        >
          −
        </button>
      </div>

      <button
        onClick={onAdd}
        disabled={gameOver}
        aria-label={`Sumar un punto a ${label}`}
        className="truco-tap mt-1 w-full flex-1 rounded-xl py-2"
      >
        <Board points={team.points} />
      </button>
    </section>
  );
}

// Not built on the shared Layout: the whole page is the wooden table, so it
// draws its own header with the same way back home.
export function Truco() {
  const [state, setState] = useState(loadState);

  useEffect(() => saveState(state), [state]);

  const gameOver = state.teams.some((team) => team.points >= MAX_POINTS);

  const updateTeam = (index, change) =>
    setState((current) => ({
      ...current,
      teams: current.teams.map((team, i) => (i === index ? { ...team, ...change(team) } : team)),
    }));

  const clear = () => {
    if (window.confirm("¿Borrar los puntos y volver a los nombres de siempre?")) {
      setState(createState());
    }
  };

  return (
    <div className="truco-table min-h-dvh px-3 py-3 text-crema sm:px-6">
      <header className="mx-auto flex max-w-2xl items-center justify-between gap-4 pb-3">
        <a href={homeUrl()} className="text-sm text-crema/80 hover:text-crema hover:underline">
          ← Volver
        </a>
        <h1 className="truco-title text-3xl">Truco</h1>
        <button onClick={clear} className="truco-chip px-3 py-1.5 text-sm">
          Limpiar
        </button>
      </header>

      <main className="truco-cuero mx-auto flex max-w-2xl gap-2 rounded-2xl p-4 sm:gap-6 sm:p-6">
        {state.teams.map((team, index) => (
          <TeamSide
            key={index}
            team={team}
            defaultName={DEFAULT_NAMES[index]}
            gameOver={gameOver}
            onAdd={() => updateTeam(index, (current) => ({ points: clampPoints(current.points + 1) }))}
            onRemove={() => updateTeam(index, (current) => ({ points: clampPoints(current.points - 1) }))}
            onRename={(name) => updateTeam(index, () => ({ name }))}
          />
        ))}
      </main>
    </div>
  );
}
