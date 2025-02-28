"use client"

import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <input className={`input ${className}`} {...props} />
      {error && <p className="error">{error}</p>}
    </div>
  )
}

