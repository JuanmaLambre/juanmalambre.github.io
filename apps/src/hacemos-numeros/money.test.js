import { test } from "node:test";
import assert from "node:assert/strict";
import { formatAmountInput, formatMoney, parseMoney, toAmountInput } from "./money.js";

test("parseMoney reads the separators people actually type", () => {
  assert.equal(parseMoney("10"), 1000);
  assert.equal(parseMoney("1234.56"), 123456);
  assert.equal(parseMoney("1234,56"), 123456);
  assert.equal(parseMoney("1.234,56"), 123456);
  assert.equal(parseMoney("12.50"), 1250);
  assert.equal(parseMoney(" 99,9 "), 9990);
  assert.equal(parseMoney("1.234"), 123400);
  assert.equal(parseMoney("1.234.567"), 123456700);
});

test("parseMoney rejects anything that is not a positive amount", () => {
  for (const input of ["", "0", "0,00", "-5", "abc", "1,234", "1.2.3", "1e3", ","]) {
    assert.equal(parseMoney(input), null, `deberia rechazar ${JSON.stringify(input)}`);
  }
});

test("toAmountInput round-trips through parseMoney", () => {
  for (const cents of [1, 99, 100, 123456, 999999999]) {
    assert.equal(parseMoney(toAmountInput(cents)), cents);
  }
});

test("toAmountInput skips the decimals of whole amounts", () => {
  assert.equal(toAmountInput(123400), "1.234");
  assert.equal(toAmountInput(123456), "1.234,56");
  assert.equal(toAmountInput(5), "0,05");
});

test("formatAmountInput adds the thousands dots while typing", () => {
  const cases = {
    "": "",
    "1234": "1.234",
    "1.2345": "12.345",
    "1.23": "123",
    "1234567": "1.234.567",
    "1234,5": "1.234,5",
    "1234,567": "1.234,56",
    "1234,": "1.234,",
    "1234.": "1.234,",
    ",5": "0,5",
    "007": "7",
    "1,2,3": "1,23",
    "$ 12a3": "123",
  };
  for (const [typed, expected] of Object.entries(cases)) {
    assert.equal(formatAmountInput(typed), expected, `para ${JSON.stringify(typed)}`);
  }
});

test("formatMoney shows two decimals unless the amount is whole", () => {
  assert.match(formatMoney(123456), /^\$ 1.234,56$/);
  assert.match(formatMoney(5), /^\$ 0,05$/);
  assert.match(formatMoney(123450), /^\$ 1.234,50$/);
  assert.match(formatMoney(123400), /^\$ 1.234$/);
});
