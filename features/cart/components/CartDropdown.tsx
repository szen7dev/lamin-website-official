"use client"

import { Button } from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock data for demonstration
const initialCartItems = [
  {
    id: 1,
    name: "Hỗn hợp Vitamin D3 King Phar bổ sung Canxi hỗ trợ xương chắc khỏe",
    image: "/placeholder.svg?height=80&width=80",
    price: "100.000đ",
    originalPrice: "200.000đ",
    quantity: 1,
    unit: "Hộp",
  },
  {
    id: 2,
    name: "Hỗn hợp Vitamin D3 King Phar bổ sung Canxi hỗ trợ xương chắc khỏe",
    image: "/placeholder.svg?height=80&width=80",
    price: "100.000đ",
    originalPrice: "200.000đ",
    quantity: 1,
    unit: "Hộp",
  },
]

export function CartDropdown() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="p-4 border-b border-grayscale-20">
        <h3 className="text-lg font-semibold text-grayscale-90">Giỏ hàng</h3>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="max-h-[60vh] overflow-y-auto">
            <ul className="divide-y divide-grayscale-20">
              {cartItems.map((item) => (
                <li key={item.id} className="p-4 flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-grayscale-90 line-clamp-2">
                      {item.name}
                    </h4>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-sm font-semibold text-primary-5">{item.price}</span>
                      <span className="ml-1 text-xs text-grayscale-50 line-through">
                        {item.originalPrice}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-grayscale-50">
                      x{item.quantity} {item.unit}
                    </div>
                  </div>
                  <button
                    className="text-grayscale-40 hover:text-error-5 transition-colors"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-grayscale-5 border-t border-grayscale-20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-grayscale-60">{cartItems.length} sản phẩm</span>
            </div>
            <Link href="/cart" className="w-full">
              <Button className="w-full bg-primary-5 hover:bg-primary-20">Xem giỏ hàng</Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 text-grayscale-30 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-grayscale-50 mb-4">Giỏ hàng của bạn đang trống</p>
          <Button asChild className="bg-primary-5 hover:bg-primary-20">
            <Link href="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
