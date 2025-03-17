import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/features/cart/contexts/CartContext"
import { QueryProvider } from "@/providers/QueryProvider"
import { generateMetadata as generateSeoMetadata } from "@/utils/seo"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = generateSeoMetadata({
  title: "Elena Pharmacy",
  description: "Your trusted pharmacy partner",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <QueryProvider>
            <CartProvider>{children}</CartProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
