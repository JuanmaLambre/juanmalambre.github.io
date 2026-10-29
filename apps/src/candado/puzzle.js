import { randomFromSeed, shuffle } from "../shared/random.js";

export const MIN_DIGITS = 3;
export const MAX_DIGITS = 6;

export const HARD = "dificil";
export const MEDIUM = "medio";
export const EASY = "facil";

// Every clue is needed to pin down the number, so the more clues there are,
// the less each one gives away and the more reasoning it takes.
export const DIFFICULTIES = [
  { id: EASY, label: "Fácil", clues: 2 },
  { id: MEDIUM, label: "Medio", clues: 3 },
  { id: HARD, label: "Difícil", clues: 4 },
];

export const DEFAULT_SETTINGS = { digits: 4, difficulty: MEDIUM };

export const isDifficulty = (value) => DIFFICULTIES.some((difficulty) => difficulty.id === value);
export const isDigitCount = (value) => Number.isInteger(value) && value >= MIN_DIGITS && value <= MAX_DIGITS;

// Clues sampled at each step; the one closest to the planned narrowing is
// kept. The last step needs a clue that finishes the job, which is rarer, so it
// samples more. An attempt can still fail; after a few failures with the same
// secret, a new one is drawn.
const SAMPLE_SIZE = 24;
const LAST_SAMPLE_SIZE = 300;
const ATTEMPTS_PER_SECRET = 8;

// Numbers never repeat a digit (and may start with 0), so every digit of a
// clue is either in the secret or not, and the score is never ambiguous.
// Codes are arrays of digits; `positions[d]` is where digit d sits, or -1.
function positionsOf(code) {
  const positions = new Int8Array(10).fill(-1);
  code.forEach((digit, index) => (positions[digit] = index));
  return positions;
}

// The score packed into a single number, to compare scores cheaply.
function scoreKey(code, positions) {
  let exact = 0;
  let misplaced = 0;
  for (let i = 0; i < code.length; i++) {
    const position = positions[code[i]];
    if (position === i) exact++;
    else if (position >= 0) misplaced++;
  }
  return exact * 16 + misplaced;
}

export function score(secret, guess) {
  const key = scoreKey([...guess].map(Number), positionsOf([...secret].map(Number)));
  return { exact: key >> 4, misplaced: key & 15 };
}

const codesByLength = new Map();

// Every number of `length` distinct digits: 720 for 3 digits, 151200 for 6.
function allCodes(length) {
  if (codesByLength.has(length)) return codesByLength.get(length);
  const codes = [];
  const build = (prefix, used) => {
    if (prefix.length === length) return codes.push(prefix);
    for (let digit = 0; digit < 10; digit++) {
      if (!(used & (1 << digit))) build([...prefix, digit], used | (1 << digit));
    }
  };
  build([], 0);
  codesByLength.set(length, codes);
  return codes;
}

const randomCode = (length, random) => shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], random).slice(0, length);

const sameCode = (a, b) => a.every((digit, i) => digit === b[i]);

// A candidate survives a clue when it would have given the clue the same score
// as the secret did.
function survivors(candidates, clue, secret) {
  const positions = positionsOf(clue);
  const key = scoreKey(secret, positions);
  return candidates.filter((candidate) => scoreKey(candidate, positions) === key);
}

// Picks `count` clues that narrow the candidates down evenly, on a log scale,
// so no clue gives away much more than the others: with C candidates, about
// C^(1 - i/count) are left after clue i, and none after the last. Returns null
// when the last step finds no clue that leaves only the secret.
function evenClues(secret, others, count, random) {
  const clues = [];
  let alive = others;
  for (let step = 1; step <= count; step++) {
    const last = step === count;
    const target = last ? 0 : Math.pow(others.length, 1 - step / count);
    const distance = (left) => Math.abs(Math.log(left + 1) - Math.log(target + 1));
    let best = null;
    for (let i = 0; i < (last ? LAST_SAMPLE_SIZE : SAMPLE_SIZE); i++) {
      const clue = randomCode(secret.length, random);
      if ([secret, ...clues].some((code) => sameCode(code, clue))) continue;
      const left = survivors(alive, clue, secret);
      if (left.length === alive.length) continue;
      if (!best || distance(left.length) < distance(best.left.length)) best = { clue, left };
    }
    if (!best || (last && best.left.length > 0)) return null;
    clues.push(best.clue);
    alive = best.left;
  }
  return clues;
}

// Drops the clues that the others already make unnecessary, so that every clue
// left is needed for the solution to be unique. `failed[i]` has bit j set when
// candidate i contradicts clue j.
function withoutRedundant(clues, secret, others, random) {
  const clueKeys = clues.map((clue) => {
    const positions = positionsOf(clue);
    return { positions, key: scoreKey(secret, positions) };
  });
  const failed = others.map((candidate) =>
    clueKeys.reduce((mask, { positions, key }, j) => (scoreKey(candidate, positions) === key ? mask : mask | (1 << j)), 0),
  );
  let kept = (1 << clues.length) - 1;
  for (const j of shuffle([...clues.keys()], random)) {
    const without = kept & ~(1 << j);
    if (failed.every((mask) => (mask & without) !== 0)) kept = without;
  }
  return clues.filter((_, j) => kept & (1 << j));
}

// Keeps trying until a set of exactly `count` clues comes out where every clue
// is needed. Pruning the redundant ones would leave fewer, so those attempts
// are discarded.
function puzzleWith(digits, count, random) {
  for (;;) {
    const secret = randomCode(digits, random);
    const others = allCodes(digits).filter((code) => !sameCode(code, secret));
    for (let attempt = 0; attempt < ATTEMPTS_PER_SECRET; attempt++) {
      const clues = evenClues(secret, others, count, random);
      if (clues && withoutRedundant(clues, secret, others, random).length === count) return { secret, clues };
    }
  }
}

const asText = (code) => code.join("");

const puzzleCache = new Map();

// Generating takes a while for long numbers, so each puzzle is cached.
export function buildPuzzle(seed, { digits, difficulty }) {
  const cacheKey = `${seed}:${digits}:${difficulty}`;
  if (puzzleCache.has(cacheKey)) return puzzleCache.get(cacheKey);

  const { clues: count } = DIFFICULTIES.find((level) => level.id === difficulty);
  const random = randomFromSeed(cacheKey);
  const { secret, clues } = puzzleWith(digits, count, random);

  const puzzle = {
    secret: asText(secret),
    clues: clues.map((clue) => ({ number: asText(clue), ...score(asText(secret), asText(clue)) })),
  };
  puzzleCache.set(cacheKey, puzzle);
  return puzzle;
}

// Every number that fits all the clues; for a well-built puzzle, only the secret.
export function solutions(clues, digits) {
  return allCodes(digits)
    .map(asText)
    .filter((code) => clues.every((clue) => {
      const { exact, misplaced } = score(code, clue.number);
      return exact === clue.exact && misplaced === clue.misplaced;
    }));
}
