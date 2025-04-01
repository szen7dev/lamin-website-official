'use client'; //

import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  Download,
  LogOut,
  Menu,
  Phone,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import SearchBar from '@/features/search/components/SearchBar';
import MegaMenu from '@/features/menu/components/MegaMenu';
import { CartDropdown } from '@/features/cart/components/CartDropdown';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCart } from '@/features/cart/hooks/useCart';
import { Separator } from '@/components/ui/separator';
import { LoginModal } from '@/components/modal/LoginModal';
import { useContactInfo } from '@/hooks/useContactInfo';
import { CartIcon, PhoneIcon, UserIcon } from '@/components/icons';
import { useGetSearchKeywordList } from '@/features/search/hooks/keyword/useGetSearchKeywordList';
import { useUpdateSearchKeyword } from '@/features/search/hooks/keyword/useUpdateSearchKeyword';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api/apiClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  // Get top search keywords
  const { keywords } = useGetSearchKeywordList();

  // Update keyword popularity when user searches
  const { updateKeyword } = useUpdateSearchKeyword();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Add a state for controlling the login modal visibility
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [selectedKeyword, setSelectedKeyword] = useState('');

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

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  const handleClickKeyword = (keyword: string) => {
    setSelectedKeyword(keyword);
    updateKeyword(keyword);
  };

  const handleClearSearch = () => {
    setSelectedKeyword('');
  };

  // User profile component that shows when logged in
  const UserProfile = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full bg-primary-blue px-3 md:px-4 text-white hover:bg-primary-blue/90 text-xs md:text-sm"
          variant="default">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
              <Image
                fill
                alt={user?.name || 'User'}
                className="object-cover"
                sizes="32px"
                src={
                  user?.image
                    ? apiClient.getUserImageUrl(user.image)
                    : '/images/default-avatar.png'
                }
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-sm leading-tight">
                {user?.fullname || user?.name || 'Anh A'}
              </span>
              <span className="text-xs leading-tight">
                {user?.phone || '0123456789'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link className="decoration-transparent" href="/profile">
            Tài khoản của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="decoration-transparent" href="/orders">
            Đơn hàng của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="decoration-transparent" href="/favorites">
            Danh sách yêu thích
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Mobile user profile component
  const MobileUserProfile = () => (
    <Button
      className="rounded-full bg-primary-blue px-4 text-white hover:bg-primary-blue/90 text-xs h-8"
      variant="default"
      onClick={() => setMobileMenuOpen(true)}>
      <div className="flex items-center gap-2">
        <div className="relative h-5 w-5 overflow-hidden rounded-full bg-gray-200">
          <Image
            fill
            alt={user?.name || 'User'}
            className="object-cover"
            sizes="20px"
            src={
              user?.image
                ? apiClient.getUserImageUrl(user.image)
                : '/images/default-avatar.png'
            }
          />
        </div>
        <span className="font-medium">
          {user?.fullname?.split(' ').pop() ||
            user?.name?.split(' ').pop() ||
            'Tài khoản'}
        </span>
      </div>
    </Button>
  );

  return (
    <header className="w-full bg-gradient-primary">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
          <div className="flex flex-col grow justify-between md:h-auto">
            {/* Top Row with Logo, Actions and Auth */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 h-max items-start sm:items-center justify-between">
              {/* Mobile Menu Button and Logo - Only visible on small screens */}
              {/* <div className="flex w-full justify-between items-center sm:hidden"> */}
              <div className="grid grid-cols-3 items-center w-full sm:hidden">
                <button
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  className="col-span-1 text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? (
                    <X className="h-7 w-7" />
                  ) : (
                    <Menu className="h-7 w-7" />
                  )}
                </button>
                <Link
                  aria-label="Lamin Pharmacy Home"
                  className="col-span-1 mx-auto flex items-end gap-2"
                  href="/">
                  <Image
                    alt="Logo"
                    className="h-20 w-auto"
                    height={80}
                    src="/images/KhaiTruongWinggo.svg"
                    style={{ width: 'auto' }}
                    width={80}
                  />
                  {/* <div className="text-white">
                    <div className="text-xs font-medium">NHÀ THUỐC</div>
                    <div className="text-base font-bold leading-none">
                      LONG CHÂU
                    </div>
                  </div> */}
                </Link>
                <div className="col-span-1 ml-auto flex gap-2">
                  <div className=" relative p-1 bg-primary-50 w-10 h-10 flex items-center justify-center rounded-full">
                    {/* <CartIcon
                      className="text-grayscale-5"
                      fill="#F9F9FB"
                      height={23}
                      width={23}
                    />
                    {totalItems > 0 && (
                      <span className="absolute left-6 top-2 flex h-3 w-3 items-center justify-center rounded-full bg-[#F37021] font-bold text-white text-[8px]">
                        {totalItems}
                      </span>
                    )} */}

                    <div
                      className={`relative ${totalItems > 0 ? 'group' : ''}`}>
                      <Link
                        className="hover:no-underline h-10 w-10 flex items-center justify-center gap-2 rounded-full bg-primary px-3 md:px-6 py-2 text-white hover:bg-primary/70 text-xs md:text-sm relative"
                        href="/cart">
                        <CartIcon
                          className="text-grayscale-5"
                          fill="#F9F9FB"
                          height={23}
                          width={23}
                        />
                        {totalItems > 0 && (
                          <span className="absolute left-6 top-2 flex h-3 w-3 items-center justify-center rounded-full bg-[#F37021] font-bold text-white text-[8px]">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-sm p-1 bg-white w-10 h-10">
                    <Image
                      priority
                      alt="QR Code"
                      className="object-contain"
                      height={100}
                      src="/images/qrCode.png"
                      width={100}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:flex justify-items-start gap-4">
                {/* Logo */}
                <Link
                  aria-label="Lamin Pharmacy Home"
                  className="flex items-end gap-2"
                  href="/">
                  <Image
                    alt="Logo"
                    className="h-20 w-auto hidden sm:block"
                    height={40}
                    src="/images/KhaiTruongWinggo.svg"
                    style={{ width: 'auto' }}
                    width={40}
                  />
                  {/* <div className="text-white">
                    <div className="text-xs font-medium">NHÀ THUỐC</div>
                    <div className="text-lg font-bold leading-none">
                      LONG CHÂU
                    </div>
                  </div> */}
                </Link>

                {/* Contact and Download - Hidden on mobile, visible on medium screens */}
                <div className="hidden md:flex items-end gap-4 ml-4 text-sm">
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
                    <PhoneIcon height={20} width={12} />
                    <span>Tải ứng dụng</span>
                  </div>
                </div>
              </div>

              {/* Auth and Cart */}
              <div className="hidden sm:flex items-center gap-2 md:gap-4 mt-4 sm:mt-0">
                {/* Conditionally show user profile or login button */}
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <Button
                    className="rounded-full bg-white px-3 md:px-6 text-primary hover:bg-white/90 text-xs md:text-sm"
                    variant="secondary"
                    onClick={() => setLoginModalOpen(true)}>
                    <UserIcon height={24} width={24} />
                    <span className="font-medium">Đăng Nhập</span>
                  </Button>
                )}

                <div className={`relative ${totalItems > 0 ? 'group' : ''}`}>
                  <Link
                    className="hover:no-underline h-10 flex items-center gap-2 rounded-full bg-primary px-3 md:px-6 py-2 text-white hover:bg-primary/70 text-xs md:text-sm border border-white"
                    href="/cart">
                    <CartIcon height={15} width={17} />
                    <span className="font-medium">Giỏ Hàng</span>
                    {totalItems > 0 && (
                      <span className="absolute left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-30 text-xs font-bold text-white">
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
            <div className="flex gap-4 sm:py-3 sm:mt-0">
              <div className="flex-1">
                <SearchBar
                  selectedKeyword={selectedKeyword}
                  onClearSearch={handleClearSearch}
                />
              </div>
            </div>

            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 pb-1 ${isMobile ? 'pt-3' : ''}`}>
              <span className="text-sm text-white/80">Tìm kiếm phổ biến:</span>
              {keywords?.map(keyword => (
                <button
                  key={keyword._id}
                  className="text-sm text-white decoration-white underline underline-offset-4 hover:text-white/90"
                  onClick={() => handleClickKeyword(keyword.keyword)}>
                  {keyword.keyword}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code Section - Hidden on mobile */}
          <div className="hidden md:flex w-[143px] flex-shrink-0 flex-col items-center justify-center rounded-xl bg-[#F37021] self-stretch">
            <div className="text-center text-white p-2">
              <div className="text-xs font-medium">Quét Mã QR kênh CSKH</div>
              {/* <div className="text-sm font-bold">Tặng bộ Voucher 1 triệu</div> */}
            </div>
            <div className="bg-white p-2 rounded-b-xl w-full flex-1 flex items-center justify-center">
              <Image
                priority
                alt="QR Code"
                className="object-contain"
                height={100}
                src="/images/qrCode.png"
                width={100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Auth and Cart - Only visible on small screens */}
      <div className="hidden justify-between items-center px-4 py-2 bg-white/10">
        {/* Conditionally show mobile user profile or login button */}
        {isAuthenticated ? (
          <MobileUserProfile />
        ) : (
          <Button
            className="rounded-full bg-white px-4 text-primary hover:bg-white/90 text-xs h-8"
            variant="secondary"
            onClick={() => setLoginModalOpen(true)}>
            <User className="mr-1 h-3 w-3" />
            <span className="font-medium">Đăng Nhập</span>
          </Button>
        )}
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
        className={`fixed w-[80vw] h-[100vh] flex flex-col justify-between top-0 left-0 bottom-0 z-50 border-t border-white/10 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="">
          <div className="bg-primary-50 flex justify-between container">
            <Link
              aria-label="Lamin Pharmacy Home"
              className="col-span-1"
              href="/">
              <Image
                alt="Logo"
                className="h-20 w-auto"
                height={80}
                src="/images/KhaiTruongWinggo.svg"
                style={{ width: 'auto' }}
                width={80}
              />
            </Link>
            <button
              aria-label="Close menu"
              className="col-span-1 text-white"
              onClick={() => setMobileMenuOpen(false)}>
              <X className="h-7 w-7" />
            </button>
          </div>
          <div className="container bg-gradient-primary py-3">
            <p className="text-grayscale-5 text-base font-normal mb-3">
              Đăng nhập để hưởng những đặc quyền dành riêng cho thành viên
            </p>
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <Button
                className="rounded-full bg-white px-3 md:px-6 text-primary hover:bg-white/90 text-xs md:text-sm"
                variant="secondary"
                onClick={() => setLoginModalOpen(true)}>
                <span className="font-medium text-sm">Đăng Nhập</span>
              </Button>
            )}
          </div>
          <div className="container mx-auto px-4">
            <MegaMenu />
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

      {/* Desktop Navigation */}
      <nav
        aria-label="Desktop Navigation"
        className={`hidden md:block flex-col justify-between top-0 bottom-0 z-50 border-t border-white/10 bg-white`}>
        <div className="container mx-auto px-4">
          <MegaMenu />
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </header>
  );
}
