import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface TripleBulletButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    label: string;
    href: string;
    onClick?: () => void;
  }[];
  activeIndex?: number;
  className?: string;
}

const TripleBulletButton = ({
  items,
  activeIndex = 0,
  className,
  ...props
}: TripleBulletButtonProps) => {
  const [active, setActive] = React.useState(activeIndex);

  const handleClick = (index: number, onClick?: () => void) => {
    setActive(index);
    onClick?.();
  };

  return (
    <div
      className={cn(
        'inline-flex w-full justify-center gap-1 overflow-hidden rounded-full border-[1.5px] border-[#EFF1F5] bg-white p-1 shadow-[0px_3px_4px_0px_#00000024]',
        className,
      )}
      {...props}>
      {items.map((item, index) => (
        <Link key={index} href={item.href}>
          <button
            className={cn(
              'rounded-full px-6 py-2 text-center text-sm font-medium whitespace-nowrap transition-all duration-200',
              active === index
                ? 'bg-primary text-white'
                : 'bg-transparent text-gray-700 hover:bg-gray-100',
            )}
            onClick={() => handleClick(index, item.onClick)}>
            {item.label}
          </button>
        </Link>
      ))}
    </div>
  );
};

export { TripleBulletButton };
