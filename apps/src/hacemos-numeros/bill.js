// Splits an amount in equal parts without losing cents: the leftover cents go
// to the first ones, so $100 between 3 is 33,34 / 33,33 / 33,33.
export function splitEvenly(amount, ids) {
  if (ids.length === 0) return new Map();
  const base = Math.floor(amount / ids.length);
  let leftover = amount - base * ids.length;
  return new Map(ids.map((id) => [id, base + (leftover-- > 0 ? 1 : 0)]));
}

// A group expense whose participants were all removed falls back to everyone:
// its amount is still part of the total and somebody has to pay for it.
const sharersOf = (extra, ids) => {
  const sharers = ids.filter((id) => extra.participantIds.includes(id));
  return sharers.length > 0 ? sharers : ids;
};

// `total` and every amount in `payments` and `extras` are in cents. What is not
// a group expense is the common part, split evenly between everybody. Returns
// null when there is nothing to split yet.
export function computeBill({ participants, total, payments, extras }) {
  if (participants.length === 0 || !total) return null;

  const ids = participants.map((participant) => participant.id);
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.amount, 0);
  if (extrasTotal > total) return { error: "Los gastos grupales suman más que el total." };

  const common = total - extrasTotal;
  const owes = splitEvenly(common, ids);
  const breakdown = new Map(ids.map((id) => [id, [{ name: "Parte común", amount: owes.get(id) }]]));

  for (const extra of extras) {
    for (const [id, amount] of splitEvenly(extra.amount, sharersOf(extra, ids))) {
      owes.set(id, owes.get(id) + amount);
      breakdown.get(id).push({ name: extra.name, amount });
    }
  }

  const paid = ids.reduce((sum, id) => sum + (payments[id] ?? 0), 0);
  const people = participants.map((participant) => ({
    participant,
    owes: owes.get(participant.id),
    paid: payments[participant.id] ?? 0,
    breakdown: breakdown.get(participant.id).filter((part) => part.amount > 0),
  }));

  return {
    common,
    people,
    // Positive: somebody still has to say who paid that much. Negative: the
    // payments go over the total.
    unpaid: total - paid,
    balances: people.map((person) => ({ participant: person.participant, balance: person.paid - person.owes })),
  };
}

// Greedy settlement: the biggest debtor pays the biggest creditor, repeat. It
// is not always the theoretical minimum number of transfers, but it never
// needs more than one per person.
export function settleDebts(balances) {
  const byAmount = (a, b) => b.amount - a.amount;
  const creditors = balances
    .filter((entry) => entry.balance > 0)
    .map((entry) => ({ participant: entry.participant, amount: entry.balance }))
    .sort(byAmount);
  const debtors = balances
    .filter((entry) => entry.balance < 0)
    .map((entry) => ({ participant: entry.participant, amount: -entry.balance }))
    .sort(byAmount);

  const transfers = [];
  let debtor = 0;
  let creditor = 0;
  while (debtor < debtors.length && creditor < creditors.length) {
    const amount = Math.min(debtors[debtor].amount, creditors[creditor].amount);
    transfers.push({ from: debtors[debtor].participant, to: creditors[creditor].participant, amount });
    debtors[debtor].amount -= amount;
    creditors[creditor].amount -= amount;
    if (debtors[debtor].amount === 0) debtor++;
    if (creditors[creditor].amount === 0) creditor++;
  }
  return transfers;
}
