import React from 'react';
import '@/styles/globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { CartProvider } from '@/features/cart/contexts/CartContext';
import { Providers } from '@/components/providers';
import { fontSans } from '@/config/fonts';

export const metadata = generateSeoMetadata({
  title: 'Lamin Pharmacy',
  description: 'Your trusted pharmacy partner',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(
          'bg-background text-foreground antialiased',
          fontSans.variable,
        )}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <CartProvider>{children}</CartProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </Providers>
      </body>
    </html>
  );
}
