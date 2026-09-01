// Percentages are stored per expense, but the split divides by their sum, so a
// list that does not add up to exactly 100 still spreads the whole amount.
export function splitExpense(expense) {
  const total = expense.shares.reduce((sum, share) => sum + share.percent, 0);
  if (total <= 0) return [];

  const parts = expense.shares.map((share) => ({
    participantId: share.participantId,
    amount: Math.round((expense.amount * share.percent) / total),
  }));

  // The rounding leftover lands on the biggest share so the parts add up to
  // the expense down to the cent.
  const drift = expense.amount - parts.reduce((sum, part) => sum + part.amount, 0);
  if (drift !== 0) {
    const biggest = parts.reduce((a, b) => (b.amount > a.amount ? b : a));
    biggest.amount += drift;
  }
  return parts;
}

// Positive balance: the group owes that participant. Negative: they owe.
export function computeBalances(group) {
  const balances = new Map(group.participants.map((participant) => [participant.id, 0]));
  const add = (id, amount) => {
    if (balances.has(id)) balances.set(id, balances.get(id) + amount);
  };

  for (const expense of group.expenses) {
    add(expense.payerId, expense.amount);
    for (const part of splitExpense(expense)) add(part.participantId, -part.amount);
  }

  return group.participants.map((participant) => ({
    participant,
    balance: balances.get(participant.id),
  }));
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
