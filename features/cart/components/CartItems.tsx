'use client';

import type { CartItem } from '../types/cartTypes';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/utils/format';
import { useCart } from '@/features/cart/hooks/useCart';

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateUnit: (id: string, unit: string) => void;
  readOnly?: boolean;
}

export function CartItems({
  items,
  onRemoveItem,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateUnit,
  readOnly = false,
  selectedItems,
}: CartItemsProps) {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { removeItem } = useCart();

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    const newQuantity = Math.max(1, currentQuantity + 1);

    onUpdateQuantity(id, newQuantity);
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    const newQuantity = Math.max(1, currentQuantity - 1);

    onUpdateQuantity(id, newQuantity);
  };

  const handleQuantityChange = (id: string, value: string) => {
    const parsedValue = parseInt(value, 10);
    const newQuantity =
      !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : 1;

    onUpdateQuantity(id, newQuantity);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      onRemoveItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-6 flex items-center gap-2">
            <Checkbox
              checked={
                items.length > 0 && selectedItems.length === items.length
              }
              id="select-all"
              onCheckedChange={(checked: boolean) => onSelectAll(checked)}
            />
            <label className="text-sm font-medium" htmlFor="select-all">
              Chọn tất cả ({items.length})
            </label>
          </div>
          <div className="col-span-2 text-sm font-medium">Giá thành</div>
          <div className="col-span-2 text-sm font-medium text-center">
            Số lượng
          </div>
          <div className="col-span-2 text-sm font-medium text-center">
            Đơn vị
          </div>
        </div>
        <div className="w-full text-center">
          <span className="text-sm font-medium text-gray-500">Giá thành</span>
        </div>
        <div className="w-full text-center">
          <span className="text-sm font-medium text-gray-500">Số lượng</span>
        </div>
        <div className="w-full text-center">
          <span className="text-sm font-medium text-gray-500">Đơn vị</span>
        </div>
      </div>

      <div>
        {items.map(item => (
          <div key={item.id} className="p-4">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-6 flex items-center gap-4">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  id={`item-${item.id}`}
                  onCheckedChange={(checked: boolean) =>
                    onSelectItem(item.id, checked)
                  }
                />

                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    fill
                    alt={item.name}
                    className="object-cover rounded"
                    src={item.image || '/placeholder.svg?height=80&width=80'}
                  />
                </div>

                <div className="min-w-0 align-middle">
                  <div className={'mt-2 w-[160px] h-[60px] relative'}>
                    <p className="text-sm font-semibold line-clamp-2 text-ellipsis">
                      {item.name}
                    </p>
                  </div>
                  <div className="mt-1 hidden">
                    <span className="text-sm font-semibold text-blue-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(item.originalPrice * item.quantity)}
                      </span>
                    )}
                  </div>

                  {item.discount && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">
                      <span className="text-xs">%</span>
                      Giảm ngay {item.discount}% áp dụng đến 16/03
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-blue-600">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice * item.quantity)}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex justify-center">
                {!readOnly && (
                  <div className="flex items-center">
                    <Button
                      aria-label="Giảm số lượng"
                      className="h-8 w-10 rounded-l-2xl rounded-r-none border-gray-300 bg-white"
                      disabled={item.quantity <= 1}
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleDecreaseQuantity(item.id, item.quantity)
                      }>
                      <Minus
                        className={`w-4 h-4 text-gray-500 ${item.quantity <= 1 ? 'opacity-40' : ''}`}
                      />
                    </Button>
                    <input
                      readOnly
                      aria-label="Số lượng"
                      className="w-12 h-8 text-center border-y border-x-0 border-gray-300 focus:ring-0 focus:outline-none"
                      min="1"
                      type="number"
                      value={item.quantity}
                      onBlur={e => {
                        const value = e.target.value;

                        if (!value || parseInt(value, 10) < 1) {
                          onUpdateQuantity(item.id, 1);
                        }
                      }}
                      onChange={e => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          handleQuantityChange(item.id, value);
                        }
                      }}
                    />
                    <Button
                      aria-label="Tăng số lượng"
                      className="h-8 w-10 rounded-r-2xl rounded-l-none border-gray-300 bg-white"
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleIncreaseQuantity(item.id, item.quantity)
                      }>
                      <Plus className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="col-span-2 flex items-center justify-between  ml-3">
                {!readOnly ? (
                  <>
                    <Select
                      value={item.unit}
                      onValueChange={value => onUpdateUnit(item.id, value)}>
                      <SelectTrigger className="h-8 w-28 rounded-2xl border-gray-300 bg-white">
                        <SelectValue>{item.unit || 'Đơn vị'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {typeof item.unit === 'string' && (
                          <SelectItem key={item.unit} value={item.unit}>
                            {item.unit}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    <Button
                      aria-label="Xóa sản phẩm"
                      className="text-red-500 hover:text-red-700 hover:bg-transparent"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(item.id)}>
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </>
                ) : (
                  <span>{item.unit || 'Đơn vị'}</span>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <Button
                aria-label="Xóa sản phẩm"
                className="text-red-500"
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteClick(item.id)}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmDialog
        open={!!itemToDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={open => !open && setItemToDelete(null)}
      />
    </div>
  );
}
