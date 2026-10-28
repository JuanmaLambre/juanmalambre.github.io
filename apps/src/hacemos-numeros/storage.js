// The whole bill is one localStorage entry. The total and the payments are kept
// as typed, so a half-typed "1.234," survives a reload; they are parsed when
// the bill is computed.
const STORAGE_KEY = "hacemos-numeros";
const STORAGE_VERSION = 1;

export const createId = () => crypto.randomUUID();

export const createState = (participants = []) => ({
  version: STORAGE_VERSION,
  participants,
  total: "",
  payments: {},
  extras: [],
});

// Anything unreadable or written by another version starts a new bill.
export function loadState() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (parsed?.version !== STORAGE_VERSION || !Array.isArray(parsed.participants)) return createState();
    return parsed;
  } catch {
    return createState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the session keeps working in memory.
  }
}
