import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BLUE,
  BOMB,
  DEFAULT_BOMBS,
  DEFAULT_SETTINGS,
  MAX_SIDE,
  MIN_SIDE,
  NEUTRAL,
  RED,
  buildBoard,
  defaultTeamCells,
  isValidSettings,
  maxBombs,
  maxTeamCells,
  neutralCells,
} from "./board.js";

const count = (cells, kind) => cells.filter((cell) => cell === kind).length;

test("the default board is the classic 5x5 with 8 cells per team and 1 bomb", () => {
  assert.deepEqual(DEFAULT_SETTINGS, { rows: 5, cols: 5, team: 8, bombs: 1 });
  assert.equal(neutralCells(DEFAULT_SETTINGS), 7);
});

test("the default team size and bombs always fit on the board", () => {
  for (let rows = MIN_SIDE; rows <= MAX_SIDE; rows++) {
    for (let cols = MIN_SIDE; cols <= MAX_SIDE; cols++) {
      const settings = { rows, cols, team: defaultTeamCells(rows, cols), bombs: DEFAULT_BOMBS };
      assert.ok(isValidSettings(settings), `${rows}x${cols}`);
    }
  }
});

test("maxTeamCells and maxBombs fill the board without going over", () => {
  assert.equal(neutralCells({ rows: 5, cols: 5, team: maxTeamCells({ rows: 5, cols: 5, bombs: 1 }), bombs: 1 }), 1);
  assert.equal(neutralCells({ rows: 4, cols: 4, team: maxTeamCells({ rows: 4, cols: 4, bombs: 1 }), bombs: 1 }), 0);
  assert.equal(neutralCells({ rows: 5, cols: 5, team: 8, bombs: maxBombs({ rows: 5, cols: 5, team: 8 }) }), 0);
});

test("isValidSettings rejects boards that overflow or have no bombs", () => {
  assert.equal(isValidSettings({ rows: 3, cols: 3, team: 4, bombs: 1 }), false);
  assert.equal(isValidSettings({ rows: 5, cols: 5, team: 8, bombs: 0 }), false);
});

test("buildBoard fills every cell and gives the starting team one extra", () => {
  const settings = { rows: 4, cols: 6, team: 5, bombs: 3 };
  const { startingTeam, cells } = buildBoard("abc12", settings);
  const otherTeam = startingTeam === RED ? BLUE : RED;
  assert.equal(cells.length, 24);
  assert.equal(count(cells, startingTeam), 6);
  assert.equal(count(cells, otherTeam), 5);
  assert.equal(count(cells, BOMB), 3);
  assert.equal(count(cells, NEUTRAL), 10);
});

test("buildBoard is deterministic for the same seed and settings", () => {
  assert.deepEqual(buildBoard("zz999", DEFAULT_SETTINGS), buildBoard("zz999", DEFAULT_SETTINGS));
});
