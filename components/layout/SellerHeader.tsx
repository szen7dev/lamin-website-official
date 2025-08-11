'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function SellerHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-primary shadow-md">
      <div className="px-10 py-4">
        <div className="flex items-center">
          <Link className="flex items-center" href="/">
            <Image
              priority
              alt="Winggo Logo"
              className="h-16 w-auto"
              height={64}
              src="/images/KhaiTruongWinggo.svg"
              width={192}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default SellerHeader;
