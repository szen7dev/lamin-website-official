import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import type React from 'react'

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}