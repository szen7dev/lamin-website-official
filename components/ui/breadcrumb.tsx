import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`mb-6 flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-[#1250DC]" />}

            {item.href && !isLast ? (
              <Link href={item.href} className="text-[#1250DC] hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-grayscale-60" : "text-[#1250DC]"}>{item.label}</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

