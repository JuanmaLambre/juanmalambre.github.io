import { useLayoutEffect, useRef } from "react";
import { formatAmountInput } from "./money";

// Digits and the comma: what stays put when the thousands dots move around.
const countKept = (text) => text.replace(/[^\d,]/g, "").length;

// An amount input that adds the thousands dots while typing. Rewriting the
// value would send the cursor to the end, so it goes back after the same
// number of digits it had before.
export function AmountInput({ value, onChange, ...props }) {
  const input = useRef(null);
  const caret = useRef(null);

  useLayoutEffect(() => {
    if (caret.current === null || document.activeElement !== input.current) return;
    let position = 0;
    while (position < value.length && countKept(value.slice(0, position)) < caret.current) position++;
    input.current.setSelectionRange(position, position);
    caret.current = null;
  });

  const change = (event) => {
    const { value: typed, selectionStart } = event.target;
    caret.current = countKept(formatAmountInput(typed.slice(0, selectionStart)));
    onChange(formatAmountInput(typed));
  };

  return <input ref={input} inputMode="decimal" placeholder="0" value={value} onChange={change} {...props} />;
}
