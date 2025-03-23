'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Dot } from 'lucide-react';

import { useContactInfo } from '@/hooks/useContactInfo';
import { FacebookIcon, ZaloIcon } from '@/components/icons';

export function Footer() {
  const { data: contactInfo } = useContactInfo();

  console.log('contactInfo', contactInfo);

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* About Us Column */}
          <div>
            <div className="flex">
              <span className="text-primary">
                <Dot
                  className="text-primary -ml-2"
                  stroke="currentColor"
                  strokeWidth={5}
                />
              </span>
              <h4 className="font-semibold text-lg mb-4">VỀ CHÚNG TÔI</h4>
            </div>

            <Link
              className="text-grayscale-40 hover:text-primary -ml-1"
              href="#">
              {contactInfo?.name}
            </Link>
          </div>

          {/* Learn More Column */}
          <div>
            <div className="flex">
              <span className="text-primary">
                <Dot
                  className="text-primary -ml-2"
                  stroke="currentColor"
                  strokeWidth={5}
                />
              </span>
              <h4 className="font-semibold text-lg mb-4">TÌM HIỂU THÊM</h4>
            </div>

            <ul className="space-y-2">
              {[
                'Bệnh viện',
                'Góc sức khoẻ',
                'Tra cứu thuốc',
                'Tra cứu dược chất',
                'Tra cứu dược liệu',
                'Bệnh thường gặp',
                'Đội ngũ chuyên môn',
                'Tin tức tuyển dụng',
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Link
                    className="text-grayscale-40 hover:text-primary -ml-1"
                    href="#">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <div className="flex">
              <span className="text-primary">
                <Dot
                  className="text-primary -ml-2"
                  stroke="currentColor"
                  strokeWidth={5}
                />
              </span>
              <h4 className="font-semibold text-lg mb-4">DANH MỤC</h4>
            </div>

            <ul className="space-y-2">
              {[
                'Thực phẩm chức năng',
                'Dược mỹ phẩm',
                'Chăm sóc cá nhân',
                'Trang thiết bị y tế',
                'Đặt thuốc online',
                'Trung tâm Tiêm chủng',
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Link
                    className="text-grayscale-40 hover:text-primary -ml-1"
                    href="#">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Certifications Column */}
          <section className="space-y-6">
            {/* Hotline Section */}
            <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-semibold text-lg mb-4">TỔNG ĐÀI</h4>
              </div>

              <ul className="space-y-2">
                <li>
                  <p className="text-grayscale-40">Tư vấn mua hàng</p>
                  <p className="font-normal text-primary">
                    {contactInfo?.hotline1}
                  </p>
                </li>
                <li>
                  <p className="text-grayscale-40">Trung tâm Vắc Xin</p>
                  <p className="font-normal text-primary">
                    {contactInfo?.hotline2}
                  </p>
                </li>
                <li>
                  <p className="text-grayscale-40">Góp ý - Khiếu nại</p>
                  <p className="font-normal text-primary">
                    {contactInfo?.hotline3}
                  </p>
                </li>
              </ul>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-semibold text-lg mb-4">CHỨNG NHẬN</h4>
              </div>

              <div className="flex space-x-4">
                {/* <Image
                  alt="Certification 1"
                  height={40}
                  src="/placeholder.svg?height=40&width=40"
                  width={40}
                  style={{ width: 'auto' }}
                />
                <Image
                  alt="DMCA Protected"
                  height={40}
                  src="/placeholder.svg?height=40&width=100"
                  width={100}
                  style={{ width: 'auto' }}
                />
                <Image
                  alt="Certification 1"
                  height={40}
                  src="/placeholder.svg?height=40&width=40"
                  width={40}
                  style={{ width: 'auto' }}
                />
                <Image
                  alt="DMCA Protected"
                  height={40}
                  src="/placeholder.svg?height=40&width=100"
                  width={100}
                  style={{ width: 'auto' }}
                />
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-semibold text-lg mb-4">
                  KẾT NỐI VỚI CHÚNG TÔI
                </h4>
              </div>

              <div className="flex space-x-4">
                <Link
                  aria-label="Facebook"
                  className="hover:opacity-80"
                  href={contactInfo?.facebook || '#'}
                  rel="noopener noreferrer"
                  target="_blank">
                  <FacebookIcon />
                </Link>
                <Link
                  aria-label="Zalo"
                  className="hover:opacity-80"
                  href={contactInfo?.zalo || '#'}
                  rel="noopener noreferrer"
                  target="_blank">
                  <ZaloIcon />
                </Link>
              </div>
            </div>
          </section>

          {/* Payment & App Download Column */}
          <section className="space-y-6">
            {/* Payment Methods */}
            <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-semibold text-lg mb-4">
                  HỖ TRỢ THANH TOÁN
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  '/images/JCB.png',
                  '/images/mastercard.png',
                  '/images/visa.png',
                  '/images/VNpay.png',
                  '/images/zalopay.png',
                  '/images/Momo.png',
                ].map(method => (
                  <div
                    key={method}
                    className="border border-grayscale-10 px-1 py-2 rounded-sm">
                    <Image
                      alt={method}
                      className="object-contain"
                      height={32}
                      src={method}
                      width={48}
                      style={{ width: 'auto' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* App Download */}
            <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-semibold text-lg mb-4">TẢI ỨNG DỤNG</h4>
              </div>

              <Image
                alt="QR Code"
                className="rounded-lg"
                height={120}
                src="/images/qrCode.png"
                width={120}
                style={{ width: 'auto' }}
              />
            </div>
          </section>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-grayscale-20 text-sm text-grayscale-50">
          <p>
            &copy; 2025 - {new Date().getFullYear()} {contactInfo?.name} |{' '}
            {contactInfo?.registration}
          </p>
          <address className="mt-2 not-italic">
            • Địa chỉ: {contactInfo?.address} • Số điện thoại:
            {contactInfo?.phone} • Email: {contactInfo?.email} • Người quản lý
            nội dung:
            {contactInfo?.content}
          </address>
        </div>
      </div>
    </footer>
  );
}
