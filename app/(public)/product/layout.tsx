import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm | Elela',
  description: 'Thông tin chi tiết về sản phẩm chăm sóc sức khỏe của Elela',
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 