'use client';

import { Loader2, Printer } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import print from 'print-js';

import { Button } from '@/components/ui/button';
import HeightMeasurementResult from '@/features/height-measurement/components/HeightMeasurementResult';

interface HeightMeasurementResultClientProps {
  resultId: string;
}

const HeightMeasurementResultClient = ({
  resultId,
}: HeightMeasurementResultClientProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    const element = document.getElementById('print-result');

    if (!element) {
      setPrinting(false);

      return;
    }

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#fff',
      scrollX: 0,
      scrollY: 0,
    });
    const imgData = canvas.toDataURL('image/png');

    if (imgData) {
      print({
        printable: imgData,
        type: 'image',
        documentTitle: 'Kết quả phân tích đo cao',
      });
      setPrinting(false);
    }
  };

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex flex-col items-start">
          <h1 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-grayscale-90">
            Kết quả phân tích đo cao
          </h1>
          <p className="mb-4 sm:mb-6 text-sm text-grayscale-60">
            Dựa vào thông tin được cung cấp, bạn có thể tham khảo
          </p>
        </div>

        <Button
          className="mb-6"
          disabled={isLoading || printing}
          size="sm"
          title="In kết quả"
          onClick={handlePrint}>
          {printing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Printer className="mr-2 h-4 w-4" />
          )}
          In kết quả
        </Button>
      </div>
      <div className="rounded-lg bg-white shadow-sm" id="print-result">
        <HeightMeasurementResult
          resultId={resultId}
          onSuccess={() => {
            setIsLoading(false);
          }}
        />
      </div>
    </>
  );
};

export default HeightMeasurementResultClient;
