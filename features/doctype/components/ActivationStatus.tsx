import { formatDate } from 'date-fns';
import React from 'react';

interface ProductInfoProps {
  status: string;
  activationDate: string;
  activationBy: string;
  activationPhone: string;
}

const ActivationStatus: React.FC<ProductInfoProps> = ({
  status,
  activationDate,
  activationBy,
  activationPhone,
}) => {
  return (
    <div className="flex flex-col items-start justify-between bg-white rounded-md p-6 w-full max-w-3xl mx-auto mt-4">
      <h3 className="text-xl font-semibold mb-4">Tình trạng kích hoạt</h3>
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Trạng thái</p>
          <p className="font-medium">{status}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Ngày kích hoạt</p>
          <p className="font-medium">
            {activationDate ? formatDate(activationDate, 'dd/MM/yyyy') : '-'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Người kích hoạt</p>
          <p className="font-medium">{activationBy}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Điện thoại kích hoạt</p>
          <p className="font-medium">{activationPhone}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivationStatus;
