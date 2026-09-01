import { useEffect, useState } from "react";
import { Layout } from "../shared/Layout";
import { BalancesView } from "./BalancesView";
import { ExpensesView } from "./ExpensesView";
import { GroupView } from "./GroupView";
import { activeGroup, createId, loadState, saveState } from "./storage";

const TABS = [
  { id: "gastos", label: "Gastos" },
  { id: "saldos", label: "Saldos" },
  { id: "grupo", label: "Grupo" },
];

function Tabs({ current, onChange }) {
  return (
    <nav className="mb-8 flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${
            tab.id === current
              ? "bg-surface-hover font-medium"
              : "text-muted hover:bg-surface hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export function Tricount() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState(TABS[0].id);

  useEffect(() => saveState(state), [state]);

  const group = activeGroup(state);

  // Every change rewrites the active group and leaves the rest of the state
  // alone, so a group picker would not need to touch these callbacks.
  const updateGroup = (change) =>
    setState((current) => ({
      ...current,
      groups: current.groups.map((candidate) =>
        candidate.id === current.activeGroupId ? { ...candidate, ...change(candidate) } : candidate,
      ),
    }));

  const actions = {
    onAddExpense: (expense) =>
      updateGroup((current) => ({
        expenses: [...current.expenses, { ...expense, id: createId(), createdAt: Date.now() }],
      })),
    onUpdateExpense: (id, expense) =>
      updateGroup((current) => ({
        expenses: current.expenses.map((candidate) =>
          candidate.id === id ? { ...candidate, ...expense } : candidate,
        ),
      })),
    onRemoveExpense: (id) =>
      updateGroup((current) => ({
        expenses: current.expenses.filter((expense) => expense.id !== id),
      })),
    onRenameGroup: (name) => updateGroup(() => ({ name })),
    onClearGroup: () => updateGroup(() => ({ participants: [], expenses: [] })),
    onAddParticipant: (name) =>
      updateGroup((current) => ({
        participants: [...current.participants, { id: createId(), name }],
      })),
    onRenameParticipant: (id, name) =>
      updateGroup((current) => ({
        participants: current.participants.map((participant) =>
          participant.id === id ? { ...participant, name } : participant,
        ),
      })),
    onRemoveParticipant: (id) =>
      updateGroup((current) => ({
        participants: current.participants.filter((participant) => participant.id !== id),
      })),
  };

  return (
    <Layout title="Tricount" subtitle={group.name}>
      <Tabs current={tab} onChange={setTab} />
      {tab === "gastos" && <ExpensesView group={group} {...actions} />}
      {tab === "saldos" && <BalancesView group={group} />}
      {tab === "grupo" && <GroupView group={group} {...actions} />}
    </Layout>
  );
}
