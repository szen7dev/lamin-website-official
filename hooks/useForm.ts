"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

interface FormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => void | Promise<void>
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

export function useForm<T extends Record<string, any>>({ initialValues, onSubmit, validate }: FormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)

      if (Object.keys(validationErrors).length > 0) {
        return
      }
    }

    setIsSubmitting(true)

    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
  }
}

