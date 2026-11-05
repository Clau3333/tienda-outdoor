import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type TextFieldProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  hint?: string
  error?: string
}

// Presentación accesible: las reglas de validación y el estado pertenecen al formulario.
export default function TextField({ label, hint, error, id, className = '',
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptions = [describedBy, hint && `${inputId}-hint`, error && `${inputId}-error`]
    .filter(Boolean).join(' ') || undefined

  return (
    <div className="albedo-field">
      <label className="form-label" htmlFor={inputId}>{label}</label>
      <input {...props} id={inputId} className={`form-control${error ? ' is-invalid' : ''} ${className}`}
        aria-describedby={descriptions} aria-invalid={error ? true : invalid} />
      {hint && <div className="form-text" id={`${inputId}-hint`}>{hint}</div>}
      {error && <div className="invalid-feedback" id={`${inputId}-error`}>{error}</div>}
    </div>
  )
}
