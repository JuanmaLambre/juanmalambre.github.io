import { DEFAULT_SETTINGS, isDifficulty, isDigitCount } from "./puzzle";

const SEED_PARAM = "seed";
const DIGITS_PARAM = "digitos";
const DIFFICULTY_PARAM = "nivel";
const SEED_LENGTH = 5;
const SEED_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const SEED_PATTERN = new RegExp(`^[0-9a-z]{${SEED_LENGTH}}$`);

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

const asDigits = (value) => (value !== null && /^\d+$/.test(value) && isDigitCount(Number(value)) ? Number(value) : null);

const asDifficulty = (value) => (isDifficulty(value) ? value : null);

const searchParam = (name) => new URL(window.location.href).searchParams.get(name);

// The seed and the settings live in the URL: a shared link always rebuilds the
// same puzzle, and a reload keeps the current one. Anything invalid falls back
// to a new seed or the default settings.
export function resolveSeed() {
  return asSeed(searchParam(SEED_PARAM)) ?? createSeed();
}

export function resolveSettings() {
  return {
    digits: asDigits(searchParam(DIGITS_PARAM)) ?? DEFAULT_SETTINGS.digits,
    difficulty: asDifficulty(searchParam(DIFFICULTY_PARAM)) ?? DEFAULT_SETTINGS.difficulty,
  };
}

// Keeps the URL in sync with the puzzle on screen.
export function syncUrl(seed, { digits, difficulty }) {
  const url = new URL(window.location.href);
  const params = {
    [SEED_PARAM]: seed,
    [DIGITS_PARAM]: String(digits),
    [DIFFICULTY_PARAM]: difficulty,
  };
  if (Object.entries(params).every(([name, value]) => url.searchParams.get(name) === value)) return;
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  window.history.replaceState(null, "", url);
}
