'use client';

import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

/**
 * `.fld` — the shared form field from the approved forms (Contact enquiry and
 * Calculator lead capture). Label, control, and the `.err` message that the
 * design reveals via `.fld.invalid`.
 */

interface BaseProps {
  id: string;
  label: ReactNode;
  /** Rendered as `<em>(optional)</em>` beside the label, as in the design. */
  optional?: boolean;
  error?: string;
}

function FieldShell({
  id,
  label,
  optional,
  error,
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div className={`fld${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>
        {label} {optional ? <em>(optional)</em> : null}
      </label>
      {children}
      {error ? (
        <span className="err" role="alert">
          {error}
        </span>
      ) : (
        <span className="err" />
      )}
    </div>
  );
}

export function TextField({
  id,
  label,
  optional,
  error,
  ...props
}: BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>) {
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <input id={id} aria-invalid={error ? true : undefined} {...props} />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  optional,
  error,
  value,
  children,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <select
        id={id}
        value={value}
        aria-invalid={error ? true : undefined}
        /* `.unset` renders the placeholder colour until a real value is picked. */
        className={value ? undefined : 'unset'}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  optional,
  error,
  ...props
}: BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>) {
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <textarea id={id} aria-invalid={error ? true : undefined} {...props} />
    </FieldShell>
  );
}

/** `.frow` — the two-up field row that collapses to one column ≤760px. */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="frow">{children}</div>;
}
