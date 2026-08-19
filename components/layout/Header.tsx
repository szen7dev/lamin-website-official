'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Download, LogOut, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import MegaMenu from '@/features/menu/components/MegaMenu';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCart } from '@/features/cart/contexts/CartContext';
import { EmailLoginModal } from '@/components/modal/EmailLoginModal';
import { useContactInfo } from '@/hooks/useContactInfo';
import {
  WhiteFacebookIcon,
  WhiteTiktokIcon,
  WhiteYoutubeIcon,
  SearchIcon,
  LocationIcon,
  UserLoginIcon,
  WhiteCartIcon,
} from '@/components/icons';
// import { useGetSearchKeywordList } from '@/features/search/hooks/keyword/useGetSearchKeywordList';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api/apiClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Chữ cái đầu tên khách để thay avatar mặc định — phần lớn khách chưa từng tải ảnh đại diện lên, ảnh
// placeholder xám ngắt trông như tài khoản lỗi. Lấy chữ đầu TỪ ĐẦU + chữ đầu TỪ CUỐI (kiểu "Nguyễn Hữu
// Hiệp" → "NH"), khớp cách các app quen thuộc (Gmail, Slack…) rút gọn tên hiển thị.
const initialsOf = (name?: string) => {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailLoginModalOpen, setEmailLoginModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Inside the Header component, add the hook call before the return statement
  const { data: contactInfo, isLoading: isContactInfoLoading } =
    useContactInfo();

  const getHotline = () => {
    if (isContactInfoLoading) return 'Đang tải...';
    if (contactInfo?.hotline1) {
      return contactInfo.hotline1;
    }

    return '1800.646.970';
  };

  const getFacebookLink = () => {
    return contactInfo?.facebook || '#';
  };

  const getTiktokLink = () => {
    return contactInfo?.tiktok || '#';
  };

  const getYoutubeLink = () => {
    return contactInfo?.youtube || '#';
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  const handleLoginModalOpen = () => {
    setEmailLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  // User profile component that shows when logged in
  const UserProfile = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="!p-0 rounded-full bg-primary-blue px-3 md:px-4 text-white hover:bg-primary-blue/90 text-xs md:text-sm"
          variant="default">
          <div className="flex items-center gap-2">
            {user?.image ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                <Image
                  fill
                  alt={user?.name || 'User'}
                  className="object-cover"
                  sizes="32px"
                  src={apiClient.getUserImageUrl(user.image)}
                />
              </div>
            ) : (
              <div
                aria-label={user?.fullname || user?.name || 'User'}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary-blue">
                {initialsOf(user?.fullname || user?.name)}
              </div>
            )}
            {/* <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-sm leading-tight">
                {user?.fullname || user?.name || 'Anh A'}
              </span>
              <span className="text-xs leading-tight">
                {user?.phone || '0123456789'}
              </span>
            </div> */}
            {/* <ChevronDown className="h-4 w-4" /> */}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            className="decoration-transparent cursor-pointer"
            href="/tai-khoan/thong-tin-ca-nhan">
            Tài khoản của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="decoration-transparent cursor-pointer"
            href="/tai-khoan/don-hang">
            Đơn hàng của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="decoration-transparent cursor-pointer"
            href="/tai-khoan/cho-nha-ban-hang">
            Cho nhà bán hàng
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="decoration-transparent cursor-pointer"
            href="/tai-khoan/do-cao-khach-hang">
            Đo cao khách hàng
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="decoration-transparent cursor-pointer"
            href="/tai-khoan/lich-su-do-cao">
            Lịch sử đo cao
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 cursor-pointer"
          onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="w-full bg-gradient-primary">
      {/* Mobile Top Bar - Promotional Banner */}
      <div className="md:hidden bg-[#0052A4]">
        <div className="container mx-auto px-4">
          {/* Promo Text Row */}
          {/* <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white text-sm font-medium flex-1">
              <span>Chương trình Kích hoạt điện tử nhận quà</span>
            </div>
            <Link
              className="underline hover:text-white/80 text-white text-sm font-medium flex-shrink-0 ml-2"
              href="/activate-product">
              XEM THÊM
            </Link>
          </div> */}

          {/* Hotline and Social Media Row */}
          <div className="flex items-center justify-between py-3">
            {/* Hotline */}
            <Link
              className="flex items-center gap-2 text-white text-sm font-medium"
              href={`tel:${getHotline()}`}>
              <Phone className="h-5 w-5" />
              <span>Hotline: {getHotline()}</span>
            </Link>

            {/* Social Media Links */}
            <div className="flex items-center gap-2">
              <Link
                aria-label="Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white hover:bg-white/10 transition-all"
                href={getFacebookLink()}
                rel="noopener noreferrer"
                target="_blank">
                <WhiteFacebookIcon height={18} width={18} />
              </Link>
              <Link
                aria-label="Tiktok"
                className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white hover:bg-white/10 transition-all"
                href={getTiktokLink()}
                rel="noopener noreferrer"
                target="_blank">
                <WhiteTiktokIcon height={18} width={18} />
              </Link>
              <Link
                aria-label="Youtube"
                className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white hover:bg-white/10 transition-all"
                href={getYoutubeLink()}
                rel="noopener noreferrer"
                target="_blank">
                <WhiteYoutubeIcon height={18} width={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Top Bar - Hotline and Social Media */}
      <div className="hidden md:block bg-[#0052A4] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 max-w-[1440px] mx-auto">
            {/* Hotline */}
            <div className="flex items-center gap-2 text-white text-xs lg:text-sm">
              <Link
                className="flex items-center gap-2 text-white text-sm font-medium"
                href={`tel:${getHotline()}`}>
                <Phone className="h-4 w-4" />
                <span>Hotline: {getHotline()}</span>
              </Link>
            </div>

            {/* Promo Text */}
            {/* <div className="flex items-center gap-2 text-white text-xs lg:text-sm font-bold">
              <span>Chương trình Kích hoạt điện tử nhận quà</span>
              <Link
                className="underline hover:text-white/80 text-white"
                href="/activate-product">
                XEM THÊM
              </Link>
            </div> */}

            {/* Social Media Links */}
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                aria-label="Facebook"
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white hover:bg-white/10 transition-all"
                href={getFacebookLink()}
                rel="noopener noreferrer"
                target="_blank">
                <WhiteFacebookIcon height={16} width={16} />
              </Link>
              <Link
                aria-label="Tiktok"
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white hover:bg-white/10 transition-all"
                href={getTiktokLink()}
                rel="noopener noreferrer"
                target="_blank">
                <WhiteTiktokIcon height={16} width={16} />
              </Link>
              <Link
                aria-label="Youtube"
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white hover:bg-white/10 transition-all"
                href={getYoutubeLink()}
                rel="noopener noreferrer"
                target="_blank">
                <WhiteYoutubeIcon height={16} width={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with Menu */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-[1440px] mx-auto py-3 md:py-2 lg:py-3">
            {/* Logo */}
            <Link
              aria-label="Lamin"
              className="flex items-center flex-shrink-0"
              href="/">
              <Image
                alt="Logo"
                className="h-8 md:h-7 w-auto"
                height={40}
                src="/images/LogoLamin_Blue.webp"
                style={{ width: 'auto' }}
                width={80}
              />
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:block flex-1 mx-4 lg:mx-6 xl:mx-8">
              <MegaMenu />
            </div>

            {/* Icon Buttons */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
              {/* Search Icon */}
              {/* <button
                aria-label="Search"
                className="text-primary hover:opacity-80 transition-opacity p-1">
                <SearchIcon />
              </button> */}

              {/* Location Icon */}
              <Link
                aria-label="Store Locations"
                className="text-primary hover:opacity-80 transition-opacity p-1"
                href="/he-thong-cua-hang">
                <LocationIcon />
              </Link>

              {/* Login Icon */}
              {isAuthenticated ? (
                <div className="hidden md:block">
                  <UserProfile />
                </div>
              ) : (
                <button
                  aria-label="Login"
                  className="text-primary hover:opacity-80 transition-opacity p-1"
                  onClick={() => setEmailLoginModalOpen(true)}>
                  <UserLoginIcon />
                </button>
              )}

              {/* Cart Icon with Badge */}
              <Link
                aria-label="Cart"
                className="relative hover:opacity-90 transition-opacity"
                href="/cart">
                <div className="bg-primary rounded-full w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 flex items-center justify-center md:justify-start md:gap-2">
                  <WhiteCartIcon />
                  <span className="hidden md:inline text-white font-medium text-xs lg:text-sm">
                    Giỏ Hàng
                  </span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F37021] text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {/* Mobile Menu Button - visible on mobile only */}
              <button
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Toggle on Mobile */}
      <button
        aria-label="Close mobile menu"
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Navigation - Now using transform and transitions instead of conditional rendering */}
      <nav
        aria-label="Mobile Navigation"
        className={`fixed w-[80vw] h-[100vh] flex flex-col justify-between top-0 left-0 bottom-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div>
          <div className="container bg-gradient-primary py-3">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
                <Button
                  className="rounded-full bg-white px-3 md:px-6 text-primary hover:bg-white/90 text-xs md:text-sm"
                  variant="secondary"
                  onClick={handleLoginModalOpen}>
                  <UserLoginIcon />
                  <span className="font-medium text-sm">
                    Đăng Nhập - Đăng Ký
                  </span>
                </Button>
              </>
            )}
          </div>
          <div className="container mx-auto px-4">
            <MegaMenu onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
        <div className="container py-5 border-t">
          <span className="text-grayscale-50">
            Trải nghiệm tốt nhất với ứng dụng
          </span>
          <div className="flex mt-2 gap-2">
            <div className="flex items-center gap-2 rounded-full text-sm font-medium border bg-primary-50 border-white/20 px-4 py-2 text-white justify-center">
              <Download className="h-5 w-5" />
              <span className="truncate">Tải ngay</span>
            </div>
            <div className="flex items-center gap-2 rounded-full text-sm font-medium bg-primary-5 px-4 py-2 text-white justify-center">
              <Phone className="h-5 w-5 text-primary-50 " />
              <div>
                <span className="mr-1 text-primary-50">Tư vấn:</span>
                <span className="text-primary-50">{getHotline()}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <EmailLoginModal
        open={emailLoginModalOpen}
        onOpenChange={() => setEmailLoginModalOpen(false)}
      />
    </header>
  );
}
