import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="relative h-12 w-32 mb-4">
              <Image
                src="/placeholder.svg?height=60&width=160"
                alt="Elena Pharmacy Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-600 mb-4">
              Elena Pharmacy - Hệ thống nhà thuốc uy tín cung cấp dịch vụ mua thuốc online chính hãng, tư vấn sức khỏe
              chuyên nghiệp.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/trusted-shops" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Shop uy tín
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Tin tức sức khỏe
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/height-measurement" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Đo chiều cao
                </Link>
              </li>
              <li>
                <Link href="/nutrition-check" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Kiểm tra dinh dưỡng
                </Link>
              </li>
              <li>
                <Link href="/health-consultation" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Tư vấn sức khỏe
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Giao hàng tận nơi
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                <a href="tel:1900123456" className="text-gray-600 hover:text-primary-600 transition-colors">
                  1900 123 456
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                <a href="mailto:info@elela.vn" className="text-gray-600 hover:text-primary-600 transition-colors">
                  info@elela.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Elena Pharmacy. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

