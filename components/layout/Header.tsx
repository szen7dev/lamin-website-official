import { Button } from "@/components/ui/Button"
import MegaMenu from "@/features/menu/components/MegaMenu"
import SearchBar from "@/features/search/components/SearchBar"
import { Download, Phone, ShoppingCart, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const popularKeywords = [
  { label: "Thuốc nhỏ mắt", href: "#" },
  { label: "Men vi sinh", href: "#" },
  { label: "Bột hòa tan", href: "#" },
  { label: "Omega 3", href: "#" },
  { label: "Siro ho", href: "#" },
  { label: "Canxi", href: "#" },
  { label: "Kẽm", href: "#" },
]

const mainMenu = [
  { label: "Sản phẩm", href: "/products", hasDropdown: true },
  { label: "Giải Pháp", href: "/solutions" },
  { label: "Đo Cao", href: "/height-measurement" },
  { label: "Kiểm Tra Dinh Dưỡng", href: "/nutrition-check" },
  { label: "Hệ Thống Cửa Hàng", href: "/trusted-shops" },
  { label: "Liên Hệ", href: "/contact" },
]

export function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-primary-5 to-primary-40">
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
              alt="FPT Retail"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="text-white">
              <div className="text-xs font-medium">NHÀ THUỐC</div>
              <div className="text-lg font-bold leading-none">LONG CHÂU</div>
            </div>
          </Link>

          {/* Contact and Download */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Phone className="h-5 w-5 text-white" />
              <div className="text-white">
                <span className="mr-1 text-sm">Tư vấn ngay:</span>
                <span className="font-medium">1800 6789</span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full border border-white/20 text-white hover:bg-white/10"
            >
              <Download className="h-5 w-5" />
              <span>Tải ứng dụng</span>
            </Button>
          </div>

          {/* Auth and Cart */}
          <div className="flex items-center gap-4">
            <Button className="rounded-full bg-white px-6 text-primary-5 hover:bg-white/90">
              <User className="mr-2 h-5 w-5" />
              Đăng Nhập
            </Button>
            <Button className="rounded-full bg-white px-6 text-primary-5 hover:bg-white/90">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Giỏ Hàng
            </Button>
          </div>
        </div>

        {/* Search Bar and QR Section */}
        <div className="flex gap-4 py-4">
          <div className="flex-1">
            {/* Replace the old search input with the new SearchBar component */}
            <SearchBar />

            {/* Popular Keywords */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-sm text-white/80">Từ khóa phổ biến:</span>
              {popularKeywords.map((keyword) => (
                <Link
                  key={keyword.label}
                  href={keyword.href}
                  className="text-sm text-white decoration-white underline decoration-1 underline-offset-4 hover:text-white/90"
                >
                  {keyword.label}
                </Link>
              ))}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex w-[220px] flex-col items-center justify-center rounded-lg bg-[#FF6634] px-4 py-3">
            <div className="text-center text-white">
              <div className="text-sm font-medium">- Quét Mã QR -</div>
              <div className="text-base font-bold">Tặng Voucher 1tr</div>
            </div>
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="QR Code"
              width={100}
              height={100}
              className="mt-2 rounded-lg bg-white p-2"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <MegaMenu />
      </div>
    </header>
  )
}
