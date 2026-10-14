export const MIN_SIDE = 3;
export const MAX_SIDE = 8;
export const MIN_TEAM_CELLS = 1;
export const MIN_BOMBS = 1;

export const RED = "red";
export const BLUE = "blue";
export const NEUTRAL = "neutral";
export const BOMB = "bomb";

// A board is `team` red + `team` blue + 1 extra cell for the starting team +
// `bombs` bombs, and the rest are neutral. The classic 5x5 board has 8 per team
// and 1 bomb; other sizes default to the same team share (8 of every 25 cells).
const TEAM_SHARE = 8 / 25;
export const DEFAULT_BOMBS = 1;

export const defaultTeamCells = (rows, cols) => Math.round(rows * cols * TEAM_SHARE);

export const neutralCells = ({ rows, cols, team, bombs }) => rows * cols - team * 2 - 1 - bombs;

// Both teams, the extra cell and the bombs have to fit on the board, so each
// count is capped by the others.
export const maxTeamCells = ({ rows, cols, bombs }) => Math.floor((rows * cols - 1 - bombs) / 2);
export const maxBombs = ({ rows, cols, team }) => rows * cols - team * 2 - 1;

export const isValidSettings = (settings) =>
  settings.team >= MIN_TEAM_CELLS && settings.bombs >= MIN_BOMBS && neutralCells(settings) >= 0;

export const DEFAULT_SETTINGS = { rows: 5, cols: 5, team: defaultTeamCells(5, 5), bombs: DEFAULT_BOMBS };

// Deterministic PRNG (mulberry32) so the same seed always rebuilds the same board.
function randomFromSeed(seed) {
  let state = 0;
  for (const char of seed) {
    state = (Math.imul(state ^ char.charCodeAt(0), 2654435761) >>> 0) + 1;
  }
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function buildBoard(seed, settings) {
  const random = randomFromSeed(seed);
  const startingTeam = random() < 0.5 ? RED : BLUE;
  const cells = [
    ...Array(settings.team).fill(RED),
    ...Array(settings.team).fill(BLUE),
    startingTeam,
    ...Array(settings.bombs).fill(BOMB),
    ...Array(neutralCells(settings)).fill(NEUTRAL),
  ];
  return { startingTeam, cells: shuffle(cells, random) };
}
