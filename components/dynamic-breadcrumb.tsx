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

export function DynamicBreadcrumb() {
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

    // Format the segment for display (capitalize, replace hyphens with spaces)
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    // Check if this is the last segment (current page)
    const isLastItem = index === segments.length - 1;

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
            <Link aria-label="Home" className="decoration-transparent" href="/">
              Trang chu
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
                  <Link className="decoration-transparent" href={item.href}>
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
