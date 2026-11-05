import type { ComponentPropsWithoutRef } from 'react'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'quiet'
}

const variants = { primary: 'btn-primary', secondary: 'btn-outline-secondary', quiet: 'btn-link' }

export default function Button({ variant = 'primary', type = 'button', className = '', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`btn albedo-button ${variants[variant]} ${className}`} />
}
