import React from 'react';
import '@/styles/globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import 'leaflet/dist/leaflet.css';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { CartProvider } from '@/features/cart/contexts/CartContext';
import { Providers } from '@/components/providers';
import { fontSans } from '@/config/fonts';

export const metadata = generateSeoMetadata({
  title: 'Lamin',
  description: 'Giải pháp nâng chiều cao Dựng tầm vóc Việt',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="vi">
      <head>
        <link href="https://trixgo.com" rel="preconnect" />
        <link href={process.env.NEXT_PUBLIC_API_URL} rel="preconnect" />
        <link href={process.env.NEXT_PUBLIC_CLOUDFRONT_URL} rel="preconnect" />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          'bg-white text-foreground antialiased',
          fontSans.variable,
        )}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <CartProvider>{children}</CartProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </Providers>
      </body>
    </html>
  );
}
