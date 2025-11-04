'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Search, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { useGetTrustedStore } from '@/features/homepage';
import apiClient from '@/services/api/apiClient';
import { BlueShop } from '@/components/icons';
import { cn } from '@/lib/utils';
import { StoreMap, MapPlaceholder } from '@/components/maps';

interface Store {
  _id: string;
  name: string;
  sign?: string;
  location?: string;
  address?: string;
  rating?: number;
  numberOfRating?: number;
  description?: string;
  phone?: string;
  thumbnail?: {
    path: string;
  };
  area1?: {
    name: string;
  };
  area2?: {
    name: string;
  };
  area3?: {
    name: string;
  };
  images?: Array<{
    _id: string;
    path: string;
  }>;
}

export default function StoreLocationsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const debounceSearch = useRef<NodeJS.Timeout | null>(null);

  const { trustedStore, isLoading } = useGetTrustedStore({
    populates: {
      path: 'thumbnail area3 area2 area1 images',
      select: 'path name',
    },
    select:
      'name sign location address rating numberOfRating description phone',
    limit: 100,
    keyword: submittedSearchTerm,
    internal: 2,
  });

  // Set first store as selected by default
  useEffect(() => {
    if (trustedStore.length > 0 && !selectedStore) {
      setSelectedStore(trustedStore[0]);
    }
  }, [trustedStore, selectedStore]);

  useEffect(() => {
    return () => {
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (debounceSearch.current) {
      clearTimeout(debounceSearch.current);
    }
    debounceSearch.current = setTimeout(() => {
      setSubmittedSearchTerm(e.target.value.trim());
    }, 500);
  };

  return (
    <div className="bg-white">
      {/* Header Section with Icons */}
      <section className="container mx-auto py-8">
        <div className="bg-white border-2 border-primary rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Icon */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Image
                  alt="Hệ thống nhà thuốc"
                  height={32}
                  src="/images/shop.png"
                  width={32}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hệ thống nhà thuốc</h3>
                <p className="text-sm text-gray-600">Trên toàn quốc</p>
              </div>
            </div>

            {/* Hotline Icon */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Image
                  alt="Hotline 24/07"
                  height={32}
                  src="/images/customer-support.png"
                  width={32}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hotline 24/07</h3>
                <p className="text-sm text-gray-600">Để phục vụ quý khách</p>
              </div>
            </div>

            {/* Clock Icon */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Image
                  alt="Mở cửa 8-22h"
                  height={32}
                  src="/images/clock.png"
                  width={32}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Mở cửa 8-22h</h3>
                <p className="text-sm text-gray-600">cả CN & Lễ tết</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Store List */}
          <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button className="px-4 py-2 text-primary border-b-2 border-primary font-semibold">
                Tìm kiếm nhà thuốc
              </button>
              {/* <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                Nhà thuốc gần bạn
              </button> */}
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 rounded-lg"
                placeholder="Tìm bằng tên đường và tỉnh thành hoặc"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>

            {/* City/District Selects */}
            {/* <div className="grid grid-cols-2 gap-4 mb-6">
              <select
                className="px-4 py-2 border rounded-lg bg-white text-gray-700"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}>
                <option value="">Hà Nội</option>
              </select>
              <select
                className="px-4 py-2 border rounded-lg bg-white text-gray-700"
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}>
                <option value="">Quận Thanh Xuân</option>
              </select>
            </div> */}

            {/* Store List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(item => (
                    <div
                      key={item}
                      className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                trustedStore.map(store => (
                  <button
                    key={store._id}
                    className={cn(
                      'w-full text-left bg-white rounded-lg p-4 transition-all hover:shadow-md',
                      selectedStore?._id === store._id &&
                        'border-2 border-primary shadow-md',
                    )}
                    onClick={() => setSelectedStore(store)}>
                    <h3 className="font-bold text-primary text-sm mb-1">
                      {store.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Địa chỉ:</span>{' '}
                      {[
                        store.address,
                        store?.area1?.name,
                        store?.area2?.name,
                        store?.area3?.name,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {store.phone && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Hotline:</span>{' '}
                        {store.phone}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Store Detail */}
          <div className="lg:col-span-7">
            {selectedStore ? (
              <div className="space-y-6">
                {/* Map and Store Info Side by Side */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Left - Map */}
                    <div className="bg-gray-200 h-64 md:h-auto relative">
                      {(() => {
                        // Parse location string to get coordinates
                        const locationString = selectedStore.location;
                        if (locationString) {
                          const coords = locationString
                            .split(',')
                            .map(coord => parseFloat(coord.trim()));
                          if (
                            coords.length === 2 &&
                            !isNaN(coords[0]) &&
                            !isNaN(coords[1])
                          ) {
                            return (
                              <StoreMap
                                latitude={coords[0]}
                                longitude={coords[1]}
                                storeName={selectedStore.name}
                              />
                            );
                          }
                        }
                        return <MapPlaceholder />;
                      })()}
                    </div>

                    {/* Right - Store Info */}
                    <div className="p-3 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {selectedStore.name}
                        </h2>
                        <p className="text-gray-600 mb-3 text-sm">
                          {[
                            selectedStore.address,
                            selectedStore?.area1?.name,
                            selectedStore?.area2?.name,
                            selectedStore?.area3?.name,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>

                        {selectedStore.phone && (
                          <p className="text-gray-700 mb-4 text-sm">
                            Điện thoại: {selectedStore.phone}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        {selectedStore.location && (() => {
                          const coords = selectedStore.location
                            .split(',')
                            .map(coord => parseFloat(coord.trim()));
                          if (
                            coords.length === 2 &&
                            !isNaN(coords[0]) &&
                            !isNaN(coords[1])
                          ) {
                            return (
                              <Link
                                className="text-sm bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors text-center decoration-transparent"
                                href={`https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}&zoom=16`}
                                rel="noopener noreferrer"
                                target="_blank">
                                Xem chỉ đường
                              </Link>
                            );
                          }
                        })()}
                        {selectedStore.phone && (
                          <Link
                            className="text-sm border-2 border-[#00BBF2] bg-[#E5F8FE] text-[#00BBF2] px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-center decoration-transparent"
                            href={`tel:${selectedStore.phone}`}>
                            Gọi tư vấn
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Description */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-lg">
                    <BlueShop className="w-6 h-6 text-primary" /> Mô tả chi
                    tiết:
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    <p>
                      {selectedStore.description ||
                        `Nhà thuốc ${selectedStore.name} là hệ thống nhà thuốc uy tín chuyên cung cấp đa dạng các loại dược phẩm, thực phẩm chức năng và thiết bị y tế. Với đội ngũ dược sĩ giàu kinh nghiệm, nhà thuốc cam kết mang đến sản phẩm chất lượng và dịch vụ chăm sóc sức khỏe tốt nhất`}
                    </p>
                  </div>
                </div>

                {/* Store Images */}
                {(selectedStore.images && selectedStore.images.length > 0) ||
                selectedStore.thumbnail ? (
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <BlueShop className="w-6 h-6 text-primary" /> Hình ảnh nhà
                      thuốc
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedStore.images && selectedStore.images.length > 0
                        ? selectedStore.images
                            .slice(0, 3)
                            .map((image, index) => (
                              <div
                                key={image._id}
                                className="relative aspect-4/3 rounded-xl overflow-hidden">
                                <Image
                                  alt={`${selectedStore.name} - ${index + 1}`}
                                  className="object-cover"
                                  fill
                                  src={apiClient.getFileUrl(image.path)}
                                />
                                {index === 2 &&
                                  selectedStore.images &&
                                  selectedStore.images.length > 3 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-white font-bold text-2xl">
                                        +{selectedStore.images.length - 3}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            ))
                        : [1, 2, 3].map(index => (
                            <div
                              key={index}
                              className="relative aspect-4/3 rounded-xl overflow-hidden">
                              {selectedStore.thumbnail?.path ? (
                                <Image
                                  alt={selectedStore.name}
                                  className="object-cover"
                                  fill
                                  src={apiClient.getFileUrl(
                                    selectedStore.thumbnail.path,
                                  )}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <BlueShop className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              {index === 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white font-bold text-2xl">
                                    +3
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl h-full flex items-center justify-center p-12">
                <p className="text-gray-500 text-center">
                  Vui lòng chọn một cửa hàng để xem thông tin chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
