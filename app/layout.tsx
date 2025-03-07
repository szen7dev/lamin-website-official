import type React from "react"
import "../styles/globals.css"
import clsx from "clsx"
import { fontSans } from "@/config/fonts"

export const metadata = {
  title: "Elena Pharmacy",
  description: "Your trusted pharmacy partner",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx("bg-background font-sans antialiased", fontSans.variable)}>
        {children}
      </body>
    </html>
  )
}
