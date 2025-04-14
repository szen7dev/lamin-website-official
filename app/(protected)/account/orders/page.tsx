'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/utils';
import { useGetUserOrders } from '@/features/order/hooks/useGetUserOrders';
import { useAuth } from '@/hooks';
import { apiClient } from '@/services';

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
  const { orderList, isLoading, isError, error } = useGetUserOrders({
    customerID: user?.id || '',
  });

  console.log('orderList', orderList);
  console.log('isLoading', isLoading);
  console.log('isError', isError);
  console.log('error', error);
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
      ? orderList
      : orderList.filter(order => order.status === activeTab);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-grayscale-90">
          Đơn hàng của tôi
        </h1>
        <Input
          className="rounded-full bg-white flex-shrink basis-2/3"
          placeholder="Tìm kiếm tên đơn, mã đơn hoặc mã sản phẩm . . ."
        />
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

      {/* Order Items */}
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
    </div>
  );
}
