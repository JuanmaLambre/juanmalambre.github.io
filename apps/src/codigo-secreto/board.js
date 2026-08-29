export const BOARD_SIZE = 5;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

export const RED = "red";
export const BLUE = "blue";
export const NEUTRAL = "neutral";
export const ASSASSIN = "assassin";

// A board is 8 red + 8 blue + 1 extra cell for the starting team + 1 assassin,
// and the rest are neutral.
const BASE_TEAM_CELLS = 8;
const ASSASSIN_CELLS = 1;
const NEUTRAL_CELLS = CELL_COUNT - BASE_TEAM_CELLS * 2 - 1 - ASSASSIN_CELLS;

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

export function buildBoard(seed) {
  const random = randomFromSeed(seed);
  const startingTeam = random() < 0.5 ? RED : BLUE;
  const cells = [
    ...Array(BASE_TEAM_CELLS).fill(RED),
    ...Array(BASE_TEAM_CELLS).fill(BLUE),
    startingTeam,
    ...Array(ASSASSIN_CELLS).fill(ASSASSIN),
    ...Array(NEUTRAL_CELLS).fill(NEUTRAL),
  ];
  return { startingTeam, cells: shuffle(cells, random) };
}
