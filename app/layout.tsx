import { generateMetadata } from "@/components/seo/Metadata";
import type { ReactNode } from "react";
import '../styles/globals.css';

export { generateMetadata };

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}