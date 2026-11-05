import type { ComponentPropsWithoutRef } from 'react'

export default function Surface({ className = '', ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={`card albedo-surface ${className}`} />
}
