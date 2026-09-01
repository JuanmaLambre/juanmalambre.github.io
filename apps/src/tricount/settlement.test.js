import { test } from "node:test";
import assert from "node:assert/strict";
import { computeBalances, settleDebts, splitExpense } from "./settlement.js";
import { equalPercents } from "./money.js";

const participants = (...names) => names.map((name) => ({ id: name.toLowerCase(), name }));

const expense = (name, amount, payerId, shares) => ({
  id: name,
  name,
  amount,
  payerId,
  createdAt: 0,
  shares: Object.entries(shares).map(([participantId, percent]) => ({ participantId, percent })),
});

// Same expense split evenly between everybody in the group.
const evenExpense = (name, amount, payerId, group) =>
  expense(
    name,
    amount,
    payerId,
    Object.fromEntries(
      equalPercents(group.length).map((percent, i) => [group[i].id, percent]),
    ),
  );

const total = (parts) => parts.reduce((sum, part) => sum + part.amount, 0);
const balanceOf = (balances, id) =>
  balances.find((entry) => entry.participant.id === id).balance;

test("splitExpense reparte el total exacto entre partes iguales", () => {
  const people = participants("Ana", "Beto", "Caro");
  const parts = splitExpense(evenExpense("Cena", 10000, "ana", people));
  assert.equal(total(parts), 10000);
  assert.deepEqual(
    parts.map((part) => part.amount),
    [3334, 3333, 3333],
  );
});

test("splitExpense no pierde ni inventa centavos aunque no divida justo", () => {
  const people = participants("Ana", "Beto", "Caro");
  for (const amount of [1, 2, 100, 101, 999, 1000, 123457, 99999999]) {
    const parts = splitExpense(evenExpense("Varios", amount, "ana", people));
    assert.equal(total(parts), amount, `${amount} centavos no cierran`);
  }
});

test("splitExpense respeta porcentajes distintos", () => {
  const parts = splitExpense(expense("Super", 10000, "ana", { ana: 70, beto: 30 }));
  assert.deepEqual(parts, [
    { participantId: "ana", amount: 7000 },
    { participantId: "beto", amount: 3000 },
  ]);
});

test("splitExpense manda el sobrante del redondeo a la parte mas grande", () => {
  // 70% y 30% de 5555 redondean para arriba y se pasan por un centavo.
  const parts = splitExpense(expense("Super", 5555, "ana", { ana: 70, beto: 30 }));
  assert.equal(total(parts), 5555);
  assert.deepEqual(parts, [
    { participantId: "ana", amount: 3888 },
    { participantId: "beto", amount: 1667 },
  ]);
});

test("splitExpense reparte proporcionalmente si los porcentajes no suman 100", () => {
  const parts = splitExpense(expense("Nafta", 30000, "ana", { ana: 2, beto: 1 }));
  assert.equal(total(parts), 30000);
  assert.deepEqual(parts, [
    { participantId: "ana", amount: 20000 },
    { participantId: "beto", amount: 10000 },
  ]);
});

test("splitExpense reparte proporcionalmente si los porcentajes pasan de 100", () => {
  const parts = splitExpense(expense("Cena", 9000, "ana", { ana: 60, beto: 60, caro: 30 }));
  assert.equal(total(parts), 9000);
  assert.deepEqual(parts, [
    { participantId: "ana", amount: 3600 },
    { participantId: "beto", amount: 3600 },
    { participantId: "caro", amount: 1800 },
  ]);
});

test("splitExpense de un solo participante le carga todo", () => {
  const parts = splitExpense(expense("Taxi", 4321, "ana", { ana: 100 }));
  assert.deepEqual(parts, [{ participantId: "ana", amount: 4321 }]);
});

test("splitExpense sin porcentajes utiles no reparte nada", () => {
  assert.deepEqual(splitExpense(expense("Vacio", 1000, "ana", {})), []);
  assert.deepEqual(splitExpense(expense("Ceros", 1000, "ana", { ana: 0, beto: 0 })), []);
});

test("el que paga y no consume queda acreedor por todo", () => {
  const group = {
    participants: participants("Ana", "Beto", "Caro"),
    expenses: [expense("Regalo", 3000, "ana", { beto: 50, caro: 50 })],
  };
  const balances = computeBalances(group);
  assert.equal(balanceOf(balances, "ana"), 3000);
  assert.equal(balanceOf(balances, "beto"), -1500);
  assert.equal(balanceOf(balances, "caro"), -1500);
});

test("el que paga y tambien consume queda acreedor por la diferencia", () => {
  const people = participants("Ana", "Beto");
  const group = { participants: people, expenses: [evenExpense("Cena", 10000, "ana", people)] };
  const balances = computeBalances(group);
  assert.equal(balanceOf(balances, "ana"), 5000);
  assert.equal(balanceOf(balances, "beto"), -5000);
});

test("los gastos cruzados se compensan entre si", () => {
  const people = participants("Ana", "Beto");
  const group = {
    participants: people,
    expenses: [
      evenExpense("Cena", 10000, "ana", people),
      evenExpense("Super", 6000, "beto", people),
    ],
  };
  const balances = computeBalances(group);
  assert.equal(balanceOf(balances, "ana"), 2000);
  assert.equal(balanceOf(balances, "beto"), -2000);
});

test("un participante sin gastos queda en cero", () => {
  const group = {
    participants: participants("Ana", "Beto", "Caro"),
    expenses: [expense("Cafe", 1000, "ana", { ana: 50, beto: 50 })],
  };
  assert.equal(balanceOf(computeBalances(group), "caro"), 0);
});

test("los saldos de un grupo siempre suman cero", () => {
  const people = participants("Ana", "Beto", "Caro", "Dani");
  const group = {
    participants: people,
    expenses: [
      evenExpense("Cena", 12345, "ana", people),
      expense("Nafta", 8000, "beto", { ana: 40, beto: 35, caro: 25 }),
      expense("Hotel", 99991, "caro", { ana: 25, beto: 25, caro: 25, dani: 25 }),
      expense("Peaje", 777, "dani", { dani: 100 }),
    ],
  };
  const balances = computeBalances(group);
  assert.equal(balances.reduce((sum, entry) => sum + entry.balance, 0), 0);
});

test("un grupo saldado no necesita transferencias", () => {
  const people = participants("Ana", "Beto");
  const group = {
    participants: people,
    expenses: [
      evenExpense("Cena", 5000, "ana", people),
      evenExpense("Super", 5000, "beto", people),
    ],
  };
  assert.deepEqual(settleDebts(computeBalances(group)), []);
  assert.deepEqual(settleDebts(computeBalances({ participants: people, expenses: [] })), []);
});

test("settleDebts arma la transferencia obvia entre dos personas", () => {
  const people = participants("Ana", "Beto");
  const group = { participants: people, expenses: [evenExpense("Cena", 10000, "ana", people)] };
  const transfers = settleDebts(computeBalances(group));
  assert.equal(transfers.length, 1);
  assert.equal(transfers[0].from.name, "Beto");
  assert.equal(transfers[0].to.name, "Ana");
  assert.equal(transfers[0].amount, 5000);
});

test("el deudor mas grande le paga al acreedor mas grande", () => {
  const group = {
    participants: participants("Ana", "Beto", "Caro"),
    // Ana pone todo y solo consumen Beto y Caro, en 75/25.
    expenses: [expense("Viaje", 40000, "ana", { beto: 75, caro: 25 })],
  };
  const transfers = settleDebts(computeBalances(group));
  assert.deepEqual(
    transfers.map((transfer) => [transfer.from.name, transfer.to.name, transfer.amount]),
    [
      ["Beto", "Ana", 30000],
      ["Caro", "Ana", 10000],
    ],
  );
});

test("una deuda se puede partir entre dos acreedores", () => {
  const group = {
    participants: participants("Ana", "Beto", "Caro"),
    expenses: [
      expense("Cena", 6000, "ana", { caro: 100 }),
      expense("Super", 4000, "beto", { caro: 100 }),
    ],
  };
  const transfers = settleDebts(computeBalances(group));
  assert.equal(transfers.length, 2);
  assert.ok(transfers.every((transfer) => transfer.from.name === "Caro"));
  assert.equal(transfers.reduce((sum, transfer) => sum + transfer.amount, 0), 10000);
});

// Deterministic PRNG so a failing case can be replayed by its seed.
function randomFromSeed(seed) {
  let state = seed;
  return (max) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % max;
  };
}

test("cualquier grupo al azar queda a mano despues de las transferencias", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const random = randomFromSeed(seed);
    const people = participants("Ana", "Beto", "Caro", "Dani", "Eli").slice(0, 2 + random(4));
    const expenses = Array.from({ length: 1 + random(6) }, (unused, i) => {
      const payer = people[random(people.length)];
      // Un subconjunto no vacio del grupo, con porcentajes al azar.
      const sharers = people.filter(() => random(2) === 0);
      if (sharers.length === 0) sharers.push(people[random(people.length)]);
      const weights = sharers.map(() => 1 + random(9));
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      return expense(
        `Gasto ${i}`,
        1 + random(500000),
        payer.id,
        Object.fromEntries(
          sharers.map((person, j) => [person.id, (weights[j] * 100) / totalWeight]),
        ),
      );
    });

    const group = { participants: people, expenses };
    const balances = computeBalances(group);
    const context = `seed ${seed}`;

    // Cada gasto se reparte entero, asi que el grupo no gana ni pierde plata.
    assert.equal(balances.reduce((sum, entry) => sum + entry.balance, 0), 0, context);

    const transfers = settleDebts(balances);
    assert.ok(transfers.length <= people.length - 1, `${context}: demasiadas transferencias`);
    assert.ok(transfers.every((transfer) => transfer.amount > 0), `${context}: transferencia vacia`);

    // Aplicar las transferencias deja a todo el mundo en cero.
    const settled = new Map(balances.map((entry) => [entry.participant.id, entry.balance]));
    for (const transfer of transfers) {
      settled.set(transfer.from.id, settled.get(transfer.from.id) + transfer.amount);
      settled.set(transfer.to.id, settled.get(transfer.to.id) - transfer.amount);
    }
    for (const [id, balance] of settled) assert.equal(balance, 0, `${context}: ${id} quedo en ${balance}`);
  }
});
