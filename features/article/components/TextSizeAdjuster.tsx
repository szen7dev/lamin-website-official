"use client"

import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"

type TextSize = "default" | "large"

interface TextSizeAdjusterProps {
  defaultSize?: TextSize
  onChange?: (size: TextSize) => void
}

export default function TextSizeAdjuster({
  defaultSize = "default",
  onChange,
}: TextSizeAdjusterProps) {
  const [activeSize, setActiveSize] = useState<TextSize>(defaultSize)

  useEffect(() => {
    // Apply text size to article content
    const articleContent = document.querySelector(".article-content")
    if (articleContent) {
      articleContent.classList.remove("text-base", "text-lg")

      switch (activeSize) {
        case "default":
          articleContent.classList.add("text-base")
          break
        case "large":
          articleContent.classList.add("text-lg")
          break
      }
    }

    // Call onChange callback if provided
    if (onChange) {
      onChange(activeSize)
    }
  }, [activeSize, onChange])

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={activeSize === "default" ? "default" : "outline"}
        size="sm"
        className="rounded-l-md rounded-r-none"
        onClick={() => setActiveSize("default")}
      >
        Mặc định
      </Button>
      <Button
        variant={activeSize === "large" ? "default" : "outline"}
        size="sm"
        className="rounded-l-none rounded-r-md"
        onClick={() => setActiveSize("large")}
      >
        Lớn hơn
      </Button>
    </div>
  )
}
