import {
  Download,
  MessageCircle,
  Phone,
  Search,
  ShoppingCart,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        {/* Top header with contact info */}
        <div className='py-2 border-b border-gray-100 hidden md:flex justify-between items-center text-sm'>
          <div className='flex items-center'>
            <Phone className='h-4 w-4 text-primary-600 mr-2' />
            <span>
              Hotline:{' '}
              <a
                href='tel:19001234'
                className='font-medium hover:text-primary-600 transition-colors'
              >
                1900 1234
              </a>
            </span>
          </div>
          <div className='flex items-center space-x-6'>
            <a
              href='#'
              className='flex items-center text-gray-700 hover:text-primary-600 transition-colors'
            >
              <Download className='h-4 w-4 mr-1' />
              <span className='text-sm'>Tải ứng dụng</span>
            </a>
            <Link
              href='/contact'
              className='hover:text-primary-600 transition-colors'
            >
              Liên hệ
            </Link>
          </div>
        </div>

        {/* Main header with logo, search and navigation */}
        <div className='py-4 flex items-center justify-between gap-4'>
          {/* Logo */}
          <Link href='/' className='flex-shrink-0'>
            <div className='relative h-10 w-32 md:h-12 md:w-36'>
              <Image
                src='https://seeklogo.com/images/F/fpt-retail-nha-thuc-long-chau-logo-4D382DA20B-seeklogo.com.png'
                alt='Elena Pharmacy Logo'
                fill
                className='object-contain'
                priority
              />
            </div>
          </Link>

          {/* Search Bar */}
          <div className='hidden md:block w-full max-w-xl'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Tìm kiếm sản phẩm, bài viết...'
                className='w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'
              />
              <button className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors'>
                <Search className='h-5 w-5' />
              </button>
            </div>
            <div className='mt-1 text-xs text-gray-500'>
              <span>Từ khóa gần đây: </span>
              <span className='text-primary-600 hover:underline cursor-pointer'>
                Vitamin C, Sữa cho trẻ, Thuốc ho
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center space-x-1 sm:space-x-4 md:space-x-6'>
            <button className='md:hidden text-gray-700 hover:text-primary-600 transition-colors'>
              <Search className='h-6 w-6' />
            </button>

            <Link
              href='/contact'
              className='hidden sm:flex items-center text-gray-700 hover:text-primary-600 transition-colors'
            >
              <MessageCircle className='h-5 w-5 md:mr-2' />
              <span className='hidden lg:inline text-sm'>Tư vấn</span>
            </Link>

            <Link
              href='/cart'
              className='flex items-center text-gray-700 hover:text-primary-600 transition-colors relative'
            >
              <div className='relative'>
                <ShoppingCart className='h-5 w-5' />
                <span className='absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
                  0
                </span>
              </div>
              <span className='hidden lg:inline ml-2 text-sm'>Giỏ hàng</span>
            </Link>

            <div className='relative group'>
              <Link
                href='/account'
                className='flex items-center text-gray-700 hover:text-primary-600 transition-colors'
              >
                <User className='h-5 w-5' />
                <span className='hidden lg:inline ml-2 text-sm'>Tài khoản</span>
              </Link>

              <div className='absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-50 hidden group-hover:block'>
                <Link
                  href='/login'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                >
                  Đăng nhập
                </Link>
                <Link
                  href='/register'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                >
                  Đăng ký
                </Link>
                <hr className='my-1' />
                <Link
                  href='/account/profile'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                >
                  Thông tin cá nhân
                </Link>
                <Link
                  href='/account/orders'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                >
                  Đơn hàng của tôi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='py-2 border-t border-gray-100 overflow-x-auto scrollbar-hide'>
          <ul className='flex space-x-6 md:space-x-8'>
            <li>
              <Link
                href='/'
                className='font-medium hover:text-primary-600 transition-colors whitespace-nowrap text-sm py-1 inline-block border-b-2 border-transparent hover:border-primary-600'
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href='/products'
                className='font-medium hover:text-primary-600 transition-colors whitespace-nowrap text-sm py-1 inline-block border-b-2 border-transparent hover:border-primary-600'
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                href='/trusted-shops'
                className='font-medium hover:text-primary-600 transition-colors whitespace-nowrap text-sm py-1 inline-block border-b-2 border-transparent hover:border-primary-600'
              >
                Shop uy tín
              </Link>
            </li>
            <li>
              <Link
                href='/height-measurement'
                className='font-medium hover:text-primary-600 transition-colors whitespace-nowrap text-sm py-1 inline-block border-b-2 border-transparent hover:border-primary-600'
              >
                Đo chiều cao
              </Link>
            </li>
            <li>
              <Link
                href='/nutrition-check'
                className='font-medium hover:text-primary-600 transition-colors whitespace-nowrap text-sm py-1 inline-block border-b-2 border-transparent hover:border-primary-600'
              >
                Kiểm tra dinh dưỡng
              </Link>
            </li>
            <li>
              <Link
                href='/blog'
                className='font-medium hover:text-primary-600 transition-colors whitespace-nowrap text-sm py-1 inline-block border-b-2 border-transparent hover:border-primary-600'
              >
                Tin tức
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
