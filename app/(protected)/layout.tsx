import ProtectedLayout from '@/components/layout/ProtectedLayout'
import type React from 'react'

export default function ProtectedLayoutContainer({
  children
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
