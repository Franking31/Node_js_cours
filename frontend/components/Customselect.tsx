"use client";
import { useState, useRef, useEffect } from "react";
import styles from "../modules/CustomSelect.module.css";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export default function CustomSelect({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected?.label ?? "—"}</span>
        <i className={`ti ti-chevron-down ${styles.arrow} ${open ? styles.arrowOpen : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.value === value && (
                <i className="ti ti-check" aria-hidden="true" />
              )}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}