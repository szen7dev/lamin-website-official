'use client';

import { UserCheck, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  selectedContact: any;
  height: string;
  weight: string;
  isCreatingHeightMeasurement: boolean;
  onSubmit: () => void;
}

export function SubmitButton({
  selectedContact,
  height,
  weight,
  isCreatingHeightMeasurement,
  onSubmit,
}: SubmitButtonProps) {
  // Validation logic
  const isHeightValid =
    height && parseFloat(height) > 0 && parseFloat(height) <= 250;
  const isWeightValid =
    weight && parseFloat(weight) > 0 && parseFloat(weight) <= 300;
  const hasValidMeasurements = isHeightValid && isWeightValid;

  // Check if we need measurements but don't have valid ones
  const needsValidMeasurements = !hasValidMeasurements;

  const getButtonText = () => {
    if (isCreatingHeightMeasurement) {
      return 'Đang xử lý...';
    }

    if (!selectedContact) {
      return 'Chọn liên hệ trước';
    }

    if (needsValidMeasurements) {
      if (!height && !weight) {
        return 'Nhập chiều cao và cân nặng';
      }
      if (!isHeightValid && !isWeightValid) {
        return 'Chiều cao và cân nặng không hợp lệ';
      }
      if (!isHeightValid) {
        return 'Chiều cao không hợp lệ (1-250cm)';
      }
      if (!isWeightValid) {
        return 'Cân nặng không hợp lệ (1-300kg)';
      }
    }

    return hasValidMeasurements ? 'Submit dữ liệu' : 'Hoàn thiện thông tin';
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm disabled:opacity-60"
        disabled={
          !selectedContact ||
          needsValidMeasurements ||
          isCreatingHeightMeasurement
        }
        onClick={onSubmit}>
        {isCreatingHeightMeasurement ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <UserCheck className="h-4 w-4 mr-2" />
        )}
        {getButtonText()}
      </Button>
    </div>
  );
}
