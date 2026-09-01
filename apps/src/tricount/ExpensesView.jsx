import { useState } from "react";
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useShortcut } from "../shared/useShortcut";
import { ExpenseForm } from "./ExpenseForm";
import { formatMoney, formatPercent } from "./money";
import { splitExpense } from "./settlement";
import { CARD, ICON_BUTTON, PRIMARY_BUTTON } from "./ui";

const DATE_FORMAT = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" });

function ExpenseCard({ expense, participants, onEdit, onRemove }) {
  // Collapsed the card only says what and who; the split opens on click.
  const [open, setOpen] = useState(false);
  const nameOf = (id) => participants.find((participant) => participant.id === id)?.name ?? "?";
  const shareByParticipant = new Map(splitExpense(expense).map((part) => [part.participantId, part.amount]));

  return (
    <li className={CARD}>
      <div className="flex items-center gap-2">
        <button
          className="flex flex-1 items-center gap-3 text-left"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <ChevronDownIcon className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{expense.name}</span>
            <span className="block text-sm text-muted">
              Pagó {nameOf(expense.payerId)} · {DATE_FORMAT.format(new Date(expense.createdAt))}
            </span>
          </span>
          <span className="shrink-0 font-medium">{formatMoney(expense.amount)}</span>
        </button>

        <span className="flex shrink-0 gap-1">
          <button className={ICON_BUTTON} onClick={onEdit} title="Editar" aria-label="Editar gasto">
            <PencilSquareIcon className="size-5" />
          </button>
          <button
            className={`${ICON_BUTTON} hover:text-rose-400`}
            onClick={onRemove}
            title="Borrar"
            aria-label="Borrar gasto"
          >
            <TrashIcon className="size-5" />
          </button>
        </span>
      </div>

      {open && (
        <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted">
          {expense.shares.map((share) => (
            <li key={share.participantId} className="flex justify-between gap-4">
              <span>
                {nameOf(share.participantId)} <span className="text-xs">({formatPercent(share.percent)}%)</span>
              </span>
              <span>{formatMoney(shareByParticipant.get(share.participantId) ?? 0)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function ExpensesView({ group, onAddExpense, onUpdateExpense, onRemoveExpense, onClearGroup }) {
  // null: the form is closed. "new" or an expense id: the form is open on it.
  const [editing, setEditing] = useState(null);

  const canAdd = group.participants.length > 0 && editing === null;
  useShortcut("c", () => setEditing("new"), { enabled: canAdd });

  if (group.participants.length === 0) {
    return (
      <p className="text-sm text-muted">
        Todavía no hay participantes. Agregalos en <strong className="text-foreground">Grupo</strong> y después cargá el
        primer gasto.
      </p>
    );
  }

  const total = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenses = [...group.expenses].sort((a, b) => b.createdAt - a.createdAt);
  const editingExpense = group.expenses.find((expense) => expense.id === editing);

  const clearAll = () => {
    if (window.confirm("¿Borrar todos los gastos y participantes? No se puede deshacer.")) onClearGroup();
  };

  const save = (expense) => {
    if (editingExpense) onUpdateExpense(editingExpense.id, expense);
    else onAddExpense(expense);
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      {editing ? (
        <ExpenseForm
          key={editing}
          participants={group.participants}
          expense={editingExpense}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="flex items-baseline justify-between gap-4">
          <button className={PRIMARY_BUTTON} onClick={() => setEditing("new")} title="Nuevo gasto (C)">
            Nuevo gasto
          </button>
          <span className="text-sm text-muted">Total: {formatMoney(total)}</span>
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="text-sm text-muted">Todavía no hay gastos.</p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              participants={group.participants}
              onEdit={() => setEditing(expense.id)}
              onRemove={() => onRemoveExpense(expense.id)}
            />
          ))}
        </ul>
      )}

      <div className="flex justify-end border-t border-border pt-4">
        <button className="text-sm text-muted hover:text-rose-400" onClick={clearAll}>
          Borrar todo
        </button>
      </div>
    </div>
  );
}
