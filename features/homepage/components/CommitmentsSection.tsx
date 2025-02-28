import { Shield, Truck, CreditCard, HeartHandshake } from "lucide-react"

export default function CommitmentsSection() {
  // Commitments data
  const commitments = [
    {
      id: 1,
      title: "Sản phẩm chính hãng",
      description: "100% sản phẩm có nguồn gốc rõ ràng, được nhập khẩu chính hãng",
      icon: <Shield className="h-10 w-10" />,
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Giao hàng nhanh chóng",
      description: "Giao hàng trong vòng 2 giờ tại nội thành Hà Nội và TP.HCM",
      icon: <Truck className="h-10 w-10" />,
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Thanh toán an toàn",
      description: "Nhiều phương thức thanh toán, bảo mật thông tin khách hàng",
      icon: <CreditCard className="h-10 w-10" />,
      color: "text-purple-600",
    },
    {
      id: 4,
      title: "Tư vấn chuyên nghiệp",
      description: "Đội ngũ dược sĩ và chuyên gia tư vấn 24/7",
      icon: <HeartHandshake className="h-10 w-10" />,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {commitments.map((commitment) => (
        <div key={commitment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className={`mx-auto mb-4 ${commitment.color}`}>{commitment.icon}</div>
          <h3 className="font-bold text-lg mb-2">{commitment.title}</h3>
          <p className="text-gray-600 text-sm">{commitment.description}</p>
        </div>
      ))}
    </div>
  )
}

