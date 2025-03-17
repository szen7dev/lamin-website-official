"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // During SSR and initial client render, default to false
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Only run on client
    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Setup listener for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener("change", listener)

    // Cleanup
    return () => media.removeEventListener("change", listener)
  }, [query])

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false
}

