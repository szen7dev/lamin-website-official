export interface CartItem {
  id: string;
  // MÃ SẢN PHẨM — khoá nối sang s7-data-hub lúc đặt hàng. `id` ở đây là id của backend nội dung
  // (api.trixgo.com), KHÔNG phải id bên s7, nên một mình nó không đặt hàng được.
  // Không bắt buộc vì giỏ hàng cũ đã nằm trong localStorage của khách (hạn 1 ngày) không có trường này;
  // món thiếu mã sẽ bị s7 loại và khách được báo thêm lại — thà vậy còn hơn đặt nhầm sang hàng khác.
  sign?: string;
  name: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  originalPrice: number; // Make this optional to avoid the toLocaleString error
  inStockQuantity?: number;
  salesoff?: number;
  quantity: number;
  unit: string;
  image?: string;
  discount?: number;
  slug?: string;
  amount?: number;
}
