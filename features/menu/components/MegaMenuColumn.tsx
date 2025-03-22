import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface CategoryProduct {
  id: string;
  name: string;
  image: string;
}

interface BestSellingProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  unit: string;
}

interface MegaMenuColumnProps {
  categoryProducts?: CategoryProduct[];
  bestSellingProducts?: BestSellingProduct[];
}

export default function MegaMenuColumn({
  categoryProducts,
  bestSellingProducts,
}: MegaMenuColumnProps) {
  return (
    <div className="space-y-6 ">
      {/* Category Products Grid */}
      {categoryProducts && (
        <div className="grid grid-cols-3 gap-4  border-b-[1.5px] border-grayscale-20 pb-5">
          {categoryProducts.map(product => (
            <Link
              key={product.id}
              className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-02 transition-shadow hover:shadow-md"
              href={`/products/${product.id}`}
              style={{ textDecoration: 'none' }}>
              <Image
                alt={product.name}
                className="h-10 w-10 object-contain"
                height={40}
                src={product.image || '/placeholder.svg'}
                width={40}
              />
              <span className="text-sm text-grayscale-90">{product.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Best Selling Section */}
      {bestSellingProducts && (
        <div>
          <div className="mb-3 flex items-center">
            <div className="flex items-center gap-2  border-r-[1.5px] border-grayscale-20 pr-3">
              <div className="flex h-5 w-5 rounded-xl items-center justify-center">
                <Image
                  alt="Bán chạy nhất"
                  className="text-white"
                  height={16}
                  src="/placeholder.svg"
                  width={16}
                />
              </div>
              <h3 className="text-md font-bold text-grayscale-90">
                Bán chạy nhất
              </h3>
            </div>
            <Link
              className="flex items-center gap-1 text-sm text-primary-40 ml-3 hover:underline"
              href="#"
              style={{ textDecoration: 'none' }}>
              Xem thêm
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {bestSellingProducts.map(product => (
              <Link
                key={product.id}
                className="group space-y-1"
                href={`/products/${product.id}`}
                style={{ textDecoration: 'none' }}>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    fill
                    alt={product.name}
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                    src={product.image || '/placeholder.svg'}
                  />
                </div>
                <h4 className="line-clamp-2 text-xs text-grayscale-90 group-hover:text-primary-40">
                  {product.name}
                </h4>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-primary-50">
                      {product.price.toLocaleString()}đ
                    </span>
                    <span className="text-xs text-primary-50">
                      /{product.unit}
                    </span>
                  </div>
                  <span className="text-xs text-grayscale-40 line-through">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
