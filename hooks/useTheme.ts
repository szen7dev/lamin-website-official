"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useTheme() {
  const { theme, setTheme, resolvedTheme, themes, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (mounted) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
  }

  // Return safe values during SSR
  return {
    theme: mounted ? theme : undefined,
    setTheme: mounted ? setTheme : () => {},
    resolvedTheme: mounted ? resolvedTheme : undefined,
    toggleTheme,
    themes,
    systemTheme: mounted ? systemTheme : undefined,
    mounted,
  }
}
