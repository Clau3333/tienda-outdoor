import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type SelectFieldProps = ComponentPropsWithoutRef<'select'> & { label: string; error?: string }
export default function SelectField({ label, error, id, children, className = '', ...props }: SelectFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return <div className="albedo-field">
    <label className="form-label" htmlFor={fieldId}>{label}</label>
    <select {...props} id={fieldId} className={`form-select${error ? ' is-invalid' : ''} ${className}`}
      aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : props['aria-describedby']}>
      {children}
    </select>
    {error && <div className="invalid-feedback" id={`${fieldId}-error`}>{error}</div>}
  </div>
}
