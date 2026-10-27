import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

type FieldProps = {
  id: string;
  label: ReactNode;
  optional?: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control + hint/error, wired with aria-describedby by the caller via ids. */
export function Field({ id, label, optional, hint, error, children, className = "" }: FieldProps) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="opt">{optional}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <Icon name="alert" size={16} className="mt-px" />
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function Input({ invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <input className="input" aria-invalid={invalid || undefined} {...props} />;
}

export function Textarea({ invalid, ...props }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return <textarea className="input" aria-invalid={invalid || undefined} {...props} />;
}

export function Select({ invalid, children, ...props }: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select className="input" aria-invalid={invalid || undefined} {...props}>
      {children}
    </select>
  );
}
