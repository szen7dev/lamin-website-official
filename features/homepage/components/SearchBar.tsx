"use client"

import { useState, useEffect, useRef } from "react"
import { CircleX, Search, X } from "lucide-react"
import SearchSuggestions from "./SearchSuggestions"

// Mock data for demonstration
const mockResults = [
  {
    id: "1",
    name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột",
    price: 165000,
    image: "/placeholder.svg?height=48&width=48",
    unit: "Hộp",
  },
  {
    id: "2",
    name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột",
    price: 165000,
    image: "/placeholder.svg?height=48&width=48",
    unit: "Hộp",
  },
  {
    id: "3",
    name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột",
    price: 165000,
    image: "/placeholder.svg?height=48&width=48",
    unit: "Hộp",
  },
]

const CustomCircleX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" stroke="#404968" fill="#404968" />
    <path d="m15 9-6 6" stroke="white" />
    <path d="m9 9 6 6" stroke="white" />
  </svg>
)

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState(mockResults)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Simulated search function - replace with actual API call
  const handleSearch = (value: string) => {
    setQuery(value)
    // In a real application, you would make an API call here
    // For now, we'll just filter the mock results
    if (value.trim()) {
      setResults(
        mockResults.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
      )
    }
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Tìm kiếm sản phẩm, dịch vụ . . ."
          className="h-12 w-full rounded-[8px] border-none bg-white pl-5 pr-10 text-base text-grayscale-90 shadow-sm placeholder:text-grayscale-40 focus:outline-none focus:ring-2 focus:ring-primary-20"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-grayscale-10"
          >
            <CustomCircleX />
          </button>
        )}
      </div>

      <SearchSuggestions
        query={query}
        results={results}
        isVisible={isFocused && query.length > 0}
        onClose={() => setIsFocused(false)}
      />
    </div>
  )
}
