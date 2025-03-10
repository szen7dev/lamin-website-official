"use client"

import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartDropdown } from "@/features/cart/components/CartDropdown"
import MegaMenu from "@/features/menu/components/MegaMenu"
import SearchBar from "@/features/search/components/SearchBar"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Download, Menu, Phone, Search, ShoppingCart, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const popularKeywords = [
  { label: "Thuốc nhỏ mắt", href: "#" },
  { label: "Men vi sinh", href: "#" },
  { label: "Bột hòa tan", href: "#" },
  { label: "Omega 3", href: "#" },
  { label: "Siro ho", href: "#" },
  { label: "Canxi", href: "#" },
  { label: "Kẽm", href: "#" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, mobileMenuOpen])

  return (
    <header className="w-full bg-gradient-to-r from-primary-5 to-primary-40">
      {/* Actions Row */}
      <div className="container mx-auto px-4">
        <div className="flex gap-4 flex-col md:flex-row">
          {/* Main Content Column */}
          <div className="flex-1">
            {/* Top Row with Logo, Actions and Auth */}
            <div className="flex h-16 items-center justify-between">
              {/* Logo and Mobile Menu Toggle */}
              <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2" aria-label="Elena Pharmacy Home">
                  <Image
                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
                    alt="FPT Retail"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <div className="text-white">
                    <div className="text-xs font-medium uppercase tracking-wide">Nhà Thuốc</div>
                    <div className="text-lg font-bold leading-none">LONG CHÂU</div>
                  </div>
                </Link>
              </div>

              {/* Mobile Search Toggle and Cart/Auth Buttons */}
              <div className="flex items-center gap-2">
                {/* Mobile Search Toggle */}
                <button
                  className="md:hidden text-white p-2"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label={searchOpen ? "Close search" : "Open search"}
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Auth Button - Simplified on Mobile */}
                <div className="hidden sm:block">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 rounded-full bg-white px-3 sm:px-6 text-primary-5 hover:bg-white/90"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium hidden sm:inline">Đăng Nhập</span>
                  </Button>
                </div>

                {/* Cart Dropdown - Simplified on Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2 rounded-full bg-white px-3 sm:px-6 text-primary-5 hover:bg-white/90"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="font-medium hidden sm:inline">Giỏ Hàng</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[90vw] sm:w-[400px] p-0">
                    <CartDropdown />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Search Bar - Responsive */}
            <div className={`py-4 ${searchOpen || !isMobile ? "block" : "hidden"}`}>
              <SearchBar />
            </div>

            {/* Popular Keywords - Hide on Small Mobile */}
            <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-2 pb-4">
              <span className="text-sm text-white/80">Từ khóa phổ biến:</span>
              {popularKeywords.map((keyword) => (
                <Link
                  key={keyword.label}
                  href={keyword.href}
                  className="text-sm text-white underline decoration-white decoration-1 underline-offset-4 transition hover:text-white/90"
                >
                  {keyword.label}
                </Link>
              ))}
            </div>
          </div>

          {/* QR Code Column - Hide on Mobile */}
          <div className="hidden md:flex w-[220px] flex-shrink-0 flex-col items-center justify-center rounded-lg bg-error-30 px-4 py-3">
            <div className="text-center text-white">
              <div className="text-sm font-medium">- Quét Mã QR -</div>
              <div className="text-base font-bold">Tặng Voucher 1tr</div>
            </div>
            <div className="mt-2 overflow-hidden rounded-lg bg-white p-2">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="QR Code"
                width={100}
                height={100}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Toggle on Mobile */}
      <nav
        className={`border-t border-white/10 ${mobileMenuOpen || !isMobile ? "block" : "hidden"}`}
        aria-label="Main Navigation"
      >
        <div className="container mx-auto px-4">
          <MegaMenu />
        </div>
      </nav>

      {/* Mobile Contact and Download - Show in Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-3">
            <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 w-full justify-center">
              <Phone className="h-5 w-5" />
              <div>
                <span className="mr-1 text-sm">Tư vấn ngay:</span>
                <span className="font-medium">1800 6789</span>
              </div>
            </button>

            <button className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white transition hover:bg-white/10 w-full justify-center">
              <Download className="h-5 w-5" />
              <span>Tải ứng dụng</span>
            </button>

            {/* Mobile Auth Button */}
            <Button
              variant="secondary"
              className="flex items-center gap-2 rounded-full bg-white px-6 text-primary-5 hover:bg-white/90 w-full justify-center sm:hidden"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Đăng Nhập</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
