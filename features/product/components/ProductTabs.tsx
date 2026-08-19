'use client';

import type { Product } from '@/features/product/types/productTypes';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/utils/helpers';
import apiClient from '@/services/api/apiClient';
import { SuccessIcon } from '@/components/icons';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

interface ProductTabsProps {
  product: Product;
}

const textSizes = [
  { id: 'default', label: 'Mặc định' },
  { id: 'large', label: 'Lớn hơn' },
];

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeSection, setActiveSection] = useState('description');
  const [textSize, setTextSize] = useState<'default' | 'large'>('default');
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const sections = [
    { id: 'description', label: 'Mô tả sản phẩm' },
    { id: 'features', label: 'Đặc điểm nổi bật' },
    { id: 'ingredients', label: 'Thành phần' },
    { id: 'usage', label: 'Cách dùng' },
    { id: 'sideEffects', label: 'Tác dụng phụ' },
    { id: 'warnings', label: 'Lưu ý' },
    { id: 'storage', label: 'Bảo quản' },
  ];

  // Debounce function to prevent rapid section changes
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Update active section based on scroll position
  const updateActiveSection = () => {
    if (isScrolling) return;

    const sectionElements = sections
      .map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }))
      .filter(item => item.element !== null);

    if (sectionElements.length === 0) return;

    const viewportHeight = window.innerHeight;
    let closestSection = sectionElements[0];
    let closestDistance = Infinity;

    sectionElements.forEach(section => {
      if (!section.element) return;

      const rect = section.element.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportHeight * 0.3);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    setActiveSection(closestSection.id);
  };

  // Debounced version of updateActiveSection
  const debouncedUpdateActiveSection = debounce(updateActiveSection, 100);

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        debouncedUpdateActiveSection();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      setIsScrolling(true);
      setActiveSection(sectionId);

      const yOffset = -80; // Adjust this value based on your layout
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });

      // Reset isScrolling after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  return (
    <div className="rounded-lg">
      <div className="flex">
        {/* Left Column - Navigation */}
        <div className="w-fit hidden sm:block mb-3">
          <nav
            aria-label="Product sections"
            className="sticky top-4 flex flex-col min-w-[220px]">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <button
                  className={cn(
                    'w-full pr-6 pl-2 py-3 text-left text-sm text-[#111827] transition-colors rounded-lg',
                    activeSection === section.id
                      ? 'bg-[#e7edfb] font-medium'
                      : 'hover:bg-gray-50',
                  )}
                  onClick={() => scrollToSection(section.id)}>
                  {section.label}
                </button>
                {index < sections.length - 1 && (
                  <div
                    className={cn(
                      'h-px bg-gray-200',
                      // Hide separator if active item is first and this is the first separator
                      activeSection === sections[0].id &&
                        index === 0 &&
                        'invisible',
                      // Hide separator if active item is last and this is the second-to-last separator
                      activeSection === sections[sections.length - 1].id &&
                        index === sections.length - 2 &&
                        'invisible',
                      // Hide separator if active item is this item or the next item (middle case)
                      (activeSection === section.id ||
                        (index < sections.length - 1 &&
                          activeSection === sections[index + 1].id)) &&
                        'invisible',
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 p-6">
          {/* Header with Text Size Controls */}
          <div className="mb-6 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between border-b-2 pb-4 gap-2">
            <h1 className="text-xl font-medium text-gray-900 hidden sm:block basis-1/2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 basis-1/2 justify-end">
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
              <h2 className="mb-4 text-lg sm:text-lg font-semibold sm:font-medium text-gray-900">
                {product.name} là gì?
              </h2>
              <div
                className="mb-4 text-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
              />
            </section>

            {/* features Section */}
            {product.features ? (
              <section className="mt-8" id="features">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Đặc điểm nổi bật của sản phẩm
                </h2>
                <div className="mt-4 overflow-hidden border-gray-200">
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.features) }}
                  />
                </div>
              </section>
            ) : (
              <section className="mt-8" id="features">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Đặc điểm nổi bật của sản phẩm
                </h2>
                <div className="mt-4 overflow-hidden border-gray-200">
                  <p className="text-gray-700">Chưa có thông tin</p>
                </div>
              </section>
            )}

            {/* Ingredients Section */}
            {product.ingredients ? (
              <section className="mt-8" id="ingredients">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Thành phần của sản phẩm
                </h2>
                <div className="mt-4 overflow-hidden border-gray-200">
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.ingredients) }}
                  />
                </div>
              </section>
            ) : (
              <section className="mt-8" id="ingredients">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Thành phần của sản phẩm
                </h2>
                <div className="mt-4 overflow-hidden border-gray-200">
                  <p className="text-gray-700">Chưa có thông tin</p>
                </div>
              </section>
            )}

            {/* Usage Section */}
            {product.instructions && (
              <section className="mt-8" id="usage">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Cách dùng {product.name}
                </h2>
                <p
                  className="mb-2 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.instructions) }}
                />
              </section>
            )}

            {/* SideEffect Section */}
            {product.sideEffects ? (
              <section className="mt-8" id="sideEffects">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Tác dụng phụ
                </h2>
                <p
                  className="mb-2 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.sideEffects) }}
                />
              </section>
            ) : (
              <section className="mt-8" id="sideEffects">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Tác dụng phụ
                </h2>
                <p className="mb-2 text-gray-700">
                  Chưa có thông tin về tác dụng phụ của sản phẩm
                </p>
              </section>
            )}

            {/* Warnings Section */}
            <section className="mt-8" id="warnings">
              <div className="mt-4 rounded-lg bg-orange-50 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-orange-800">Lưu ý</p>
                    {product.warnings ? (
                      <p
                        className="mt-2 text-orange-700"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.warnings) }}
                      />
                    ) : (
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-orange-700">
                        <li>Chưa có lưu ý với sản phẩm</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Storage Section */}
            {product.storage ? (
              <section className="mt-8" id="storage">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Bảo quản
                </h2>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.storage) }}
                />
              </section>
            ) : (
              <section className="mt-8" id="storage">
                <h2 className="mb-4 text-base sm:text-lg font-semibold sm:font-medium text-gray-900">
                  Bảo quản
                </h2>
                <p className="text-gray-700">Chưa có thông tin</p>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 p-2 rounded-md border-l-4 border-primary">
        <p className="text-sm text-primary">
          Thực phẩm bảo vệ sức khoẻ, không phải là thuốc, không có tác dụng thay
          thế thuốc chữa bệnh.
        </p>
      </div>

      {/* Author Info */}
      <div className="border-grayscale-20 p-4">
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
            {/* <p className="text-sm text-grayscale-50">
              Tốt nghiệp Đại học Dược Hà Nội, với hơn 10 năm kinh nghiệm trong
              lĩnh vực Dược phẩm
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
