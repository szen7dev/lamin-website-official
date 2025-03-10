import { generateMetadata as generateSeoMetadata } from "@/utils/seo"
import { Inter } from "next/font/google"
import type React from "react"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = generateSeoMetadata({
  title: "Elena Pharmacy",
  description: "Your trusted pharmacy partner",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}
