import { DEFAULT_BOMBS, DEFAULT_SETTINGS, MAX_SIDE, MIN_SIDE, defaultTeamCells, isValidSettings } from "./board";

const SEED_PARAM = "seed";
const SIZE_PARAM = "size";
const TEAM_PARAM = "team";
const BOMBS_PARAM = "bombs";
const SEED_LENGTH = 5;
const SEED_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const SEED_PATTERN = new RegExp(`^[0-9a-z]{${SEED_LENGTH}}$`);
const SIZE_PATTERN = /^(\d+)x(\d+)$/;

export function createSeed() {
  let seed = "";
  for (let i = 0; i < SEED_LENGTH; i++) {
    seed += SEED_ALPHABET[Math.floor(Math.random() * SEED_ALPHABET.length)];
  }
  return seed;
}

const asSeed = (value) => {
  const normalized = (value ?? "").trim().toLowerCase();
  return SEED_PATTERN.test(normalized) ? normalized : null;
};

const isSide = (value) => value >= MIN_SIDE && value <= MAX_SIDE;

const asDimensions = (value) => {
  const match = SIZE_PATTERN.exec((value ?? "").trim().toLowerCase());
  if (!match) return null;
  const [rows, cols] = [Number(match[1]), Number(match[2])];
  return isSide(rows) && isSide(cols) ? { rows, cols } : null;
};

const asCount = (value) => (value !== null && /^\d+$/.test(value) ? Number(value) : null);

const searchParam = (name) => new URL(window.location.href).searchParams.get(name);

// The seed and the settings live in the URL: a shared link always rebuilds the
// same board, and a reload keeps the current one. Anything invalid falls back to
// a new seed or the default settings.
export function resolveSeed() {
  return asSeed(searchParam(SEED_PARAM)) ?? createSeed();
}

export function resolveSettings() {
  const dimensions = asDimensions(searchParam(SIZE_PARAM));
  if (!dimensions) return DEFAULT_SETTINGS;
  const defaults = { ...dimensions, team: defaultTeamCells(dimensions.rows, dimensions.cols), bombs: DEFAULT_BOMBS };
  const settings = {
    ...dimensions,
    team: asCount(searchParam(TEAM_PARAM)) ?? defaults.team,
    bombs: asCount(searchParam(BOMBS_PARAM)) ?? defaults.bombs,
  };
  return isValidSettings(settings) ? settings : defaults;
}

// Keeps the URL in sync with the board on screen.
export function syncUrl(seed, { rows, cols, team, bombs }) {
  const url = new URL(window.location.href);
  const params = {
    [SEED_PARAM]: seed,
    [SIZE_PARAM]: `${rows}x${cols}`,
    [TEAM_PARAM]: String(team),
    [BOMBS_PARAM]: String(bombs),
  };
  if (Object.entries(params).every(([name, value]) => url.searchParams.get(name) === value)) return;
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  window.history.replaceState(null, "", url);
}
