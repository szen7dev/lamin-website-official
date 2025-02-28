import PublicLayout from '@/components/layout/PublicLayout'
import type React from 'react'

export default function PublicLayoutContainer({
  children
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
