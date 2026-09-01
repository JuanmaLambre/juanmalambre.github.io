// The whole database is one localStorage entry. It already holds a list of
// groups even though the UI only shows the active one: adding a group picker
// later is a change in the views, not in the stored shape.
const STORAGE_KEY = "tricount";
const STORAGE_VERSION = 1;

export const createId = () => crypto.randomUUID();

export function createGroup(name = "Mi grupo") {
  return { id: createId(), name, participants: [], expenses: [] };
}

function createState() {
  const group = createGroup();
  return { version: STORAGE_VERSION, activeGroupId: group.id, groups: [group] };
}

// Anything unreadable or written by another version starts from scratch: this
// is a local toy, not a database worth migrating.
export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createState();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== STORAGE_VERSION || !parsed.groups?.length) return createState();
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

export const activeGroup = (state) =>
  state.groups.find((group) => group.id === state.activeGroupId) ?? state.groups[0];
