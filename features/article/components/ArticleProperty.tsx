'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { useGetArticleProperty } from '../hooks/useGetArticleProperty';

import { apiClient } from '@/services';
import { ChevronRightIcon } from '@/components/icons';

export default function ArticleProperty() {
  const slug = usePathname()?.replace(/^\/+|\/+$/g, '');
  const { articlesProperty } = useGetArticleProperty({
    menuSlug: slug,
  });

  return (
    <div className="space-y-8">
      {articlesProperty.map((articleProperty, index) => (
        <div key={index} className="border-gray-200 bg-white rounded-2xl p-4">
          {/* Header */}
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            <Link
              className="decoration-transparent text-xl font-semibold text-primary whitespace-nowrap pb-2"
              href={`/chu-de/${articleProperty.category.slug}`}>
              {articleProperty.category.name}
            </Link>
            <Link
              className="decoration-transparent text-sm font-medium text-primary whitespace-nowrap ml-auto flex items-center gap-2"
              href={`/chu-de/${articleProperty.category.slug}`}>
              Xem tất cả{' '}
              <span className="inline-block">
                <ChevronRightIcon size={16} />
              </span>
            </Link>
          </div>
          {/*First content include first 2 posts*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {articleProperty.posts.slice(0, 2).map((post, postIndex) => (
              <Fragment key={post.slug}>
                {postIndex === 0 ? (
                  <>
                    <Link
                      className="decoration-transparent block"
                      href={`/bai-viet/${post.slug}`}>
                      <div className="aspect-video overflow-hidden rounded-lg mb-3">
                        <Image
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          height={400}
                          src={
                            apiClient.getFileUrl(post.thumbnail?.path) ||
                            'https://placehold.co/600x400/png'
                          }
                          width={400}
                        />
                      </div>
                    </Link>
                    <Link
                      className="decoration-transparent block"
                      href={`/bai-viet/${post.slug}`}>
                      <div className="flex flex-col justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <div
                      className="hidden md:block absolute h-full border-r border-gray-200"
                      style={{ right: '33.33%' }}
                    />
                    <Link
                      className="decoration-transparent block md:col-span-1"
                      href={`/bai-viet/${post.slug}`}>
                      <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                    </Link>
                  </>
                )}
              </Fragment>
            ))}
          </div>

          {/* Separator below the first two posts */}
          {articleProperty.posts.slice(2, 5).length > 0 && (
            <div className="w-full my-6 border-t border-gray-200" />
          )}

          {/*Second content include 3 others*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articleProperty.posts.slice(2, 5).map(post => (
              <div key={post.slug} className="group">
                <Link
                  className="decoration-transparent block"
                  href={`/bai-viet/${post.slug}`}>
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                    <div className="absolute top-0 left-0 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-br-lg z-10">
                      Dinh dưỡng
                    </div>
                    <Image
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      height={300}
                      src={
                        apiClient.getFileUrl(post.thumbnail?.path) ||
                        'https://placehold.co/400x300/png'
                      }
                      width={400}
                    />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
