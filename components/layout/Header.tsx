import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Phone, Smartphone, CircleUser } from "lucide-react"
import { Button } from "@/components/ui/Button"
import SearchBar from "@/features/homepage/components/SearchBar"
import MegaMenu from "@/features/homepage/components/MegaMenu"
import { Separator } from "../ui/separator"

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
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="flex justify-between gap-8">
          <div className="flex flex-col grow justify-between h-44">
            <div className="flex h-max items-center justify-between">
              <div className="flex justify-items-start gap-4 items-end">
                {/* Logo */}
                <Link href="/" className="flex items-end gap-2">
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
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-end gap-2">
                    <Phone className="h-5 w-5 text-white" />
                    <div className="text-white">
                      <span className="mr-1 text-sm">Tư vấn ngay:</span>
                      <span className="font-medium">1800 6789</span>
                    </div>
                  </div>
                  <div className="h-5">
                    <Separator className="h-full bg-white" orientation="vertical" />
                    <Separator className="h-full bg-white" orientation="vertical" />
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <Smartphone className="h-5 w-5" />
                    <span>Tải ứng dụng</span>
                  </div>
                  </div>
                </div>
              </div>

              {/* Auth and Cart */}
              <div className="flex items-center gap-4">
                <Button className="rounded-full bg-white px-6 text-primary-5 hover:bg-white/90">
                  <CircleUser className="mr-2 h-5 w-5" />
                  Đăng Nhập
                </Button>
                <Button className="rounded-full bg-primary-5 px-6 text-white hover:bg-primary-5/90">
                  <ShoppingCart fill="white" className="mr-2 h-5 w-5" />
                  Giỏ Hàng
                </Button>
              </div>
            </div>

            {/* Search Bar and QR Section */}
            <div className="flex gap-4 py-4">
              <div className="flex-1">
                {/* Replace the old search input with the new SearchBar component */}
                <SearchBar />
              </div>
            </div>

            {/* Popular Keywords */}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
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
          <div className="flex w-max flex-col items-center justify-center rounded-xl bg-[#F37021]">
            <div className="text-center text-white p-2">
              <div className="text-sm">- Quét Mã QR -</div>
              <div className="text-sm">Tặng Voucher 1tr</div>
            </div>
            <div className=" flex justify-between bg-white w-full h-full rounded-b-xl"></div>
          </div>
        </div>
      {/* Main Navigation */}
      <MegaMenu />
    </header>
  )
}
