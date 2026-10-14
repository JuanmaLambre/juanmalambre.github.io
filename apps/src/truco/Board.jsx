import { GROUP_SIZE, HALF, groups } from "./score";

// The four sides of the square and then the diagonal that closes it, the way
// truco is scored on paper. Each stick ends at its head.
const STICKS = [
  [16, 12, 84, 12],
  [88, 16, 88, 84],
  [84, 88, 16, 88],
  [12, 84, 12, 16],
  [24, 24, 76, 76],
];

const SQUARES_PER_HALF = HALF / GROUP_SIZE;

function Match({ x1, y1, x2, y2 }) {
  return (
    <g className="truco-match">
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="truco-match-edge" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="truco-match-wood" />
      <circle cx={x2} cy={y2} r={5.5} className="truco-match-head" />
      <circle cx={x2 - 1.5} cy={y2 - 1.5} r={1.6} className="truco-match-shine" />
    </g>
  );
}

function Groove({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className="truco-groove" />;
}

function Square({ lit }) {
  return (
    <svg viewBox="0 0 100 100" className="truco-square" aria-hidden="true">
      {STICKS.map(([x1, y1, x2, y2], stick) => {
        const Stick = stick < lit ? Match : Groove;
        return <Stick key={stick} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </svg>
  );
}

function Half({ squares }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {squares.map((lit, index) => (
        <Square key={index} lit={lit} />
      ))}
    </div>
  );
}

export function Board({ points }) {
  const squares = groups(points);
  return (
    <div className="flex flex-col items-center gap-2">
      <Half squares={squares.slice(0, SQUARES_PER_HALF)} />
      <div className="truco-divider" />
      <Half squares={squares.slice(SQUARES_PER_HALF)} />
    </div>
  );
}
