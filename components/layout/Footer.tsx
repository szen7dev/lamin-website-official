import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* About Us Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">VỀ CHÚNG TÔI</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-primary">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Giấy phép kinh doanh
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Quy chế hoạt động
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Chính sách đặt cọc
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Chính sách nội dung
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Chính sách thanh toán
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn More Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">TÌM HIỂU THÊM</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-primary">
                  Bệnh viện
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Góc sức khoẻ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Tra cứu thuốc
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Tra cứu dược chất
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Tra cứu dược liệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Bệnh thường gặp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Đội ngũ chuyên môn
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Tin tức tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">DANH MỤC</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-primary">
                  Thực phẩm chức năng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Dược mỹ phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Chăm sóc cá nhân
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Trang thiết bị y tế
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Đặt thuốc online
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Trung tâm Tiêm chủng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Certifications Column */}
          <div className="space-y-6">
            {/* Hotline Section */}
            <div>
              <h4 className="font-semibold text-lg mb-4">TỔNG ĐÀI</h4>
              <ul className="space-y-2">
                <li>
                  <p>Tư vấn mua hàng</p>
                  <p className="font-semibold text-primary">1900 6789 (Nhánh 1)</p>
                </li>
                <li>
                  <p>Trung tâm Vắc Xin</p>
                  <p className="font-semibold text-primary">1900 6789 (Nhánh 2)</p>
                </li>
                <li>
                  <p>Góp ý - Khiếu nại</p>
                  <p className="font-semibold text-primary">1900 6789 (Nhánh 3)</p>
                </li>
              </ul>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="font-semibold text-lg mb-4">CHỨNG NHẬN</h4>
              <div className="flex space-x-4">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Certification 1"
                  width={40}
                  height={40}
                />
                <Image
                  src="/placeholder.svg?height=40&width=100"
                  alt="DMCA Protected"
                  width={100}
                  height={40}
                />
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-lg mb-4">KẾT NỐI VỚI CHÚNG TÔI</h4>
              <div className="flex space-x-4">
                <Link href="#" className="hover:opacity-80">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Facebook"
                    width={32}
                    height={32}
                  />
                </Link>
                <Link href="#" className="hover:opacity-80">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Zalo"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Payment & App Download Column */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div>
              <h4 className="font-semibold text-lg mb-4">HỖ TRỢ THANH TOÁN</h4>
              <div className="grid grid-cols-3 gap-2">
                {["JCB", "Mastercard", "Visa", "VNPay", "ZaloPay", "MoMo"].map((method) => (
                  <Image
                    key={method}
                    src="/placeholder.svg?height=32&width=48"
                    alt={method}
                    width={48}
                    height={32}
                    className="object-contain"
                  />
                ))}
              </div>
            </div>

            {/* App Download */}
            <div>
              <h4 className="font-semibold text-lg mb-4">TẢI ỨNG DỤNG</h4>
              <Image
                src="/placeholder.svg?height=120&width=120"
                alt="QR Code"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-grayscale-20 text-sm text-muted-foreground">
          <p>
            © 2023 - 2024 Công ty Cổ Phần Elena | Số ĐKKD 000000000 cấp ngày 17/09/2023 tại Sở Kế
            hoạch Đầu tư TPHN
          </p>
          <p className="mt-2">
            • Địa chỉ: 30 Vĩnh Phúc, Ba Đình, Hà Nội • Số điện thoại: (084)00000000 • Email:
            sale@elena.com.vn • Người quản lý nội dung: Elena
          </p>
        </div>
      </div>
    </footer>
  )
}
