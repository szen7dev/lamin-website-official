# Tài Liệu Dự Án Elena Pharmacy Dành Cho Lập Trình Viên

## Chào Mừng Đến Với Dự Án Frontend Elena Pharmacy! 👋

Tài liệu này được biên soạn để giúp các lập trình viên mới nhanh chóng nắm bắt cấu trúc dự án, các quy ước coding và best practices. Bằng cách tuân theo hướng dẫn này, bạn sẽ nhanh chóng bắt kịp tiến độ và đóng góp hiệu quả cho dự án frontend Elena Pharmacy.

## 🚀 Tổng Quan Dự Án

Elena Pharmacy là một nền tảng thương mại điện tử chuyên bán thuốc trực tuyến. Dự án frontend này được xây dựng bằng **Next.js 14+ với App Router**, sử dụng **React**, **TypeScript**, và **Tailwind CSS**. Chúng tôi áp dụng **kiến trúc feature-based** để đảm bảo khả năng mở rộng, dễ bảo trì và codebase sạch đẹp, có tổ chức.

**Công Nghệ Chính:**

*   **Framework:** Next.js 14+ (App Router)
*   **Ngôn Ngữ:** TypeScript
*   **Styling:** Tailwind CSS
*   **Quản Lý State:** React Context API (có thể mở rộng thêm Zustand/Redux Toolkit & React Query/SWR trong tương lai)
*   **Giao Tiếp API:** Axios (hoặc Fetch API) với tầng service API riêng biệt

## 📂 Cấu Trúc Dự Án

Dự án được tổ chức theo cấu trúc module hóa, tách biệt rõ ràng các phần, và có khả năng mở rộng cao. Dưới đây là cấu trúc thư mục chính:

📦 elena-pharmacy/
├── 📂 app/ # App Router của Next.js - Routing & Pages
│ ├── 📂 (public)/ # Các Trang Public (ưu tiên SEO) - Ai Cũng Truy Cập Được
│ │ ├── 📂 blog/ # Trang Blog (SEO)
│ │ ├── 📂 products/ # Trang Danh Sách Sản Phẩm
│ │ ├── 📂 product/ # Trang Chi Tiết Sản Phẩm [slug]
│ │ ├── 📂 trusted-shops/ # Trang Shop Uy Tín
│ │ ├── 📂 height-measurement/ # Trang Đo Chiều Cao
│ │ ├── 📂 nutrition-check/ # Trang Kiểm Tra Dinh Dưỡng
│ │ ├── 📂 contact/ # Trang Liên Hệ
│ │ ├── 📜 page.tsx # Trang Chủ (HomePage) - elela.vn
│ │ ├── 📜 layout.tsx # Layout Public - Layout Chung Cho Trang Public
│ │ └── 📜 template.tsx # Template Public (Nếu Cần) - Template Chung Cho Trang Public
│ ├── 📂 (protected)/ # Các Trang Protected (Yêu Cầu Xác Thực - Chưa MVP)
│ │ ├── 📂 cart/ # Trang Giỏ Hàng
│ │ ├── 📂 checkout/ # Trang Thanh Toán
│ │ ├── 📂 orders/ # Trang Đơn Hàng Của Tôi (Chưa MVP)
│ │ ├── 📂 account/ # Trang Tài Khoản Người Dùng (Chưa MVP)
│ │ ├── 📜 layout.tsx # Layout Protected - Layout Chung Cho Trang Protected
│ │ └── 📜 template.tsx # Template Protected (Nếu Cần) - Template Chung Cho Trang Protected
│ ├── 📂 api/ # Route API - Các Route API Tuỳ Chỉnh Trong Next.js (Nếu Cần)
│ ├── 📂 admin/ # Trang Admin - Trang Quản Trị (Out of Scope - Ngoài Phạm Vi MVP)
│ ├── 📜 middleware.ts # Middleware - Middleware Bảo Vệ Route & Xác Thực
│ ├── 📜 layout.tsx # Root Layout - Layout Gốc, Layout Chính Của Ứng Dụng
│ ├── 📜 loading.tsx # Loading UI - Hiệu Ứng Loading Khi Chuyển Route
│ └── 📜 error.tsx # Error UI - Hiển Thị Lỗi Khi Route Gặp Sự Cố
├── 📂 features/ # Feature Modules - Các Module Tính Năng, Gom Nhóm Logic & Components Theo Tính Năng
│ ├── 📂 homepage/ # Feature Module: Trang Chủ
│ ├── 📂 product/ # Feature Module: Tính Năng Sản Phẩm
│ ├── 📂 article/ # Feature Module: Tính Năng Bài Viết
│ ├── 📂 trusted-shop/ # Feature Module: Tính Năng Shop Uy Tín
│ ├── 📂 height-measurement/ # Feature Module: Tính Năng Đo Chiều Cao
│ ├── 📂 nutrition-check/ # Feature Module: Tính Năng Kiểm Tra Dinh Dưỡng
│ ├── 📂 contact/ # Feature Module: Tính Năng Liên Hệ
│ ├── 📂 cart/ # Feature Module: Tính Năng Giỏ Hàng (Chưa MVP)
│ ├── 📂 checkout/ # Feature Module: Tính Năng Thanh Toán (Chưa MVP)
│ └── 📂 auth/ # Feature Module: Tính Năng Xác Thực (Chưa MVP)
├── 📂 services/ # Tầng Services API - Tầng Giao Tiếp API Với Backend Độc Lập
│ ├── api.ts # Cấu Hình API Client Chung - Cấu Hình Axios Instance
│ ├── authService.ts # API Service: Xác Thực
│ ├── productService.ts # API Service: Sản Phẩm
│ ├── articleService.ts # API Service: Bài Viết
│ └── ... # Các API Services Khác
├── 📂 components/ # Components Tái Sử Dụng - Các UI Components Chung, Atoms, Molecules, Organisms
│ ├── 📂 ui/ # UI Components (Atoms) - Các UI Components Nguyên Tử, Tái Sử Dụng (Button, Input, Modal, ...)
│ ├── 📂 layout/ # Layout Components (Molecules) - Các Components Layout, Khung Trang (Header, Footer, PublicLayout, ...)
│ ├── 📂 seo/ # SEO Components - Các Components Hỗ Trợ SEO (Metadata, Schema Markup)
│ ├── 📂 form/ # Form Components (Organisms) - Các Form Components Phức Tạp, Tái Sử Dụng
│ └── 📜 index.ts # File Export Các Reusable Components
├── 📂 hooks/ # Custom React Hooks Tái Sử Dụng - Các Custom Hooks Tái Sử Dụng
│ └── 📜 index.ts # File Export Các Reusable Hooks
├── 📂 contexts/ # Context Providers - Các Context Providers Quản Lý Global State
│ └── 📜 index.ts # File Export Các Context Providers
├── 📂 utils/ # Utility Functions - Các Utility Functions, Pure Functions & Logging
│ └── 📜 index.ts # File Export Các Utility Functions
├── 📂 styles/ # Global Styles & CSS Modules - Global Styles & CSS Modules
│ └── 📜 globals.css # Global Styles - File Chứa Tailwind Directives
├── 📂 config/ # Configuration Files - Các File Cấu Hình
│ └── 📜 index.ts # File Export Các File Cấu Hình
├── 📜 next.config.js # Next.js Config - File Cấu Hình Next.js
├── 📜 tailwind.config.js # Tailwind CSS Config - File Cấu Hình Tailwind CSS
└── 📜 tsconfig.json # TypeScript Config - File Cấu Hình TypeScript

### Thư Mục `app/` - App Router của Next.js

*   **File-Based Routing:** Next.js App Router sử dụng routing dựa trên thư mục. Các thư mục và file trong `app/` định nghĩa các routes của ứng dụng.
*   **Layouts & Templates:**
    *   `layout.tsx`: Định nghĩa layout chung được chia sẻ bởi nhiều trang. Root layout tại `app/layout.tsx` là bắt buộc và bao bọc toàn bộ ứng dụng.
    *   `template.tsx`: Tương tự layout, nhưng không giữ state khi chuyển route.
*   **Xử Lý Lỗi & Loading:**
    *   `error.tsx`: Custom UI hiển thị lỗi khi route gặp sự cố runtime.
    *   `loading.tsx`: Custom UI hiển thị loading trong quá trình chuyển route.
*   **`(public)/` & `(protected)/` Groups:** Sử dụng để tổ chức route:
    *   `(public)/`: Chứa các trang public, ai cũng truy cập được, ưu tiên SEO (ví dụ: trang chủ, trang sản phẩm, blog).
    *   `(protected)/`: Chứa các trang yêu cầu xác thực người dùng (ví dụ: giỏ hàng, thanh toán, tài khoản - chưa có trong MVP).
*   **`api/`:** Dùng để tạo các API routes ngay trong Next.js (khi cần custom backend logic nhỏ cho frontend, nhưng chủ yếu dự án dùng backend độc lập).
*   **`middleware.ts`:** Dùng cho middleware, xử lý các logic chạy trước khi route được truy cập (ví dụ: bảo vệ route, kiểm tra xác thực).

### Thư Mục `features/` - Feature Modules

*   **Kiến Trúc Feature-Based:** Thư mục này tổ chức code theo features (ví dụ: `homepage`, `product`, `auth`). Mỗi feature module tự chứa tất cả logic, components, hooks liên quan đến tính năng đó.
*   **Tính Module Hóa & Dễ Mở Rộng:** Kiến trúc feature-based giúp dự án module hóa cao, dễ thêm tính năng mới, dễ bảo trì và dễ scale khi dự án lớn mạnh.
*   **Bên Trong Mỗi Feature Module:**
    *   `components/`: Chứa các components đặc thù của feature (Client hoặc Server Components).
    *   `hooks/`: Chứa các React Hooks đặc thù của feature.
    *   `services/` (Tuỳ Chọn): Chứa logic API service đặc thù của feature (ưu tiên dùng thư mục `services/` gốc).
    *   `index.ts`: File export các components và hooks của feature module để import dễ dàng từ bên ngoài.

### Thư Mục `services/` - Tầng API Service

*   **Tầng Giao Tiếp API Tập Trung:** Thư mục này chứa toàn bộ code giao tiếp với backend API.
*   **Abstraction & Reusability:** Tầng service API giúp tách biệt logic API, tái sử dụng code API calls, và dễ dàng thay đổi backend implementation nếu cần.
*   **`api.ts`:** Cấu hình API client chung (ví dụ: Axios instance) với base URL, headers, interceptors.
*   **`authService.ts`, `productService.ts`, ...:** Mỗi file service đại diện cho một domain API (ví dụ: xác thực, sản phẩm, bài viết), chứa các function API calls liên quan đến domain đó.

### Thư Mục `components/` - Reusable UI Components

*   **UI Components Tái Sử Dụng:** Thư mục này chứa các UI components được thiết kế để tái sử dụng khắp ứng dụng, đảm bảo tính nhất quán và giảm thiểu code trùng lặp.
*   **Phân Loại Theo Loại Component:**
    *   `ui/`: Chứa các UI components nguyên tử (atoms) - các UI elements cơ bản (button, input, modal, ...).
    *   `layout/`: Chứa các components layout (molecules) - các components cấu trúc layout trang (header, footer, sidebar, ...).
    *   `seo/`: Chứa các SEO components - các components hỗ trợ SEO (metadata, schema markup).
    *   `form/`: Chứa các form components (organisms) - các form phức tạp, tái sử dụng.
*   **`index.ts`:** File export tất cả các reusable components để import dễ dàng.

### Thư Mục `hooks/` - Reusable Custom Hooks

*   **Custom Hooks Tái Sử Dụng:** Thư mục này chứa các custom React Hooks tái sử dụng, đóng gói logic tái sử dụng để component code clean và tập trung vào UI.
*   **Ví Dụ:** `useAuth.ts` (logic xác thực), `useCart.ts` (logic giỏ hàng), `useFetch.ts` (logic fetch API chung), `useSEO.ts` (logic SEO).
*   **`index.ts`:** File export tất cả các reusable hooks.

### Thư Mục `contexts/` - Context Providers

*   **Quản Lý Global State Tập Trung:** Thư mục này chứa các Context Providers để quản lý global state của ứng dụng bằng React Context API.
*   **Ví Dụ:** `AuthContext.tsx` (state xác thực), `CartContext.tsx` (state giỏ hàng), `ThemeContext.tsx` (state theme mode).
*   **Centralized State Management:** Context Providers giúp chia sẻ state xuống component tree mà không cần prop drilling, quản lý state hiệu quả và có tổ chức.
*   **`index.ts`:** File export tất cả các context providers.

### Thư Mục `utils/` - Utility Functions

*   **Các Hàm Utility Tái Sử Dụng:** Thư mục này chứa các utility functions (pure functions, không side-effects) để tái sử dụng logic helper.
*   **Ví Dụ:** `format.ts` (currency formatting, date formatting), `helpers.ts` (slug generation), `logger.ts` (logging utility).
*   **Code Clean & Dễ Test:** Utility functions giúp code clean, dễ test và tái sử dụng, giảm code trùng lặp.
*   **`index.ts`:** File export tất cả các utility functions.

### Thư Mục `styles/` - Global Styles

*   **Global CSS:** File `styles/globals.css` chứa global styles cho toàn bộ ứng dụng, bao gồm các Tailwind CSS directives và custom global CSS rules.
*   **Styling Nhất Quán:** Global styles đảm bảo giao diện nhất quán trên toàn bộ website.

### Thư Mục `config/` - Configuration

*   **Cấu Hình Tập Trung:** Thư mục này chứa các file cấu hình cho ứng dụng.
*   **`env.ts`:** Quản lý environment variables, giúp cấu hình ứng dụng theo môi trường (dev, staging, production).
*   **`siteConfig.ts`:** Chứa các cấu hình chung của website, ví dụ: SEO defaults, theme configurations, tên app, domain.
*   **`index.ts`:** File export tất cả các cấu hình.

## 🎯 Các Nguyên Tắc & Quy Ước Coding Quan Trọng

*   **Kiến Trúc Feature-Based:** Tổ chức code theo features để dễ quản lý và mở rộng.
*   **Ưu Tiên Server Components:** Sử dụng Server Components mặc định cho pages và components để tận dụng SSR/SSG và tối ưu SEO, hiệu suất. Chỉ dùng Client Components khi thực sự cần interactivity.
*   **Tách Biệt Server & Client Components:** Giữ ranh giới rõ ràng giữa Server và Client Components để tránh lỗi và đảm bảo hiệu suất. **Không dùng React Hooks trực tiếp trong Server Components**.
*   **Reusable Components & Hooks:** Tạo reusable UI components và custom hooks để giảm code trùng lặp và tăng tính nhất quán.
*   **Centralized State Management:** Sử dụng Context API (và có thể mở rộng thêm Zustand/Redux Toolkit) để quản lý global state.
*   **Tầng API Service:** Sử dụng thư mục `services/` để tạo tầng API service giao tiếp với backend, giúp code API có tổ chức và dễ maintain.
*   **Tối Ưu SEO:** Ưu tiên SEO bằng cách dùng Server Components, tối ưu metadata và cấu trúc nội dung.
*   **Theming & Styling:** Sử dụng Tailwind CSS và ThemeContext để quản lý theme tập trung và đảm bảo styling nhất quán.

## 🚀 Bắt Đầu Dự Án

1.  **Cài Đặt Dependencies:** Đảm bảo đã cài Node.js và yarn. Chạy `yarn install` ở thư mục gốc dự án.
2.  **Chạy Development Server:** Chạy `yarn dev` ở thư mục gốc để start development server.
3.  **Truy Cập Ứng Dụng:** Mở trình duyệt và truy cập `http://localhost:3000` để xem frontend Elena Pharmacy ở chế độ development.
4.  **Khám Phá Codebase:** Bắt đầu khám phá codebase bằng cách xem file `app/page.tsx` (Trang Chủ) và thư mục `features/homepage/` để hiểu cách tổ chức features và pages.

## 🤝 Hướng Dẫn Đóng Góp Code

*   **Tạo Feature Branches:** Khi làm feature mới hoặc fix bug, tạo branch mới từ `main` branch với tên branch mô tả (ví dụ: `feature/add-shopping-cart`, `fix/header-logo-issue`).
*   **Tuân Thủ Quy Ước Coding:** Code theo các quy ước và best practices đã mô tả trong tài liệu này.
*   **Code Clean & Comment Đầy Đủ:** Viết code dễ hiểu, dễ maintain. Comment code để giải thích logic phức tạp hoặc components.
*   **Viết Test (Tương Lai):** (Ở các giai đoạn sau) Viết unit tests và integration tests để đảm bảo chất lượng code và tránh regression.
*   **Tạo Pull Requests:** Khi xong feature hoặc fix bug, tạo Pull Request (PR) để merge branch vào `main` branch. Đặt tên và mô tả PR rõ ràng, chi tiết.
*   **Code Reviews:** Chuẩn bị code của bạn sẽ được review bởi team và đóng góp feedback cho code của người khác.

## 🔑 Điểm Mấu Chốt Cần Nhớ

*   **Feature-Based Là Ưu Tiên:** Dự án xây dựng theo feature-based để dễ scale và tổ chức.
*   **Server Components Cho Hiệu Suất & SEO:** Ưu tiên dùng Server Components để tối ưu hiệu suất và SEO.
*   **Reusable Components & Hooks:** Xây dựng reusable components và hooks để giảm trùng lặp code và nhất quán UI.
*   **Context API Quản Lý Global State:** Dùng Context API để quản lý global state của ứng dụng.
*   **Tầng API Service Cho Backend Integration:** Sử dụng thư mục `services/` để tạo tầng API service giao tiếp với backend, code API clean và dễ maintain.