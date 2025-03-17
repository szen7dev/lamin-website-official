"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

export function ThemeSwitcher() {
  const { resolvedTheme, toggleTheme, mounted } = useTheme()

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="w-9 h-9 opacity-0" />
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-9 h-9"
    >
      {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}
