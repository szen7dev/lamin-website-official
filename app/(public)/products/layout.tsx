import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm | Elela',
  description: 'Khám phá các sản phẩm chất lượng cao dành cho sức khỏe của bạn và gia đình',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 