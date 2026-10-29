import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFFICULTIES, EASY, HARD, MAX_DIGITS, MEDIUM, MIN_DIGITS, buildPuzzle, score, solutions } from "./puzzle.js";

const SEEDS = ["abc12", "zz999", "00000", "k3j4h"];

test("score counts digits in the right place and digits elsewhere", () => {
  assert.deepEqual(score("856", "658"), { exact: 1, misplaced: 2 });
  assert.deepEqual(score("856", "678"), { exact: 0, misplaced: 2 });
  assert.deepEqual(score("1234", "5678"), { exact: 0, misplaced: 0 });
  assert.deepEqual(score("1234", "1234"), { exact: 4, misplaced: 0 });
});

test("the secret has the requested length and no repeated digits", () => {
  for (let digits = MIN_DIGITS; digits <= MAX_DIGITS; digits++) {
    const { secret } = buildPuzzle("abc12", { digits, difficulty: HARD });
    assert.equal(secret.length, digits);
    assert.equal(new Set(secret).size, digits);
  }
});

test("the clues of every level leave the secret as the only solution", () => {
  for (const digits of [3, 4]) {
    for (const seed of SEEDS) {
      for (const { id } of DIFFICULTIES) {
        const { secret, clues } = buildPuzzle(seed, { digits, difficulty: id });
        assert.deepEqual(solutions(clues, digits), [secret], `${seed} ${digits} ${id}`);
      }
    }
  }
});

test("easy, medium and hard give 2, 3 and 4 clues", () => {
  const counts = { [EASY]: 2, [MEDIUM]: 3, [HARD]: 4 };
  for (const digits of [3, 4]) {
    for (const [difficulty, count] of Object.entries(counts)) {
      assert.equal(buildPuzzle("abc12", { digits, difficulty }).clues.length, count, `${digits} ${difficulty}`);
    }
  }
});

test("every clue is needed for the solution to be unique", () => {
  for (const seed of SEEDS) {
    for (const { id } of DIFFICULTIES) {
      const { clues } = buildPuzzle(seed, { digits: 4, difficulty: id });
      clues.forEach((_, i) => {
        const others = clues.filter((_, j) => j !== i);
        assert.ok(solutions(others, 4).length > 1, `${seed} ${id}: clue ${i} is redundant`);
      });
    }
  }
});

test("buildPuzzle is deterministic for the same seed and settings", () => {
  const settings = { digits: 4, difficulty: MEDIUM };
  assert.deepEqual(buildPuzzle("zz999", settings), structuredClone(buildPuzzle("zz999", settings)));
});
