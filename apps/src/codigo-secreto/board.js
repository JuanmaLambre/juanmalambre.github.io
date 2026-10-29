import { randomFromSeed, shuffle } from "../shared/random.js";

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
