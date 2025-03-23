'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/utils/helpers';

interface MegaMenuItemProps {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
}

export default function MegaMenuItem({
  label,
  href,
  hasDropdown,
  isActive,
  children,
}: MegaMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle mouse enter without delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  // Handle mouse leave with a longer delay to allow moving to the dropdown
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Check both the menu item and the dropdown
      const menuItemHovered = menuItemRef.current?.matches(':hover') || false;
      const dropdownHovered = dropdownRef.current?.matches(':hover') || false;

      if (!menuItemHovered && !dropdownHovered) {
        setIsHovered(false);
      }
    }, 200); // Longer delay
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={menuItemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Link
        className={cn(
          'flex items-center gap-1 text-[15px] font-medium text-grayscale-90 hover:text-primary-50',
          isActive && 'text-primary-50',
        )}
        href={href}
        style={{ textDecoration: 'none' }}>
        {label}
        {hasDropdown && (
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isHovered && 'rotate-180',
            )}
          />
        )}
      </Link>

      {hasDropdown && isHovered && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 min-w-[800px] rounded-lg bg-white p-6 shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          {children}
        </div>
      )}
    </div>
  );
}
