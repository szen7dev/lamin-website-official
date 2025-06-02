import { formatDate } from 'date-fns';
import React from 'react';
import { CheckCircleIcon } from 'lucide-react';

interface ProductInfoProps {
  expiryDate: string;
  lotNumber: string;
  manufacturer: string;
  note?: string;
  productName: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  expiryDate,
  lotNumber,
  manufacturer,
  note,
  productName,
}) => {
  return (
    <div className="flex flex-col items-start justify-between bg-white rounded-md p-6 w-full max-w-3xl mx-auto mt-4">
      <div className="bg-[#059550] rounded-xl p-6 w-full max-w-3xl mx-auto mb-4 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <p className="text-white uppercase text-2xl font-semibold underline">
            Sản phẩm chính hãng
          </p>
          <CheckCircleIcon className="h-6 w-6 text-white" />
        </div>
        <p className="text-white text-sm font-semibold">
          Sản phẩm được phân phối và chịu trách nhiệm bởi
        </p>
        <p className="text-white text-sm font-semibold">
          CÔNG TY CỔ PHẦN DƯỢC PHẨM LAMIN
        </p>
      </div>
      <h3 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h3>
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Tên sản phẩm</p>
          <p className="font-medium">{productName || '-'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Số lô sản xuất</p>
          <p className="font-medium">{lotNumber || '-'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Thời hạn sử dụng</p>
          <p className="font-medium">
            {expiryDate ? formatDate(expiryDate, 'dd/MM/yyyy') : '-'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Được sản xuất bởi</p>
          <p className="font-medium">{manufacturer || '-'}</p>
        </div>
        {note && (
          <div>
            <p className="text-gray-500 text-sm">Ghi chú</p>
            <p className="font-medium">{note || '-'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
