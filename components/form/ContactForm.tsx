'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm } from '@/hooks/useForm'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validate: values => {
      const errors: Record<string, string> = {}

      if (!values.name) errors.name = 'Name is required'
      if (!values.email) errors.email = 'Email is required'
      if (!values.message) errors.message = 'Message is required'

      return errors
    },
    onSubmit: async values => {
      setIsSubmitting(true)
      try {
        // Submit form logic
        console.log('Form submitted:', values)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          placeholder="Your email"
          type="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="message"
          name="message"
          placeholder="Your message"
          value={values.message}
          onChange={handleChange}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
