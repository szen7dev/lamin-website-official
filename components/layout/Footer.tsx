'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { useState } from 'react';

import { useContactInfo } from '@/hooks/useContactInfo';
import { MessengerIcon, ZaloIcon } from '@/components/icons';
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
      [section]: !prev[section],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  };

  const renderFooterLink = (item?: { slug: string; name: string }) => {
    return (
      <Link
        key={item?.slug}
        className="text-white/80 hover:text-white decoration-transparent text-sm hidden sm:block mb-3"
        href={`/${item?.slug}`}>
        {item?.name}
      </Link>
    );
  };

  const renderMobileFooterLink = (
    item: { slug: string; name: string } | undefined,
    section: string,
  ) => {
    if (!item) return null;

    return (
      <Link
        key={item.slug}
        className={`text-white/80 hover:text-white decoration-transparent text-sm block sm:hidden mb-3 ${openSections[section] ? 'block' : 'hidden'}`}
        href={`/${item.slug}`}>
        {item.name}
      </Link>
    );
  };

  return (
    <footer className="relative bg-[#0052A4] overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          fill
          priority
          alt="Footer Background"
          className="object-cover opacity-15"
          src="/images/footer-bg.jpg"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Fixed Social Icons - Right Side */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        <button
          aria-label="Scroll to top"
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
          onClick={scrollToTop}>
          <ChevronUp className="w-5 h-5 text-[#0052A4]" />
        </button>
        <Link
          aria-label="Phone"
          className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          href={`tel:${contactInfo?.phone}`}>
          <Phone className="w-5 h-5 text-white" />
        </Link>
        <Link
          aria-label="Zalo"
          className="hover:opacity-80 transition-opacity shadow-lg rounded-full"
          href={contactInfo?.zalo || '#'}
          rel="noopener noreferrer"
          target="_blank">
          <ZaloIcon height="48" width="48" />
        </Link>
        <Link
          aria-label="Messenger"
          className="hover:opacity-80 transition-opacity shadow-lg rounded-full"
          href={contactInfo?.facebook || '#'}
          rel="noopener noreferrer"
          target="_blank">
          <MessengerIcon height="48" width="48" />
        </Link>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Section - Company Info */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <Link className="inline-block mb-6" href="/">
              <Image
                priority
                alt="Lamin"
                className="h-12 w-auto brightness-0 invert"
                height={48}
                src="/images/LogoLamin_Blue.webp"
                style={{ width: 'auto' }}
                width={120}
              />
            </Link>

            {/* Company Info */}
            <div className="mb-6 hidden sm:block">
              <p className="text-white font-medium text-sm mb-2">
                <svg
                  className="inline-block mr-2 -mt-1"
                  fill="currentColor"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
                {contactInfo?.name}
              </p>
              <p className="text-white/80 text-sm leading-relaxed ml-6">
                {contactInfo?.address}
              </p>
            </div>

            {/* Phone Button */}
            <Link
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 border-2 border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-[#0052A4] transition-all font-medium"
              href={`tel:${contactInfo?.hotline1}`}>
              <Phone className="w-5 h-5" />
              <span>Tổng đài miễn cước: {contactInfo?.hotline1}</span>
            </Link>
          </div>

          {/* Middle Section - Links */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* About Us Column */}
            <div className="border-b pb-4 sm:border-0">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm mb-4">
                  VỀ CHÚNG TÔI
                </h4>
                <button
                  aria-expanded={openSections['about'] ? 'true' : 'false'}
                  aria-label="Toggle About Us section"
                  className="sm:hidden text-white"
                  onClick={() => toggleSection('about')}>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${openSections['about'] ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>
              </div>
              {aboutUs?.map(item => renderFooterLink(item))}
              {aboutUs?.map(item => renderMobileFooterLink(item, 'about'))}
              <Image
                alt="Logo Lamin"
                className="h-12 w-auto"
                height={48}
                src="/images/bo-cong-thuong.png"
                style={{ width: 'auto' }}
                width={120}
              />
            </div>

            {/* Policies Column */}
            <div className="border-b pb-4 sm:border-0">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm mb-4">
                  CHÍNH SÁCH
                </h4>
                <button
                  aria-expanded={openSections['category'] ? 'true' : 'false'}
                  aria-label="Toggle Policies section"
                  className="sm:hidden text-white"
                  onClick={() => toggleSection('category')}>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${openSections['category'] ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>
              </div>
              {category?.map(item => renderFooterLink(item))}
              {category?.map(item => renderMobileFooterLink(item, 'category'))}
            </div>

            {/* Learn More Column */}
            <div className="border-b pb-4 sm:border-0">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm mb-4">
                  TÌM HIỂU THÊM
                </h4>
                <button
                  aria-expanded={openSections['learnMore'] ? 'true' : 'false'}
                  aria-label="Toggle Learn More section"
                  className="sm:hidden text-white"
                  onClick={() => toggleSection('learnMore')}>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${openSections['learnMore'] ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>
              </div>
              {learnMore?.map(item => renderFooterLink(item))}
              {learnMore?.map(item =>
                renderMobileFooterLink(item, 'learnMore'),
              )}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-6 border-t border-white/20">
          <p className="text-white/90 text-sm text-center">
            &copy; Bản quyền thuộc về Lamin
          </p>
        </div>
      </div>

      {/* Mobile Social Icons - Bottom */}
      <div className="lg:hidden fixed bottom-4 right-4 flex gap-3 z-50">
        <button
          aria-label="Scroll to top"
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
          onClick={scrollToTop}>
          <ChevronUp className="w-5 h-5 text-[#0052A4]" />
        </button>
        <Link
          aria-label="Phone"
          className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          href={`tel:${contactInfo?.hotline1}`}>
          <Phone className="w-5 h-5 text-white" />
        </Link>
        <Link
          aria-label="Zalo"
          className="hover:opacity-80 transition-opacity shadow-lg rounded-full"
          href={contactInfo?.zalo || '#'}
          rel="noopener noreferrer"
          target="_blank">
          <ZaloIcon height="48" width="48" />
        </Link>
        <Link
          aria-label="Messenger"
          className="hover:opacity-80 transition-opacity shadow-lg rounded-full"
          href={contactInfo?.facebook || '#'}
          rel="noopener noreferrer"
          target="_blank">
          <MessengerIcon height="48" width="48" />
        </Link>
      </div>
    </footer>
  );
}
