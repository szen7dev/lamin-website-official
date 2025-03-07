import { Button } from "@/components/ui/Button"
import { ChevronRight, Newspaper } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  { id: 1, label: "Dinh dưỡng", href: "#" },
  { id: 2, label: "Phòng chữa bệnh", href: "#" },
  { id: 3, label: "Khỏe đẹp", href: "#" },
  { id: 4, label: "Mẹ và bé", href: "#" },
  { id: 5, label: "Giới tính", href: "#" },
  { id: 6, label: "Khuyến mãi", href: "#" },
]

const mainArticle = {
  id: 1,
  image: "/placeholder.svg?height=400&width=600",
  title:
    "Chính thức: Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em và đánh giá an toàn tiêm chủng cho toàn dân",
  date: "27/10/2023",
  category: "Truyền Thông",
  href: "#",
}

const relatedArticles = [
  {
    id: 2,
    image: "/placeholder.svg?height=100&width=150",
    title: "Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em",
    date: "26/10/2023",
    category: "Truyền Thông",
    href: "#",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=100&width=150",
    title: "Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em",
    date: "25/10/2023",
    category: "Truyền Thông",
    href: "#",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=100&width=150",
    title: "Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em",
    date: "24/10/2023",
    category: "Truyền Thông",
    href: "#",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=100&width=150",
    title: "Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em",
    date: "23/10/2023",
    category: "Truyền Thông",
    href: "#",
  },
]

export default function HealthNews() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary-40" />
          <h2 className="text-xl font-bold text-primary-5">Góc Sức Khỏe</h2>
        </div>
        <Button variant="link" className="flex items-center gap-1 text-primary-40">
          Xem thêm
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="rounded-full border border-grayscale-30 px-4 py-2 text-sm text-grayscale-70 transition-colors hover:bg-primary-5 hover:text-white"
          >
            {category.label}
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Article */}
        <div className="md:col-span-2">
          <Link href={mainArticle.href} className="group block">
            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={mainArticle.image || "/placeholder.svg"}
                alt={mainArticle.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded bg-primary-5/10 px-2 py-1 text-xs font-medium text-primary-40">
                {mainArticle.category}
              </span>
              <time dateTime={mainArticle.date} className="text-sm text-grayscale-50">
                {mainArticle.date}
              </time>
            </div>
            <h3 className="text-xl font-semibold text-grayscale-90 group-hover:text-primary-40">
              {mainArticle.title}
            </h3>
          </Link>
        </div>

        {/* Related Articles */}
        <div className="space-y-4">
          {relatedArticles.map((article) => (
            <Link key={article.id} href={article.href} className="group flex gap-4">
              <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <span className="mb-2 inline-block rounded bg-primary-5/10 px-2 py-1 text-xs font-medium text-primary-40">
                  {article.category}
                </span>
                <h3 className="line-clamp-2 text-sm font-medium text-grayscale-90 group-hover:text-primary-40">
                  {article.title}
                </h3>
                <time dateTime={article.date} className="mt-1 text-sm text-grayscale-50">
                  {article.date}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
