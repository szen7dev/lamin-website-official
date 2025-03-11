'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CircleUser, Phone, ShoppingCart, Smartphone, Menu } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/separator'
import SearchBar from '@/features/homepage/components/SearchBar'
import MegaMenu from '@/features/homepage/components/MegaMenu'

// Sample data for popular keywords
const popularKeywords = [
  { label: 'Thuốc kháng sinh', href: '#' },
  { label: 'Vitamin C', href: '#' },
  { label: 'Paracetamol', href: '#' },
  { label: 'Mỹ phẩm', href: '#' },
]

export default function Header() {
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="w-full bg-gradient-3">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 md:mt-8 md:mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
          <div className="flex flex-col grow justify-between md:h-44">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 h-max items-start sm:items-center justify-between">
              {/* Mobile Menu Button - Only visible on small screens */}
              <div className="flex w-full justify-between items-center sm:hidden">
                <Link className="flex items-end gap-2" href="/">
                  <Image
                    alt="FPT Retail"
                    className="h-8 w-auto"
                    height={32}
                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
                    width={32}
                  />
                  <div className="text-white">
                    <div className="text-xs font-medium">NHÀ THUỐC</div>
                    <div className="text-base font-bold leading-none">LONG CHÂU</div>
                  </div>
                </Link>
                <Button
                  className="text-white"
                  variant="ghost"
                  onClick={() => menuButtonRef.current?.click()}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>

              <div className="hidden sm:flex justify-items-start gap-4">
                {/* Logo */}
                <Link className="flex items-end gap-2" href="/">
                  <Image
                    alt="FPT Retail"
                    className="h-10 w-auto"
                    height={40}
                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
                    width={40}
                  />
                  <div className="text-white">
                    <div className="text-xs font-medium">NHÀ THUỐC</div>
                    <div className="text-lg font-bold leading-none">LONG CHÂU</div>
                  </div>
                </Link>

                {/* Contact and Download - Hidden on mobile, visible on medium screens */}
                <div className="hidden md:flex items-end gap-4 ml-4">
                  <div className="flex items-end gap-2">
                    <Phone className="h-5 w-5 text-white" />
                    <div className="text-white">
                      <span className="mr-1 text-sm">Tư vấn ngay:</span>
                      <span className="font-medium">1800 6789</span>
                    </div>
                  </div>
                  <div className="h-5">
                    <Separator className="h-full bg-white" orientation="vertical" />
                  </div>
                  <div className="flex items-end gap-2 rounded-full text-white px-0 py-0">
                    <Smartphone className="h-5 w-5" />
                    <span>Tải ứng dụng</span>
                  </div>
                </div>
              </div>

              {/* Auth and Cart */}
              <div className="hidden sm:flex items-center gap-2 md:gap-4 mt-4 sm:mt-0">
                <Button className="rounded-full bg-white px-3 md:px-6 text-primary hover:bg-white/90 text-xs md:text-sm">
                  <CircleUser className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Đăng Nhập
                </Button>
                <Button className="rounded-full bg-primary px-3 md:px-6 text-white hover:bg-primary/90 text-xs md:text-sm">
                  <ShoppingCart className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" fill="white" />
                  Giỏ Hàng
                </Button>
              </div>
            </div>

            {/* Search Bar Section */}
            <div className="flex gap-4 py-4 mt-4 sm:mt-0">
              <div className="flex-1">
                <SearchBar />
              </div>
            </div>

            {/* Popular Keywords - Hidden on smallest screens */}
            <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-sm text-white/80">Từ khóa phổ biến:</span>
              {popularKeywords.map(keyword => (
                <Link
                  key={keyword.label}
                  className="text-sm text-white decoration-white underline decoration-1 underline-offset-4 hover:text-white/90"
                  href={keyword.href}>
                  {keyword.label}
                </Link>
              ))}
            </div>
          </div>

          {/* QR Code Section - Hidden on mobile */}
          <div className="hidden md:flex w-max flex-col items-center justify-center rounded-xl bg-[#F37021]">
            <div className="text-center text-white p-2">
              <div className="text-sm">- Quét Mã QR -</div>
              <div className="text-sm">Tặng Voucher 1tr</div>
            </div>
            <div className="flex justify-between bg-white w-full h-full rounded-b-xl" />
          </div>
        </div>
      </div>

      {/* Mobile Auth and Cart - Only visible on small screens */}
      <div className="flex sm:hidden justify-between items-center px-4 py-2 bg-white/10">
        <Button className="rounded-full bg-white px-4 text-primary hover:bg-white/90 text-xs h-8">
          <CircleUser className="mr-1 h-3 w-3" />
          Đăng Nhập
        </Button>
        <Button className="rounded-full bg-primary px-4 text-white hover:bg-primary/90 text-xs h-8">
          <ShoppingCart className="mr-1 h-3 w-3" fill="white" />
          Giỏ Hàng
        </Button>
      </div>

      {/* Main Navigation */}
      <MegaMenu megaMenuRef={menuButtonRef} />
    </header>
  )
}
