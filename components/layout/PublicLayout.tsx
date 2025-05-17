import type React from 'react';

import { FloatingChat } from '../chat/FloatingChat';

import { Footer } from './Footer';
import { Header } from './Header';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
