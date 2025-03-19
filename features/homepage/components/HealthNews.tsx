import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Newspaper } from 'lucide-react';

const categories = [
  { id: 1, label: 'Dinh dưỡng', href: '/health-news/category/dinh-duong' },
  {
    id: 2,
    label: 'Phòng chữa bệnh',
    href: '/health-news/category/phong-chua-benh',
  },
  { id: 3, label: 'Khỏe đẹp', href: '/health-news/category/khoe-dep' },
  { id: 4, label: 'Mẹ và bé', href: '/health-news/category/me-va-be' },
  { id: 5, label: 'Giới tính', href: '/health-news/category/gioi-tinh' },
  { id: 6, label: 'Khuyến mãi', href: '/health-news/category/khuyen-mai' },
];

const mainArticle = {
  id: 1,
  image: '/placeholder.svg?height=400&width=600',
  title:
    'Chính thức: Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em và đánh giá an toàn tiêm chủng cho toàn dân',
  date: '27/10/2023',
  category: 'Truyền Thông',
  slug: 'tiem-chung-elela-ket-qua-kiem-tra',
  href: '/health-news/article/tiem-chung-elela-ket-qua-kiem-tra',
};

const relatedArticles = [
  {
    id: 2,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '26/10/2023',
    category: 'Truyền Thông',
    slug: 'tiem-chung-elela-ket-qua-kiem-tra-tre-em',
    href: '/health-news/article/tiem-chung-elela-ket-qua-kiem-tra-tre-em',
  },
  {
    id: 3,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '25/10/2023',
    category: 'Truyền Thông',
    slug: 'tiem-chung-elela-ket-qua-kiem-tra-tre-em-2',
    href: '/health-news/article/tiem-chung-elela-ket-qua-kiem-tra-tre-em-2',
  },
  {
    id: 4,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '24/10/2023',
    category: 'Truyền Thông',
    slug: 'tiem-chung-elela-ket-qua-kiem-tra-tre-em-3',
    href: '/health-news/article/tiem-chung-elela-ket-qua-kiem-tra-tre-em-3',
  },
  {
    id: 5,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '23/10/2023',
    category: 'Truyền Thông',
    slug: 'tiem-chung-elela-ket-qua-kiem-tra-tre-em-4',
    href: '/health-news/article/tiem-chung-elela-ket-qua-kiem-tra-tre-em-4',
  },
];

export default function HealthNews() {
  return (
    <section aria-labelledby="health-news-title">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary-40" />
          <h2
            className="text-lg font-semibold text-grayscale-90"
            id="health-news-title">
            Góc Sức Khỏe
          </h2>
        </div>
        <Link
          className="flex items-center gap-1 text-primary-40 text-sm hover:underline"
          href="/health-news">
          Xem thêm
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Categories */}
      <nav aria-label="Danh mục sức khỏe" className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <Link
            key={category.id}
            className="rounded-full border border-grayscale-30 px-4 py-2 text-sm text-grayscale-70 transition-colors hover:bg-primary-5 hover:text-primary-50"
            href={category.href}>
            {category.label}
          </Link>
        ))}
      </nav>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Article */}
        <article className="md:col-span-2">
          <Link className="group block" href={mainArticle.href}>
            <figure className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                fill
                alt={mainArticle.title}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src={mainArticle.image || '/placeholder.svg'}
              />
            </figure>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded bg-primary-5/10 px-2 py-1 text-xs font-medium text-primary-40">
                {mainArticle.category}
              </span>
              <time
                className="text-sm text-grayscale-50"
                dateTime={mainArticle.date}>
                {mainArticle.date}
              </time>
            </div>
            <h3 className="text-xl font-semibold text-grayscale-90 group-hover:text-primary-40">
              {mainArticle.title}
            </h3>
          </Link>
        </article>

        {/* Related Articles */}
        <aside className="space-y-4">
          {relatedArticles.map(article => (
            <article key={article.id} className="group">
              <Link className="flex gap-4" href={article.href}>
                <figure className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    fill
                    alt={article.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    src={article.image || '/placeholder.svg'}
                  />
                </figure>
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded bg-primary-5/10 px-2 py-1 text-xs font-medium text-primary-40">
                    {article.category}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-medium text-grayscale-90 group-hover:text-primary-40">
                    {article.title}
                  </h3>
                  <time
                    className="mt-1 text-xs text-grayscale-50"
                    dateTime={article.date}>
                    {article.date}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </aside>
      </div>
    </section>
  );
}
