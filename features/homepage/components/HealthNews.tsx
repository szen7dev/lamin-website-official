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
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary-40" />
          <h2 className="text-lg font-semibold">Góc Sức Khỏe</h2>
          <div className="h-6">
            <Separator orientation="vertical" className="flex-1 w-[1px]" />
          </div>

          <Button
            variant="link"
            className="flex items-center gap-1 text-primary-40 pl-0 decoration-transparent">
            Xem thêm
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge key={category.id} variant="outline" className="bg-white border-1">
            <Link
              href={category.href}
              className="decoration-transparent text-black font-medium text-sm">
              {category.label}
            </Link>
          </Badge>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Article */}
        <div className="md:col-span-2">
          <Link href={mainArticle.href} className="group block decoration-transparent">
            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={mainArticle.image || '/placeholder.svg'}
                alt={mainArticle.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        </div>

        {/* Related Articles */}
        <div className="flex flex-col justify-between space-y-4">
          {relatedArticles.map(article => (
            <Link
              key={article.id}
              href={article.href}
              className="group flex gap-4 decoration-transparent">
              <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={article.image || '/placeholder.svg'}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        </div>
      </div>
    </div>
  )
}
