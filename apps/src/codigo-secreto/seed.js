const SEED_PARAM = "seed";
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

// The seed lives in the URL: a shared link always rebuilds the same board, and
// a reload keeps the current one. Anything invalid falls back to a new board.
export function resolveSeed() {
  const fromUrl = new URL(window.location.href).searchParams.get(SEED_PARAM);
  return asSeed(fromUrl) ?? createSeed();
}

// Keeps the URL in sync with the board on screen.
export function syncUrl(seed) {
  const url = new URL(window.location.href);
  if (url.searchParams.get(SEED_PARAM) === seed) return;
  url.searchParams.set(SEED_PARAM, seed);
  window.history.replaceState(null, "", url);
}
