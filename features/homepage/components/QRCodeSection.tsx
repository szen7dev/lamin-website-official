import { Zap } from 'lucide-react'
import Image from 'next/image'

export default function QRCodeSection() {
  return (
    <div className='flex flex-col md:flex-row items-center justify-center gap-8 py-6 bg-primary-50 rounded-lg'>
      <div className='text-center md:text-left md:w-1/2 lg:w-2/5'>
        <h2 className='text-2xl md:text-3xl font-bold text-primary-700 mb-4'>
          Quét QR Zalo OA - Nhận Ngay Voucher 1 Triệu Đồng!
        </h2>
        <p className='text-gray-600 mb-6 max-w-md mx-auto md:mx-0'>
          Quét mã QR Zalo OA của Elena để nhận ngay voucher giảm giá khủng và
          cập nhật thông tin khuyến mãi độc quyền!
        </p>
        <div className='bg-primary-600 text-white font-semibold py-3 px-6 rounded-full inline-flex items-center'>
          <Zap className='mr-2 h-5 w-5' />
          Ưu đãi độc quyền chỉ có tại Zalo OA
        </div>
      </div>

      <div className='relative w-56 h-56 md:w-64 md:h-64 border-4 border-primary-500 rounded-lg p-2 bg-white'>
        <Image
          src='https://img.freepik.com/premium-vector/vector-qr-code-sample-smartphone-scanning-isolated-white-background_255502-674.jpg?w=740'
          alt='QR Code Zalo OA Elena'
          fill
          className='object-contain'
        />
        <div className='absolute -top-4 -right-4 bg-primary-600 text-white rounded-full p-2'>
          <Image
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1024px-Icon_of_Zalo.svg.png'
            alt='Zalo Icon'
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  )
}
