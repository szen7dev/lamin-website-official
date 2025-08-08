'use client';

import { UserCheck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HealthInformationFormProps {
  height: string;
  weight: string;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
}

export function HealthInformationForm({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}: HealthInformationFormProps) {
  // Validation functions
  const getHeightError = () => {
    if (!height) return '';

    const numHeight = parseFloat(height);

    if (isNaN(numHeight) || numHeight <= 0) return 'Chiều cao phải là số dương';
    if (numHeight > 250) return 'Chiều cao không được vượt quá 250cm';
    if (numHeight < 50) return 'Chiều cao phải ít nhất 50cm';

    return '';
  };

  const getWeightError = () => {
    if (!weight) return '';

    const numWeight = parseFloat(weight);

    if (isNaN(numWeight) || numWeight <= 0) return 'Cân nặng phải là số dương';
    if (numWeight > 300) return 'Cân nặng không được vượt quá 300kg';
    if (numWeight < 10) return 'Cân nặng phải ít nhất 10kg';

    return '';
  };

  const heightError = getHeightError();
  const weightError = getWeightError();

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Thông tin sức khỏe
        </h4>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium" htmlFor="height">
              Chiều cao (cm) <span className="text-red-500">*</span>
            </Label>
            <Input
              className={`mt-1 ${heightError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              id="height"
              max="250"
              min="50"
              placeholder="VD: 170"
              type="number"
              value={height}
              onChange={e => onHeightChange(e.target.value)}
            />
            {heightError && (
              <p className="mt-1 text-xs text-red-600">{heightError}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium" htmlFor="weight">
              Cân nặng (kg) <span className="text-red-500">*</span>
            </Label>
            <Input
              className={`mt-1 ${weightError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              id="weight"
              max="300"
              min="10"
              placeholder="VD: 65"
              step="0.1"
              type="number"
              value={weight}
              onChange={e => onWeightChange(e.target.value)}
            />
            {weightError && (
              <p className="mt-1 text-xs text-red-600">{weightError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
