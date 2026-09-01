import { test } from "node:test";
import assert from "node:assert/strict";
import {
  equalPercents,
  formatMoney,
  formatPercent,
  parseMoney,
  parsePercent,
  toAmountInput,
} from "./money.js";

test("parseMoney reads the separators people actually type", () => {
  assert.equal(parseMoney("10"), 1000);
  assert.equal(parseMoney("1234.56"), 123456);
  assert.equal(parseMoney("1234,56"), 123456);
  assert.equal(parseMoney("1.234,56"), 123456);
  assert.equal(parseMoney("12.50"), 1250);
  assert.equal(parseMoney(" 99,9 "), 9990);
});

test("parseMoney rejects anything that is not a positive amount", () => {
  for (const input of ["", "0", "0,00", "-5", "abc", "1,234", "1.2.3", "1e3", ","]) {
    assert.equal(parseMoney(input), null, `deberia rechazar ${JSON.stringify(input)}`);
  }
});

test("parsePercent accepts 0 to 100 with two decimals", () => {
  assert.equal(parsePercent("33.34"), 33.34);
  assert.equal(parsePercent("33,34"), 33.34);
  assert.equal(parsePercent("0"), 0);
  assert.equal(parsePercent("100"), 100);
  for (const input of ["100.01", "-1", "", "abc", "50.123"]) {
    assert.equal(parsePercent(input), null, `deberia rechazar ${JSON.stringify(input)}`);
  }
});

test("equalPercents always adds up to exactly 100", () => {
  for (let count = 1; count <= 50; count++) {
    const percents = equalPercents(count);
    assert.equal(percents.length, count);
    const total = percents.reduce((sum, percent) => sum + percent, 0);
    assert.equal(Math.round(total * 100), 10000, `${count} participantes suman ${total}`);
    // Nobody is off the even share by more than one hundredth of a percent.
    for (const percent of percents) assert.ok(Math.abs(percent - 100 / count) <= 0.01);
  }
});

test("equalPercents splits the known awkward cases", () => {
  assert.deepEqual(equalPercents(1), [100]);
  assert.deepEqual(equalPercents(2), [50, 50]);
  assert.deepEqual(equalPercents(3), [33.34, 33.33, 33.33]);
  assert.deepEqual(equalPercents(4), [25, 25, 25, 25]);
});

test("formatPercent drops the trailing zeros", () => {
  assert.equal(formatPercent(33.3), "33.3");
  assert.equal(formatPercent(50), "50");
  assert.equal(formatPercent(33.34), "33.34");
});

test("toAmountInput round-trips through parseMoney", () => {
  for (const cents of [1, 99, 100, 123456, 999999999]) {
    assert.equal(parseMoney(toAmountInput(cents)), cents);
  }
});

test("formatMoney shows two decimals", () => {
  assert.match(formatMoney(123456), /^\$ 1.234,56$/);
  assert.match(formatMoney(5), /^\$ 0,05$/);
});
