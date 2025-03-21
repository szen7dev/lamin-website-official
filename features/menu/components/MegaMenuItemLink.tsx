import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { cn } from '@/utils/helpers';
import apiClient from '@/services/api/apiClient';

interface MegaMenuItemLinkProps {
  href: string;
  icon?: string | { path: string; _id: string; name?: string };
  label: string;
  isActive?: boolean;
  className?: string;
  onMouseEnter?: () => void;
}

export default function MegaMenuItemLink({
  href,
  icon,
  label,
  isActive,
  className,
  onMouseEnter,
}: MegaMenuItemLinkProps) {
  const iconPath = typeof icon === 'string' ? icon : icon?.path;
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  // Apply the onMouseEnter handler more aggressively
  useEffect(() => {
    const link = linkRef.current;

    if (link) {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mousemove', handleMouseEnter);

      return () => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mousemove', handleMouseEnter);
      };
    }
  }, [onMouseEnter]);

  return (
    <Link
      ref={linkRef}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-grayscale-5',
        isActive && 'bg-grayscale-5 font-medium',
        className,
      )}
      href={href}
      onMouseEnter={handleMouseEnter}>
      {icon && (
        <div className="flex h-5 w-5 items-center justify-center">
          <Image
            alt={label}
            className={cn(
              'h-5 w-5',
              isActive ? 'text-primary-40' : 'text-grayscale-50',
            )}
            height={20}
            src={iconPath ? apiClient.getFileUrl(iconPath) : '/placeholder.svg'}
            width={20}
          />
        </div>
      )}
      <span className={cn('flex-1', isActive && 'text-primary-40')}>
        {label}
      </span>
    </Link>
  );
}
