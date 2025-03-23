'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Download, Menu, Phone, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import SearchBar from '@/features/search/components/SearchBar';
import MegaMenu from '@/features/menu/components/MegaMenu';
import { CartDropdown } from '@/features/cart/components/CartDropdown';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCart } from '@/features/cart/hooks/useCart';
import { Separator } from '@/components/ui/separator';
// Import the LoginModal component at the top of the file
import { LoginModal } from '@/components/ui/LoginModal';
// Add the import for useContactInfo at the top with other imports
import { useContactInfo } from '@/hooks/useContactInfo';
import { CartIcon, PhoneIcon, UserIcon } from '@/components/icons';
import { useGetSearchKeywordList } from '@/features/search/hooks/keyword/useGetSearchKeywordList';
import { useUpdateSearchKeyword } from '@/features/search/hooks/keyword/useUpdateSearchKeyword';

const popularKeywords = [
  { label: 'Thuốc nhỏ mắt', href: '#' },
  { label: 'Men vi sinh', href: '#' },
  { label: 'Bột hòa tan', href: '#' },
  { label: 'Omega 3', href: '#' },
  { label: 'Siro ho', href: '#' },
  { label: 'Canxi', href: '#' },
  { label: 'Kẽm', href: '#' },
];

export function Header() {
  // Get top search keywords
  const { keywords } = useGetSearchKeywordList();

  // Update keyword popularity when user searches
  const { updateKeyword } = useUpdateSearchKeyword();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Add a state for controlling the login modal visibility
  // Add this inside the Header function component, near the top with other state declarations:
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { totalItems } = useCart();

  // Inside the Header component, add the hook call before the return statement
  const { data: contactInfo, isLoading: isContactInfoLoading } =
    useContactInfo();

  const getHotline = () => {
    if (isContactInfoLoading) return 'Đang tải...';
    if (
      contactInfo &&
      Array.isArray(contactInfo) &&
      contactInfo.length > 0 &&
      contactInfo[0]?.hotline1
    ) {
      return contactInfo[0].hotline1;
    }

    return '1800 6789';
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  return (
    <header className="w-full bg-gradient-3">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
          <div className="flex flex-col grow justify-between md:h-auto">
            {/* Top Row with Logo, Actions and Auth */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 h-max items-start sm:items-center justify-between">
              {/* Mobile Menu Button and Logo - Only visible on small screens */}
              <div className="flex w-full justify-between items-center sm:hidden">
                <Link
                  aria-label="Elena Pharmacy Home"
                  className="flex items-end gap-2"
                  href="/">
                  <Image
                    alt="FPT Retail"
                    className="h-8 w-auto"
                    height={32}
                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
                    width={32}
                    style={{ width: 'auto' }}
                  />
                  <div className="text-white">
                    <div className="text-xs font-medium">NHÀ THUỐC</div>
                    <div className="text-base font-bold leading-none">
                      LONG CHÂU
                    </div>
                  </div>
                </Link>
                <button
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  className="text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              <div className="hidden sm:flex justify-items-start gap-4">
                {/* Logo */}
                <Link
                  aria-label="Elena Pharmacy Home"
                  className="flex items-end gap-2"
                  href="/">
                  <Image
                    alt="FPT Retail"
                    className="h-10 w-auto"
                    height={40}
                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
                    width={40}
                    style={{ width: 'auto' }}
                  />
                  <div className="text-white">
                    <div className="text-xs font-medium">NHÀ THUỐC</div>
                    <div className="text-lg font-bold leading-none">
                      LONG CHÂU
                    </div>
                  </div>
                </Link>

                {/* Contact and Download - Hidden on mobile, visible on medium screens */}
                <div className="hidden md:flex items-end gap-4 ml-4 text-sm">
                  {/* Find the hotline display section and replace it with this dynamic version */}
                  {/* Look for the section with <Phone className="h-5 w-5 text-white" /> and replace that div with: */}
                  <div className="flex items-end gap-2">
                    <Phone className="h-5 w-5 text-white" />
                    <div className="text-white">
                      <span className="mr-1">Tư vấn ngay:</span>
                      <span className="font-normal">{getHotline()}</span>
                    </div>
                  </div>
                  <div className="h-5">
                    <Separator
                      className="h-full bg-white"
                      orientation="vertical"
                    />
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    {/* <Download className="h-5 w-5" /> */}
                    <PhoneIcon height={20} width={12} />
                    <span>Tải ứng dụng</span>
                  </div>
                </div>
              </div>

              {/* Auth and Cart */}
              <div className="hidden sm:flex items-center gap-2 md:gap-4 mt-4 sm:mt-0">
                {/* Update the Button for login to open the modal when clicked */}
                {/* Find the existing login button and replace it with: */}
                <Button
                  className="rounded-full bg-white px-3 md:px-6 text-primary hover:bg-white/90 text-xs md:text-sm"
                  variant="secondary"
                  onClick={() => setLoginModalOpen(true)}>
                  <UserIcon height={24} width={24} />
                  <span className="font-medium">Đăng Nhập</span>
                </Button>

                <div className={`relative ${totalItems > 0 ? 'group' : ''}`}>
                  <Link
                    className="hover:no-underline h-10 flex items-center gap-2 rounded-full bg-primary px-3 md:px-6 py-2 text-white hover:bg-primary/70 text-xs md:text-sm relative"
                    href="/cart">
                    <CartIcon height={15} width={17} />
                    <span className="font-medium">Giỏ Hàng</span>
                    {totalItems > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-5 text-xs font-bold text-white">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  {/* Dropdown content that appears on hover only when items exist */}
                  {totalItems > 0 && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-[400px] p-0 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <CartDropdown />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Bar Section */}
            <div className="flex gap-4 py-3 mt-2 sm:mt-0">
              <div className="flex-1">
                <SearchBar />
              </div>
            </div>

            {/* Popular Keywords - Hidden on smallest screens */}
            <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-1 pb-1">
              <span className="text-sm text-white/80">Từ khóa phổ biến:</span>
              {keywords.map(keyword => (
                <Link
                  key={keyword._id}
                  className="text-sm text-white decoration-white underline decoration-1 underline-offset-4 hover:text-white/90"
                  href={`/search?q=${encodeURIComponent(keyword.keyword)}`}
                  onClick={() => {
                    updateKeyword(keyword.keyword);
                  }}>
                  {keyword.keyword}
                </Link>
              ))}
            </div>
          </div>

          {/* QR Code Section - Hidden on mobile */}
          <div className="hidden md:flex w-[143px] flex-shrink-0 flex-col items-center justify-center rounded-xl bg-[#F37021] self-stretch">
            <div className="text-center text-white p-2">
              <div className="text-xs font-medium">- Quét Mã QR -</div>
              <div className="text-sm font-bold">Tặng Voucher 1tr</div>
            </div>
            <div className="bg-white p-2 rounded-b-xl w-full flex-1 flex items-center justify-center">
              <Image
                alt="QR Code"
                className="object-contain"
                height={100}
                src="/images/qrCode.png"
                width={100}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Auth and Cart - Only visible on small screens */}
      <div className="flex sm:hidden justify-between items-center px-4 py-2 bg-white/10">
        <Button
          className="rounded-full bg-white px-4 text-primary hover:bg-white/90 text-xs h-8"
          variant="secondary"
          onClick={() => setLoginModalOpen(true)}>
          <User className="mr-1 h-3 w-3" />
          <span className="font-medium">Đăng Nhập</span>
        </Button>
        <Link
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-1 text-white hover:bg-primary/90 text-xs h-8 relative"
          href="/cart">
          <ShoppingCart className="mr-1 h-3 w-3" />
          <span className="font-medium">Giỏ Hàng</span>
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-5 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Menu - Toggle on Mobile */}
      <nav
        aria-label="Main Navigation"
        className={`border-t border-white/10 bg-white ${mobileMenuOpen || !isMobile ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4">
          <MegaMenu />
        </div>
      </nav>

      {/* Mobile Contact and Download - Show in Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-3">
            {/* Also update the mobile version of the phone number in the mobile menu section */}
            {/* Find the section with <Phone className="h-5 w-5" /> in the mobile menu and replace that div with: */}
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white w-full justify-center">
              <Phone className="h-5 w-5" />
              <div>
                <span className="mr-1 text-sm">Tư vấn ngay:</span>
                <span className="font-medium">{getHotline()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white w-full justify-center">
              <Download className="h-5 w-5" />
              <span>Tải ứng dụng</span>
            </div>
          </div>
        </div>
      )}
      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </header>
  );
}
