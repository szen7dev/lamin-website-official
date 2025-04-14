'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, AlertCircle, Search } from 'lucide-react';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/utils';
import { useGetUserOrders } from '@/features/order/hooks/useGetUserOrders';
import { useAuth } from '@/hooks';
import { apiClient } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type OrderStatus = 0 | 2 | 3 | 5 | 4 | 7;

function calculateOrderTotal(order: any): number {
  return order.products.reduce(
    (total: number, item: any) => total + item.unitPrice * item.quantity,
    0,
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderStatus>(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { orderList, isLoading, isError, error } = useGetUserOrders({
    customerID: user?.id || '',
    keyword: searchKeyword,
  });

  const tabs = [
    { id: 0, label: 'Tất cả' },
    { id: 2, label: 'Đang xử lý' },
    { id: 3, label: 'Đang giao' },
    { id: 5, label: 'Đã giao' },
    { id: 4, label: 'Đã hủy' },
    { id: 7, label: 'Trả hàng' },
  ];

  const filteredOrders =
    activeTab === 0
      ? orderList || []
      : (orderList || []).filter(order => order.status === activeTab);

  const handleSearch = () => {
    setSearchKeyword(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Loading skeletons for orders
  const OrderSkeleton = () => (
    <div className="border border-blue-100 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <div className="text-gray-500 text-sm">•</div>
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>

      {[1, 2].map(item => (
        <div key={item} className="flex items-start py-4 border-t">
          <Skeleton className="flex-shrink-0 w-20 h-20" />
          <div className="flex-shrink ml-4">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex-grow" />
          <div className="flex flex-col items-end ml-4">
            <Skeleton className="h-5 w-20 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="ml-4 h-5 w-16 mt-1" />
        </div>
      ))}

      <div className="flex justify-between items-center border-b pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-grayscale-90">
          Đơn hàng của tôi
        </h1>
        <div className="relative flex-shrink basis-2/3">
          <Input
            className="rounded-full bg-white pr-12 pl-4"
            placeholder="Tìm kiếm tên đơn, mã đơn hoặc mã sản phẩm . . ."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            aria-label="Search"
            className="absolute scale-75 right-1 top-0 h-full p-3 flex items-center justify-center bg-primary-5 hover:bg-primary-10 text-primary rounded-full transition-colors"
            onClick={handleSearch}>
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 w-full bg-white rounded-t-2xl text-center py-3 border-b">
        {tabs.map(tab => (
          <div key={tab.id} className="relative">
            <button
              className={`w-full text-sm font-medium hover:text-primary ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id as OrderStatus)}>
              {tab.label}
            </button>
            {/* The border that spans the full width of the cell */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary -mb-[13px]" />
            )}
          </div>
        ))}
      </div>

      {/* Error state */}
      {isError && (
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'An error occurred while fetching your orders. Please try again later.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map(item => (
            <OrderSkeleton key={item} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredOrders.length === 0 && (
        <div className="mt-8 text-center py-8 bg-white rounded-lg">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Không có đơn hàng nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Bạn chưa có đơn hàng nào trong danh mục này.
          </p>
          <div className="mt-6">
            <Link
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              href="/">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}

      {/* Order Items */}
      {!isLoading && !isError && filteredOrders.length > 0 && (
        <div className="mt-4 space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order._id}
              className="border border-blue-100 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="font-medium">
                    Đơn hàng {formatDate(order.date)}
                  </div>
                  <div className="text-gray-500 text-sm">•</div>
                  <div className="text-gray-500 text-sm">
                    {/* {order.deliveryMethod} */}
                    Giao hàng tận nơi
                  </div>
                  <div className="text-gray-500 text-sm">•</div>
                  <div className="text-gray-500 text-sm">#{order._id}</div>
                </div>
                <div className="text-cyan-500 font-medium">{order.sign}</div>
              </div>

              {order.products.map(item => (
                <div key={item._id} className="flex items-start py-4 border-t">
                  <div className="flex-shrink-0 w-20 h-20">
                    <Image
                      alt={item.name}
                      className="w-full h-full object-cover"
                      height={80}
                      src={
                        apiClient.getFileUrl(item?.thumbnail?.path) ||
                        '/placeholder.svg'
                      }
                      width={80}
                    />
                  </div>
                  <div className="flex-shrink ml-4">
                    <div className="text-sm line-clamp-2">{item.name}</div>
                  </div>
                  <div className="flex-grow" />
                  <div className="flex flex-col items-end ml-4">
                    <div className="font-medium">
                      {formatCurrency(item.unitPrice)}
                    </div>
                    <div className="text-gray-400 line-through text-sm">
                      {formatCurrency(item.listedUnitprice)}đ
                    </div>
                  </div>
                  <div className="ml-4 text-sm mt-1">x{item.quantity} Hộp</div>
                </div>
              ))}

              <div className="flex justify-between items-center border-b pb-2">
                <Link
                  className="text-blue-600 text-sm flex items-center mt-2"
                  href={`/orders/${order._id}`}>
                  Xem chi tiết <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="font-medium">
                  Thành tiền:{' '}
                  <span className="text-blue-600">
                    {formatCurrency(calculateOrderTotal(order))}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Mua lại
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
