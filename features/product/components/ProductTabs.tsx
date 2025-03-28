'use client';

import type { Product } from '@/features/product/types/productTypes';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/utils/helpers';
import apiClient from '@/services/api/apiClient';
import { SuccessIcon } from '@/components/icons';

interface ProductTabsProps {
  product: Product;
}

const sections = [
  { id: 'description', label: 'Mô tả sản phẩm' },
  { id: 'features', label: 'Đặc điểm nổi bật' },
  { id: 'ingredients', label: 'Thành phần' },
  { id: 'usage', label: 'Cách dùng' },
  { id: 'sideEffects', label: 'Tác dụng phụ' },
  { id: 'warnings', label: 'Lưu ý' },
  { id: 'storage', label: 'Bảo quản' },
];

const textSizes = [
  { id: 'default', label: 'Mặc định' },
  { id: 'large', label: 'Lớn hơn' },
];

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeSection, setActiveSection] = useState('description');
  const [textSize, setTextSize] = useState<'default' | 'large'>('default');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
      },
    );

    const contentElement = contentRef.current;

    if (contentElement) {
      contentElement.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
      });
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-lg border border-grayscale-20">
      <div className="flex">
        {/* Left Column - Navigation */}
        <div className="w-fit border-r border-grayscale-20">
          <nav
            aria-label="Product sections"
            className="sticky top-4 flex flex-col">
            {sections.map(section => (
              <button
                key={section.id}
                className={cn(
                  'border-b border-[#E5E7EB] px-6 py-3 text-left text-sm text-[#111827] transition-colors last:border-b-0',
                  activeSection === section.id
                    ? 'bg-[#F8F9FA] font-medium'
                    : 'hover:bg-gray-50',
                )}
                onClick={() => scrollToSection(section.id)}>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 p-6">
          {/* Header with Text Size Controls */}
          <div className="mb-6 flex items-center justify-between border-b-2 pb-4">
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="font-normal text-sm text-grayscale-50">
                Kích thước chữ
              </span>

              <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1">
                {textSizes.map(size => (
                  <button
                    key={size.id}
                    className={cn(
                      'rounded-full px-4 py-1 text-sm font-medium transition-colors',
                      textSize === size.id
                        ? 'bg-primary-50 text-white'
                        : 'text-gray-600 hover:text-gray-900',
                    )}
                    onClick={() => setTextSize(size.id as 'default' | 'large')}>
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div
            ref={contentRef}
            className={cn(
              'transition-all duration-300 delay-100',
              textSize === 'large'
                ? 'text-lg leading-relaxed'
                : 'text-base leading-normal',
            )}>
            {/* Description Section */}
            <section id="description">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {product.name} là gì?
              </h2>
              <p className="mb-4 text-gray-700">{product.description}</p>
            </section>

            {/* features Section */}
            {product.features && (
              <section className="mt-8" id="features">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Đặc điểm nổi bật của {product.name}
                </h2>
                <div className="mt-4 overflow-hidden border-gray-200">
                  <p className="text-gray-700">{product.features}</p>
                </div>
              </section>
            )}

            {/* Ingredients Section */}
            {product.ingredients && (
              <section className="mt-8" id="ingredients">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Thành phần của {product.name}
                </h2>
                <div className="mt-4 overflow-hiddenborder-gray-200">
                  <p className="text-gray-700">{product.ingredients}</p>
                </div>
              </section>
            )}

            {/* Usage Section */}
            {product.usage && (
              <section className="mt-8" id="usage">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Cách dùng {product.name}
                </h2>
                <p className="mb-2 text-gray-700">{product.usage}</p>
              </section>
            )}

            {/* SideEffect Section */}
            {product.sideEffects ? (
              <section className="mt-8" id="sideEffects">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Tác dụng phụ
                </h2>
                <p className="mb-2 text-gray-700">{product.sideEffects}</p>
              </section>
            ) : (
              <>
                <section className="mt-8" id="sideEffects">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Tác dụng phụ
                  </h2>
                  <p className="mb-2 text-gray-700">
                    Chưa có thông tin về tác dụng phụ của sản phẩm
                  </p>
                </section>
              </>
            )}

            {/* Warnings Section */}
            <section className="mt-8" id="warnings">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Lưu ý</h2>
              <div className="mt-4 rounded-lg bg-orange-50 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-orange-800">Lưu ý</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-orange-700">
                      <li>
                        Không sử dụng cho người mẫn cảm/kiêng kỵ với bất kỳ
                        thành phần nào của sản phẩm.
                      </li>
                      <li>
                        Người đang sử dụng thuốc, phụ nữ có thai hoặc đang cho
                        con bú cần tham khảo ý kiến chuyên gia y tế trước khi sử
                        dụng.
                      </li>
                      <li>
                        Sản phẩm này không phải là thuốc và không có tác dụng
                        thay thế thuốc chữa bệnh.
                      </li>
                      <li>Đọc kỹ hướng dẫn sử dụng trước khi dùng.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Storage Section */}
            {product.storage && (
              <section className="mt-8" id="storage">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Bảo quản
                </h2>
                <p className="text-gray-700">{product.storage}</p>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-grayscale-20 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          Thực phẩm bảo vệ sức khoẻ, không phải là thuốc, không có tác dụng thay
          thế thuốc chữa bệnh.
        </p>
      </div>

      {/* Author Info */}
      <div className="border-t border-grayscale-20 p-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <Image
              alt="Dược sĩ Nguyễn Thanh Hải"
              className="h-full w-full object-cover"
              height={40}
              src={
                apiClient.getFileUrl(
                  `files/db/users/${product.userUpdate?.image}`,
                ) || '/placeholder.svg'
              }
              width={40}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-normal text-gray-900">
                {product.userUpdate?.fullname || 'Dược sĩ Nguyễn Thanh Hải'}
              </h3>
              <div className="flex items-center gap-1 rounded-full  px-3 py-1">
                <SuccessIcon height={20} width={20} />
                <span className="text-sm font-medium italic text-green-600">
                  Đã kiểm duyệt nội dung
                </span>
              </div>
            </div>
            <p className="text-sm text-grayscale-50">
              Tốt nghiệp Đại học Dược Hà Nội, với hơn 10 năm kinh nghiệm trong
              lĩnh vực Dược phẩm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
