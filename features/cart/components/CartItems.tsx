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
  selectedItems: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateUnit: (id: string, unit: string) => void; // Add this line
  readOnly?: boolean; // Thêm prop này
}

export function CartItems({
  items,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateUnit, // Add this line
  readOnly = false,
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
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={items.length > 0 && selectedItems.length === items.length}
            id="select-all"
            onCheckedChange={(checked: boolean) => onSelectAll(checked)}
          />
          <label className="text-sm font-medium" htmlFor="select-all">
            Chọn tất cả ({items.length})
          </label>
        </div>
      </div>

      <div className="divide-y">
        {items.map(item => (
          <div key={item.id} className="p-4 flex items-start gap-4">
            <div className="flex items-center h-20">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                id={`item-${item.id}`}
                onCheckedChange={(checked: boolean) =>
                  onSelectItem(item.id, checked)
                }
              />
            </div>

            <div className="w-20 h-20 relative">
              <Image
                fill
                alt={item.name}
                className="object-cover rounded"
                src={item.image || '/placeholder.svg?height=80&width=80'}
              />
            </div>

            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-semibold text-blue-600">
                  {formatPrice(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(item.originalPrice)}
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

            <div className="flex items-center gap-4">
              {!readOnly && (
                <>
                  <div className="flex items-center gap-2">
                    <Button
                      aria-label="Giảm số lượng"
                      disabled={item.quantity <= 1}
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      aria-label="Số lượng"
                      className="w-12 text-center border rounded p-1"
                      min="1"
                      type="number"
                      value={item.quantity}
                      onBlur={e => {
                        const value = Number.parseInt(e.target.value);

                        if (!value || value < 1) {
                          handleQuantityChange(item.id, 1);
                        }
                      }}
                      onChange={e => {
                        const value = e.target.value;

                        if (/^\d+$/.test(value) || value === '') {
                          handleQuantityChange(
                            item.id,
                            Number.parseInt(value) || 1,
                          );
                        }
                      }}
                    />
                    <Button
                      aria-label="Tăng số lượng"
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Select
                    value={item.unit}
                    onValueChange={value => onUpdateUnit(item.id, value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue>{item.unit || 'Đơn vị'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hộp">Hộp</SelectItem>
                      <SelectItem value="Viên">Viên</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    aria-label="Xóa sản phẩm"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}
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
