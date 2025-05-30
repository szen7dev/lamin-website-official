import React from 'react';

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
      <h3 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h3>
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Tên sản phẩm</p>
          <p className="font-medium">{productName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Số lô sản xuất</p>
          <p className="font-medium">{lotNumber}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Thời hạn sử dụng</p>
          <p className="font-medium">{expiryDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Được sản xuất bởi</p>
          <p className="font-medium">{manufacturer}</p>
        </div>
        {note && (
          <div>
            <p className="text-gray-500 text-sm">Ghi chú</p>
            <p className="font-medium">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
