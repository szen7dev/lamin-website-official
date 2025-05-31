'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams } from 'next/navigation';

import ProductInfo from '@/features/doctype/components/ProductInfo';
import ActivationStatus from '@/features/doctype/components/ActivationStatus';
import { useGetProductLot } from '@/features/doctype/hooks/useGetProductLot';
import { usePostActivateProduct } from '@/features/activate-product/hooks/usePostActivateProduct';
import ActivationForm from '@/features/doctype/components/ActivationForm';

const formSchema = z.object({
  purchaseChannel: z
    .string()
    .min(1, { message: 'Vui lòng chọn kênh mua hàng' }),
  purchaseReason: z
    .string()
    .min(1, { message: 'Vui lòng chọn lý do mua hàng' }),
  fullname: z.string().min(2, { message: 'Vui lòng nhập tên của bạn' }),
  phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }).max(15),
  price: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ItemPage = () => {
  const params = useParams();

  const { productLot } = useGetProductLot({
    sign: params.itemID as string,
    populates: {
      path: 'funda customer voucher product lot goods',
      select: 'name sign expired note',
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseChannel: 'pharmacy',
      purchaseReason: 'quality',
      fullname: '',
      phone: '',
      price: '',
      city: 'hanoi',
      district: 'badinh',
      ward: 'trucbach',
    },
  });

  const { mutate: activateProduct, isLoading: isActivating } =
    usePostActivateProduct({
      onSuccess: () => {
        form.reset();
      },
    });

  const onSubmit = (data: FormValues) => {
    activateProduct({
      amount: data.price || '0',
      area1: data.city || '',
      area2: data.district || '',
      area3: data.ward || '',
      channelID: data.purchaseChannel,
      customerName: data.fullname,
      customerPhone: data.phone,
      reasonID: data.purchaseReason,
      lotID: productLot.lot?._id,
      goodsID: productLot.goods?._id,
      sign: productLot?.sign,
      status: 2,
    });
  };

  return (
    <div className="container px-4 py-8">
      {productLot.status === 1 && (
        <ActivationForm
          form={form}
          isActivating={isActivating}
          onSubmit={onSubmit}
        />
      )}
      <ProductInfo
        expiryDate={productLot.lot?.expired}
        lotNumber={productLot.lot?.sign}
        manufacturer={productLot.lot?.name}
        note={productLot.lot?.note}
        productName={productLot.goods?.name}
      />
      <ActivationStatus
        activationBy={productLot.customerName}
        activationDate={productLot.activationDate}
        activationPhone={productLot.customerPhone}
        status={productLot.status === 2 ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
      />
    </div>
  );
};

export default ItemPage;
