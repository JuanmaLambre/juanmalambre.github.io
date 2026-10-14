import { clampPoints } from "./score.js";

const STORAGE_KEY = "truco";
const STORAGE_VERSION = 1;

export const DEFAULT_NAMES = ["Nosotros", "Ellos"];

export const createState = () => ({
  version: STORAGE_VERSION,
  teams: DEFAULT_NAMES.map((name) => ({ name, points: 0 })),
});

// Anything unreadable or written by another version starts a new game.
export function loadState() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (parsed?.version !== STORAGE_VERSION || parsed.teams?.length !== DEFAULT_NAMES.length) {
      return createState();
    }
    return {
      version: STORAGE_VERSION,
      teams: parsed.teams.map((team, index) => ({
        name: typeof team.name === "string" ? team.name : DEFAULT_NAMES[index],
        points: clampPoints(Number.isInteger(team.points) ? team.points : 0),
      })),
    };
  } catch {
    return createState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the game keeps working in memory.
  }
}
