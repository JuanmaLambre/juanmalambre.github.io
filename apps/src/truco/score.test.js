import { test } from "node:test";
import assert from "node:assert/strict";
import { clampPoints, groups } from "./score.js";

test("clampPoints keeps the score between 0 and 30", () => {
  assert.equal(clampPoints(-1), 0);
  assert.equal(clampPoints(17), 17);
  assert.equal(clampPoints(31), 30);
});

test("groups fills the squares five sticks at a time", () => {
  assert.deepEqual(groups(0), [0, 0, 0, 0, 0, 0]);
  assert.deepEqual(groups(7), [5, 2, 0, 0, 0, 0]);
  assert.deepEqual(groups(15), [5, 5, 5, 0, 0, 0]);
  assert.deepEqual(groups(16), [5, 5, 5, 1, 0, 0]);
  assert.deepEqual(groups(30), [5, 5, 5, 5, 5, 5]);
});
