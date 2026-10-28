import { test } from "node:test";
import assert from "node:assert/strict";
import { computeBill, settleDebts, splitEvenly } from "./bill.js";

const participants = (...names) => names.map((name) => ({ id: name.toLowerCase(), name }));
const people = participants("Ana", "Beto", "Caro");

const extra = (name, amount, participantIds) => ({ id: name, name, amount, participantIds });

const bill = (total, payments = {}, extras = []) => computeBill({ participants: people, total, payments, extras });

const owesOf = (result, id) => result.people.find((person) => person.participant.id === id).owes;
const sum = (values) => values.reduce((a, b) => a + b, 0);

test("splitEvenly reparte sin perder centavos", () => {
  assert.deepEqual([...splitEvenly(10000, ["a", "b", "c"]).values()], [3334, 3333, 3333]);
  for (const amount of [1, 2, 100, 101, 999, 123457, 99999999]) {
    for (let count = 1; count <= 7; count++) {
      const ids = Array.from({ length: count }, (unused, i) => String(i));
      assert.equal(sum([...splitEvenly(amount, ids).values()]), amount, `${amount} entre ${count}`);
    }
  }
});

test("splitEvenly sin nadie no reparte nada", () => {
  assert.equal(splitEvenly(1000, []).size, 0);
});

test("sin participantes o sin total todavia no hay cuenta", () => {
  assert.equal(computeBill({ participants: [], total: 1000, payments: {}, extras: [] }), null);
  assert.equal(bill(null), null);
});

test("sin gastos grupales el total se divide en partes iguales", () => {
  const result = bill(9000);
  assert.deepEqual(
    people.map((person) => owesOf(result, person.id)),
    [3000, 3000, 3000],
  );
  assert.equal(result.common, 9000);
});

test("un gasto grupal lo pagan solo los que participan", () => {
  // 100 mil de cuenta, 30 mil de cervezas entre Ana y Beto.
  const result = bill(10000000, {}, [extra("Cervezas", 3000000, ["ana", "beto"])]);
  assert.equal(result.common, 7000000);
  assert.equal(owesOf(result, "ana"), 2333334 + 1500000);
  assert.equal(owesOf(result, "beto"), 2333333 + 1500000);
  assert.equal(owesOf(result, "caro"), 2333333);
  assert.equal(sum(result.people.map((person) => person.owes)), 10000000);
});

test("el desglose muestra la parte comun y cada gasto grupal", () => {
  const result = bill(9000, {}, [extra("Vino", 2000, ["ana"])]);
  const ana = result.people.find((person) => person.participant.id === "ana");
  const caro = result.people.find((person) => person.participant.id === "caro");
  assert.deepEqual(ana.breakdown, [
    { name: "Parte común", amount: 2334 },
    { name: "Vino", amount: 2000 },
  ]);
  assert.deepEqual(caro.breakdown, [{ name: "Parte común", amount: 2333 }]);
});

test("un gasto grupal puede ser todo el total", () => {
  const result = bill(6000, {}, [extra("Todo", 6000, ["ana", "beto"])]);
  assert.equal(result.common, 0);
  assert.equal(owesOf(result, "caro"), 0);
  assert.deepEqual(result.people.find((person) => person.participant.id === "caro").breakdown, []);
});

test("los gastos grupales no pueden pasarse del total", () => {
  const result = bill(5000, {}, [extra("Cervezas", 3000, ["ana"]), extra("Postre", 2001, ["beto"])]);
  assert.ok(result.error);
});

test("un gasto grupal sin participantes vigentes lo pagan todos", () => {
  const result = bill(9000, {}, [extra("Picada", 3000, ["dani"])]);
  assert.deepEqual(
    people.map((person) => owesOf(result, person.id)),
    [3000, 3000, 3000],
  );
});

test("unpaid avisa cuanto falta o sobra de los pagos", () => {
  assert.equal(bill(9000).unpaid, 9000);
  assert.equal(bill(9000, { ana: 5000 }).unpaid, 4000);
  assert.equal(bill(9000, { ana: 5000, beto: 4000 }).unpaid, 0);
  assert.equal(bill(9000, { ana: 10000 }).unpaid, -1000);
});

test("el que paga todo queda acreedor por lo que no consumio", () => {
  const result = bill(9000, { ana: 9000 });
  assert.deepEqual(
    settleDebts(result.balances).map((transfer) => [transfer.from.name, transfer.to.name, transfer.amount]),
    [
      ["Beto", "Ana", 3000],
      ["Caro", "Ana", 3000],
    ],
  );
});

test("si cada uno pago lo suyo no hay transferencias", () => {
  const result = bill(9000, { ana: 3000, beto: 3000, caro: 3000 });
  assert.deepEqual(settleDebts(result.balances), []);
});

test("una deuda se puede partir entre dos acreedores", () => {
  const result = bill(9000, { ana: 4500, beto: 4500 }, [extra("Todo", 9000, ["caro"])]);
  const transfers = settleDebts(result.balances);
  assert.equal(transfers.length, 2);
  assert.ok(transfers.every((transfer) => transfer.from.name === "Caro"));
  assert.equal(sum(transfers.map((transfer) => transfer.amount)), 9000);
});

// Deterministic PRNG so a failing case can be replayed by its seed.
function randomFromSeed(seed) {
  let state = seed;
  return (max) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % max;
  };
}

test("cualquier cuenta al azar queda a mano despues de las transferencias", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const random = randomFromSeed(seed);
    const group = participants("Ana", "Beto", "Caro", "Dani", "Eli").slice(0, 1 + random(5));
    const total = 1 + random(10000000);
    const context = `seed ${seed}`;

    // Gastos grupales que entre todos no pasan del total.
    let left = total;
    const extras = Array.from({ length: random(4) }, (unused, i) => {
      const amount = random(left + 1);
      left -= amount;
      const sharers = group.filter(() => random(2) === 0).map((person) => person.id);
      return extra(`Extra ${i}`, amount, sharers);
    });

    // Los pagos cubren exactamente el total, repartidos al azar.
    const payments = {};
    let unpaid = total;
    for (const person of group.slice(0, -1)) {
      const amount = random(unpaid + 1);
      if (amount > 0) payments[person.id] = amount;
      unpaid -= amount;
    }
    payments[group.at(-1).id] = (payments[group.at(-1).id] ?? 0) + unpaid;

    const result = computeBill({ participants: group, total, payments, extras });
    assert.equal(sum(result.people.map((person) => person.owes)), total, `${context}: no reparte el total`);
    assert.equal(result.unpaid, 0, context);
    for (const person of result.people) {
      assert.equal(sum(person.breakdown.map((part) => part.amount)), person.owes, `${context}: desglose`);
    }

    const transfers = settleDebts(result.balances);
    assert.ok(transfers.length <= group.length - 1, `${context}: demasiadas transferencias`);
    const settled = new Map(result.balances.map((entry) => [entry.participant.id, entry.balance]));
    for (const transfer of transfers) {
      settled.set(transfer.from.id, settled.get(transfer.from.id) + transfer.amount);
      settled.set(transfer.to.id, settled.get(transfer.to.id) - transfer.amount);
    }
    for (const [id, balance] of settled) assert.equal(balance, 0, `${context}: ${id} quedo en ${balance}`);
  }
});
