'use client';

import type { CartItem } from '../types';

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

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateUnit: (id: string, unit: string) => void;
  readOnly?: boolean;
  selectedItems: string[];
}

export function CartItems({
  items,
  onRemoveItem,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onUpdateUnit,
  readOnly = false,
  selectedItems,
}: CartItemsProps) {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const validQuantity = Math.max(1, Math.floor(newQuantity) || 1);

    onUpdateQuantity(id, validQuantity);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onRemoveItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header row with column titles */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_20px] items-center justify-items-center p-4 border-b">
        <div className="flex items-center gap-2 text-white justify-self-start">
          <Checkbox
            checked={items.length > 0 && selectedItems.length === items.length}
            className="data-[state=checked]:bg-blue-600 rounded-full border-gray-300"
            id="select-all"
            onCheckedChange={(checked: boolean) => onSelectAll(checked)}
          />
          <label
            className="text-sm font-medium text-black"
            htmlFor="select-all">
            Chọn tất cả ({items.length})
          </label>
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
          <div
            key={item.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_20px] items-center justify-items-start p-4 border-b">
            <div className="flex items-center h-20 text-white justify-self-start w-full">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                className="data-[state=checked]:bg-blue-600 rounded-full border-gray-300"
                onCheckedChange={(checked: boolean) =>
                  onSelectItem(item.id, checked)
                }
              />

              <div className="flex items-center gap-4 ml-2">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    fill
                    alt={item.name}
                    className="object-cover rounded"
                    src={item.image || '/placeholder.svg?height=80&width=80'}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-normal text-sm line-clamp-2 max-w-[180px]">
                    {item.name}
                  </h3>
                  {item.discount && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">
                      <span className="text-xs">%</span>
                      Giảm ngay {item.discount}% áp dụng đến 16/03
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col text-right w-max justify-self-center">
              <span className="text-sm font-semibold text-blue-600">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs font-medium text-gray-500 line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex justify-center w-full justify-self-center">
              {!readOnly && (
                <div className="flex items-center">
                  <div className="flex rounded-md overflow-hidden">
                    <Button
                      aria-label="Giảm số lượng"
                      className="h-9 w-9 rounded-tl-full rounded-bl-full bg-white border-[#C1C8D1] hover:bg-gray-50 !opacity-100"
                      disabled={item.quantity <= 1}
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }>
                      <Minus
                        className={`w-4 h-4 text-gray-500 ${item.quantity <= 1 ? 'opacity-40' : ''}`}
                      />
                    </Button>
                    <input
                      readOnly
                      aria-label="Số lượng"
                      className="w-9 h-9 text-center border-y border-[#C1C8D1] text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      type="number"
                      value={item.quantity}
                    />
                    <Button
                      aria-label="Tăng số lượng"
                      className="h-9 w-9 rounded-tr-full rounded-br-full bg-white border-[#C1C8D1] hover:bg-gray-50"
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }>
                      <Plus className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center w-full justify-self-center">
              {!readOnly && (
                <>
                  <Select
                    value={item.unit}
                    onValueChange={value => onUpdateUnit(item.id, value)}>
                    <SelectTrigger className="w-24 h-9 bg-white rounded-full border-[#C1C8D1]">
                      <SelectValue>{item.unit || 'Đơn vị'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hộp">Hộp</SelectItem>
                      <SelectItem value="Viên">Viên</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
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
