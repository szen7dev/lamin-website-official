'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Map of URL segments to their Vietnamese display text with proper accents
const vietnameseTextMap: Record<string, string> = {
  // Main sections
  'trang-chu': 'Trang chủ',
  'do-cao': 'Đo cao',
  'kiem-tra-thoi-quen': 'Kiểm tra thói quen',
  'doi-ngu-chuyen-mon': 'Đội ngũ chuyên môn',
  'chuyen-trang-suc-khoe': 'Chuyên trang sức khỏe',
  'he-thong-cua-hang': 'Hệ thống cửa hàng',
  'lien-he': 'Liên hệ',
  'san-pham': 'Sản phẩm',
  'tin-tuc': 'Tin tức',
  'gioi-thieu': 'Giới thiệu',
  'dang-nhap': 'Đăng nhập',
  'dang-ky': 'Đăng ký',
  'chu-de': 'Chủ đề',
  'danh-muc': 'Danh mục',
  'tim-kiem': 'Tìm kiếm',

  // Sub-sections
  'ket-qua': 'Kết quả',
  'chi-tiet': 'Chi tiết',
  'danh-sach': 'Danh sách',
  'thong-tin': 'Thông tin',
  'bai-viet': 'Bài viết',
};

export function DynamicBreadcrumb({ name }: { name?: string }) {
  const pathname = usePathname();

  // Skip rendering breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }

  // Split the pathname into segments and remove empty strings
  const segments = pathname.split('/').filter(Boolean);

  // Generate breadcrumb items based on the path segments
  const breadcrumbItems = segments.map((segment, index) => {
    // Create the path for this breadcrumb item
    const href = `/${segments.slice(0, index + 1).join('/')}`;

    // Check if this is the last segment (current page)
    const isLastItem = index === segments.length - 1;

    // Get Vietnamese text from mapping or format the segment for display
    // If this is the last item and name is provided, use name instead
    const label =
      isLastItem && name
        ? name
        : vietnameseTextMap[segment] ||
          segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

    return {
      href,
      label,
      isLastItem,
    };
  });

  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              aria-label="Trang chủ"
              className="decoration-transparent text-primary"
              href="/">
              Trang chủ
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        {breadcrumbItems.map(item => (
          <BreadcrumbItem key={item.href}>
            {item.isLastItem ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link
                    className="decoration-transparent text-primary"
                    href={item.href}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
