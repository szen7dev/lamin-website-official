import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Newspaper } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const categories = [
  { id: 1, label: 'Dinh dưỡng', href: '#' },
  { id: 2, label: 'Phòng chữa bệnh', href: '#' },
  { id: 3, label: 'Khỏe đẹp', href: '#' },
  { id: 4, label: 'Mẹ và bé', href: '#' },
  { id: 5, label: 'Giới tính', href: '#' },
  { id: 6, label: 'Khuyến mãi', href: '#' },
]

const mainArticle = {
  id: 1,
  image: '/placeholder.svg?height=400&width=600',
  title:
    'Chính thức: Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em và đánh giá an toàn tiêm chủng cho toàn dân',
  date: '27/10/2023',
  category: 'Truyền Thông',
  href: '#',
}

const relatedArticles = [
  {
    id: 2,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '26/10/2023',
    category: 'Truyền Thông',
    href: '#',
  },
  {
    id: 3,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '25/10/2023',
    category: 'Truyền Thông',
    href: '#',
  },
  {
    id: 4,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '24/10/2023',
    category: 'Truyền Thông',
    href: '#',
  },
  {
    id: 5,
    image: '/placeholder.svg?height=100&width=150',
    title: 'Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em',
    date: '23/10/2023',
    category: 'Truyền Thông',
    href: '#',
  },
]

export default function HealthNews() {
  return (
    <section aria-labelledby="health-news-title">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary-40" />
          <h2 className="text-lg font-semibold">Góc Sức Khỏe</h2>
          <div className="h-6">
            <Separator className="flex-1 w-[1px]" orientation="vertical" />
          </div>

          <Button
            className="flex items-center gap-1 text-primary-40 pl-0 decoration-transparent"
            variant="link">
            Xem thêm
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge key={category.id} className="bg-white border-1" variant="outline">
            <Link
              className="decoration-transparent text-black font-medium text-sm"
              href={category.href}>
              {category.label}
            </Link>
          </Badge>
        ))}
      </nav>

      {/* Content Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {/* Main Article */}
        <article className="md:col-span-2">
          <Link className="group block decoration-transparent" href={mainArticle.href}>
            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                fill
                alt={mainArticle.title}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src={mainArticle.image || '/placeholder.svg'}
              />
            </div>
            <div className="mb-2 flex items-center gap-3">
              <Badge className="text-grayscale-40 font-medium text-xs bg-light-12">
                {mainArticle.category}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-grayscale-90 group-hover:text-primary-40">
              {mainArticle.title}
            </h3>
          </Link>
        </article>

        {/* Related Articles */}
        <aside className="flex flex-col justify-between space-y-4">
          {relatedArticles.map(article => (
            <Link
              key={article.id}
              className="group flex gap-4 decoration-transparent"
              href={article.href}>
              <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  fill
                  alt={article.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src={article.image || '/placeholder.svg'}
                />
              </div>
              <div className="flex flex-col justify-around">
                <Badge className="text-grayscale-40 font-medium text-xs bg-light-12 w-max">
                  {article.category}
                </Badge>
                <h3 className="line-clamp-2 text-sm font-medium text-grayscale-90 group-hover:text-primary-40">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </section>
  )
}
