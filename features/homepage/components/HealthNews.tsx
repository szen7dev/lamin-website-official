import Image from "next/image"
import Link from "next/link"

export default function HealthNews() {
  // Placeholder health news data
  const articles = [
    {
      id: 1,
      title: "10 cách tăng cường hệ miễn dịch tự nhiên",
      excerpt: "Khám phá các phương pháp tự nhiên giúp nâng cao sức đề kháng và bảo vệ cơ thể khỏi bệnh tật.",
      image: "/placeholder.svg?height=300&width=500",
      date: "2023-06-15",
      link: "/blog/tang-cuong-he-mien-dich",
      category: "Sức khỏe",
    },
    {
      id: 2,
      title: "Chế độ dinh dưỡng cho người tập thể thao",
      excerpt: "Hướng dẫn chi tiết về chế độ ăn uống phù hợp cho người thường xuyên tập luyện thể thao.",
      image: "/placeholder.svg?height=300&width=500",
      date: "2023-06-10",
      link: "/blog/dinh-duong-the-thao",
      category: "Dinh dưỡng",
    },
    {
      id: 3,
      title: "Cách phòng ngừa các bệnh mùa hè phổ biến",
      excerpt: "Những biện pháp hiệu quả giúp bảo vệ sức khỏe và phòng tránh các bệnh thường gặp trong mùa hè.",
      image: "/placeholder.svg?height=300&width=500",
      date: "2023-06-05",
      link: "/blog/phong-ngua-benh-mua-he",
      category: "Sức khỏe",
    },
    {
      id: 4,
      title: "Vitamin và khoáng chất thiết yếu cho trẻ em",
      excerpt: "Tìm hiểu về các loại vitamin và khoáng chất quan trọng giúp trẻ phát triển khỏe mạnh.",
      image: "/placeholder.svg?height=300&width=500",
      date: "2023-05-28",
      link: "/blog/vitamin-cho-tre-em",
      category: "Sức khỏe trẻ em",
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <Link href={article.link} key={article.id} className="group">
          <div className="relative h-48 w-full overflow-hidden rounded-lg mb-3">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {article.category}
              </span>
              <span className="text-xs text-gray-500 ml-2">{formatDate(article.date)}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

