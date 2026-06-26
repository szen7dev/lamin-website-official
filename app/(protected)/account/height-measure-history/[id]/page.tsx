'use client';

import { Loader2, Printer } from 'lucide-react';
import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import html2canvas from 'html2canvas-pro';
import print from 'print-js';

import { Button } from '@/components/ui/button';
import HeightMeasurementResult from '@/features/height-measurement/components/HeightMeasurementResult';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
}

export default function HeightMeasurementHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const [printing, setPrinting] = useState(false);
  const { id: resultId } = use(params);
  const { name } = use(searchParams);
  const displayName = name || 'Nguyễn Văn B';

  // Validate required parameter
  if (!resultId) {
    notFound();
  }

  const handlePrint = async () => {
    setPrinting(true);
    const element = document.getElementById('print-result');

    if (!element) {
      setPrinting(false);

      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      backgroundColor: '#fff',
      scrollX: 0,
      scrollY: 0,
      onclone: clonedDoc => {
        const clonedElement = clonedDoc.getElementById('print-result');

        if (clonedElement) {
          const tableHeaders = clonedElement.querySelectorAll('header div');

          tableHeaders.forEach(header => {
            const htmlEl = header as HTMLElement;

            htmlEl.style.padding = '0px 8px 12px 8px';
            htmlEl.style.fontWeight = 'bold';
            htmlEl.style.textAlign = 'center';
            htmlEl.style.lineHeight = '1.2';
          });

          const tableRows = clonedElement.querySelectorAll(
            '.grid.grid-cols-2:not(header)',
          );

          tableRows.forEach(row => {
            const htmlEl = row as HTMLElement;
            const cells = htmlEl.querySelectorAll('div');

            cells.forEach(cell => {
              const cellEl = cell as HTMLElement;

              cellEl.style.padding = '6px 4px';
              cellEl.style.textAlign = 'center';
              cellEl.style.lineHeight = '1.2';
            });
          });

          const growthSection = clonedElement.querySelector(
            '[aria-label="Đường tăng trưởng"]',
          );

          if (growthSection) {
            const htmlEl = growthSection as HTMLElement;

            htmlEl.style.minHeight = '36px';
            htmlEl.style.padding = '0';

            const growthText = htmlEl.querySelector('div:first-child');

            if (growthText) {
              (growthText as HTMLElement).style.padding = '0px 8px 12px 8px';
              (growthText as HTMLElement).style.lineHeight = '1.3';
            }

            const progressContainer = htmlEl.querySelector('div:last-child');

            if (progressContainer) {
              (progressContainer as HTMLElement).style.padding = '8px 4px';
            }
          }

          const analysisSection = clonedElement.querySelector(
            'div[class*="rounded-br-md"]',
          );

          if (analysisSection) {
            const paragraphs = analysisSection.querySelectorAll('p');

            paragraphs.forEach(p => {
              const htmlEl = p as HTMLElement;

              htmlEl.style.padding = '0px 8px 12px 8px';
              htmlEl.style.lineHeight = '1';
              htmlEl.style.margin = '0';
              htmlEl.style.wordBreak = 'break-word';
              htmlEl.style.hyphens = 'auto';
            });

            const recommendationSpans = analysisSection.querySelectorAll(
              'span[class*="text-grayscale-90"]',
            );

            recommendationSpans.forEach(span => {
              const htmlEl = span as HTMLElement;

              htmlEl.style.paddingBottom = '12px';
            });

            const predictionParagraph = analysisSection.querySelector(
              'span[class*="coach-predict"]',
            );

            if (predictionParagraph) {
              const htmlEl = predictionParagraph as HTMLElement;

              htmlEl.style.paddingTop = '10px';
            }
          }

          clonedElement.style.lineHeight = '1.3';
        }
      },
    });
    const imgData = canvas.toDataURL('image/png');

    if (imgData) {
      print({
        printable: imgData,
        type: 'image',
        documentTitle: 'Kết quả phân tích đo cao',
        style: '@page { size: A4 landscape; }',
      });
      setPrinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12">
      <div className="flex items-end justify-between">
        <div className="flex flex-col items-start">
          <h1 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-grayscale-90">
            Chi tiết thông tin đo cao
          </h1>
          <p className="mb-4 sm:mb-6 text-sm text-grayscale-60">
            Biểu đồ dự đoán chiều cao theo CDC của bé {displayName}
          </p>
        </div>

        <Button
          className="mb-6"
          disabled={printing}
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
      <div className="rounded-md bg-white container p-0" id="print-result">
        <HeightMeasurementResult resultId={resultId} />
      </div>
    </div>
  );
}
