'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Dot } from 'lucide-react';
import { useState } from 'react';

import { useContactInfo } from '@/hooks/useContactInfo';
import { FacebookIcon, ZaloIcon } from '@/components/icons';
import { useGetMediasHomepage } from '@/features';

export function Footer() {
  const { banners: aboutUs } = useGetMediasHomepage({ type: 8 });
  const { banners: learnMore } = useGetMediasHomepage({ type: 9 });
  const { banners: category } = useGetMediasHomepage({ type: 10 });
  const { data: contactInfo } = useContactInfo();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section], // Chỉ cập nhật trạng thái mục được click
    }));
  };

  const renderFooterLink = (item?: { slug: string; name: string }) => {
    return (
      <Link
        key={item?.slug}
        className="text-grayscale-40 hover:text-primary decoration-transparent text-sm hidden sm:block"
        href={`/${item?.slug}`}>
        {item?.name}
      </Link>
    );
  };

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* About Us Column */}
          <div className="border-b pb-1 sm:border-0 pb-0">
            <div className="flex justify-between">
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-medium text-sm mb-4">VỀ CHÚNG TÔI</h4>
              </div>
              <button
                className="w-5 h-5 sm:hidden"
                onClick={() => toggleSection('about')}>
                <ChevronDown
                  className={`h-5 font-medium transition-transform ${openSections['about'] ? 'rotate-180' : 'rotate-0'}`}
                />
              </button>
            </div>

            {aboutUs?.map(item => renderFooterLink(item))}

            {/* {openSections['about'] && (
              <Link
                className="text-grayscale-40 hover:text-primary decoration-transparent text-sm"
                href={aboutUs?.slug}>
                {aboutUs?.name}
              </Link>
            )} */}
          </div>

          {/* Learn More Column */}
          <div className="border-b pb-1 sm:border-0 pb-0">
            <div className="flex justify-between">
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-medium text-sm mb-4">TÌM HIỂU THÊM</h4>
              </div>
              <button
                className="w-5 h-5 sm:hidden"
                onClick={() => toggleSection('learnMore')}>
                <ChevronDown
                  className={`h-5 font-medium transition-transform ${openSections['learnMore'] ? 'rotate-180' : 'rotate-0'}`}
                />
              </button>
            </div>

            {learnMore?.map(item => renderFooterLink(item))}

            {/* {openSections['learnMore'] && (
              <ul className="space-y-2 text-sm">
                {['Đội ngũ chuyên môn'].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Link
                      className="text-grayscale-40 hover:text-primary decoration-transparent"
                      href="#">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )} */}
          </div>

          {/* Categories Column */}
          <div className="border-b pb-1 sm:border-0 pb-0">
            <div className="flex justify-between">
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-medium text-sm mb-4">DANH MỤC</h4>
              </div>
              <button
                className="w-5 h-5 sm:hidden"
                onClick={() => toggleSection('category')}>
                <ChevronDown
                  className={`h-5 font-medium transition-transform ${openSections['category'] ? 'rotate-180' : 'rotate-0'}`}
                />
              </button>
            </div>

            {category?.map(item => renderFooterLink(item))}

            {/* {openSections['category'] && (
              <ul className="space-y-2 text-sm">
                {['Điểm đo cao'].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Link
                      className="text-grayscale-40 hover:text-primary decoration-transparent"
                      href="#">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )} */}
          </div>

          {/* Contact & Certifications Column */}
          <section className="space-y-6">
            {/* Hotline Section */}
            <div className="border-b pb-3 sm:border-0 pb-0">
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-medium text-sm mb-4">TỔNG ĐÀI</h4>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex justify-between sm:block">
                  <p className="text-grayscale-40">Tư vấn mua hàng</p>
                  <p className="font-normal text-primary">
                    {contactInfo?.hotline1}
                  </p>
                </li>
                <li className="flex justify-between sm:block">
                  <p className="text-grayscale-40">
                    Trung tâm chăm sóc, dịch vụ
                  </p>
                  <p className="font-normal text-primary">
                    {contactInfo?.hotline2}
                  </p>
                </li>
                <li className="flex justify-between sm:block">
                  <p className="text-grayscale-40">Góp ý khiếu nại</p>
                  <p className="font-normal text-primary">
                    {contactInfo?.hotline3}
                  </p>
                </li>
              </ul>
            </div>

            {/* Certifications */}
            {/* <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-medium text-sm mb-4">CHỨNG NHẬN</h4>
              </div>

              <div className="flex space-x-4 text-sm">
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
                      style={{ width: 'auto' }}
                      width={48}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* Social Media */}
            <div className="border-b pb-3 sm:border-0 pb-0">
              <div className="flex justify-between items-center sm:flex-col sm:items-start">
                <div className="flex">
                  <span className="text-primary">
                    <Dot
                      className="text-primary -ml-2"
                      stroke="currentColor"
                      strokeWidth={5}
                    />
                  </span>
                  <h4 className="font-medium text-sm">KẾT NỐI VỚI CHÚNG TÔI</h4>
                </div>
                <div className="flex space-x-4 mt-3">
                  <Link
                    aria-label="Facebook"
                    className="hover:opacity-80 decoration-transparent"
                    href={contactInfo?.facebook || '#'}
                    rel="noopener noreferrer"
                    target="_blank">
                    <FacebookIcon />
                  </Link>
                  <Link
                    aria-label="Zalo"
                    className="hover:opacity-80 decoration-transparent"
                    href={contactInfo?.zalo || '#'}
                    rel="noopener noreferrer"
                    target="_blank">
                    <ZaloIcon />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Payment & App Download Column */}
          <section className="space-y-6">
            {/* Payment Methods */}
            {/* <div>
              <div className="flex">
                <span className="text-primary">
                  <Dot
                    className="text-primary -ml-2"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </span>
                <h4 className="font-medium text-sm mb-4">HỖ TRỢ THANH TOÁN</h4>
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
                      style={{ width: 'auto' }}
                      width={48}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* App Download */}
            <div>
              <div className="flex justify-between items-center sm:flex-col sm:items-start">
                <div className="flex">
                  <span className="text-primary">
                    <Dot
                      className="text-primary -ml-2"
                      stroke="currentColor"
                      strokeWidth={5}
                    />
                  </span>
                  <h4 className="font-medium text-sm mb-4">TẢI ỨNG DỤNG</h4>
                </div>
                <Image
                  priority
                  alt="QR Code"
                  className="rounded-lg"
                  height={120}
                  src="/images/qrCode.jpg"
                  style={{ width: 'auto' }}
                  width={120}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-grayscale-20 text-sm text-grayscale-80">
          <p>
            &copy; {new Date().getFullYear()} {contactInfo?.name} |{' '}
            {contactInfo?.registration}
          </p>
          <address className="mt-2 not-italic">
            <span>• Địa chỉ: {contactInfo?.address}</span> <br />
            <span>• Số điện thoại: {contactInfo?.phone}</span> <br />
            <span>• Email: {contactInfo?.email}</span> <br />
            <span>
              • Người chịu trách nhiệm nội dung: {contactInfo?.content}
            </span>
          </address>
        </div>
      </div>
    </footer>
  );
}
