import Link from 'next/link';
import Image from 'next/image';

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

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  return (
    <div className="w-full" onMouseEnter={handleMouseEnter}>
      <Link
        className={cn(
          'flex items-center rounded-md gap-3 px-4 mr-2 py-3 text-sm transition-colors hover:bg-[#F1F4FD] hover:mr-0 hover:border-0 border-b-[1.5px] decoration-transparent',
          isActive && 'bg-[#F1F4FD] font-medium',
          className,
        )}
        href={href}
        style={{ textDecoration: 'none' }}>
        {icon && (
          <div className="flex h-5 w-5 items-center justify-center">
            <Image
              alt={label}
              className={cn(
                'h-5 w-5',
                isActive ? 'text-primary-40' : 'text-grayscale-50',
              )}
              height={20}
              src={
                iconPath ? apiClient.getFileUrl(iconPath) : '/placeholder.svg'
              }
              width={20}
            />
          </div>
        )}
        <span className={cn('flex-1', isActive && 'text-primary-40')}>
          {label}
        </span>
      </Link>
    </div>
  );
}
