# Tài Liệu Dự Án Lamin Pharmacy Dành Cho Lập Trình Viên

## Chào Mừng Đến Với Dự Án Frontend Lamin Pharmacy! 👋

Tài liệu này được biên soạn để giúp các lập trình viên mới nhanh chóng nắm bắt cấu trúc dự án, các quy ước coding và best practices. Bằng cách tuân theo hướng dẫn này, bạn sẽ nhanh chóng bắt kịp tiến độ và đóng góp hiệu quả cho dự án frontend Lamin Pharmacy.

## 🚀 Tổng Quan Dự Án

Lamin Pharmacy là một nền tảng thương mại điện tử chuyên bán thuốc trực tuyến. Dự án frontend này được xây dựng bằng **Next.js 14+ với App Router**, sử dụng **React**, **TypeScript**, và **Tailwind CSS**. Chúng tôi áp dụng **kiến trúc feature-based** để đảm bảo khả năng mở rộng, dễ bảo trì và codebase sạch đẹp, có tổ chức.

**Công Nghệ Chính:**

- **Framework:** Next.js 14+ (App Router)
- **Ngôn Ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **Quản Lý State:** React Context API (có thể mở rộng thêm Zustand/Redux Toolkit & React Query/SWR trong tương lai)
- **Giao Tiếp API:** Axios (hoặc Fetch API) với tầng service API riêng biệt

### Thư Mục `app/` - App Router của Next.js

- **File-Based Routing:** Next.js App Router sử dụng routing dựa trên thư mục. Các thư mục và file trong `app/` định nghĩa các routes của ứng dụng.
- **Layouts & Templates:**
  - `layout.tsx`: Định nghĩa layout chung được chia sẻ bởi nhiều trang. Root layout tại `app/layout.tsx` là bắt buộc và bao bọc toàn bộ ứng dụng.
  - `template.tsx`: Tương tự layout, nhưng không giữ state khi chuyển route.
- **Xử Lý Lỗi & Loading:**
  - `error.tsx`: Custom UI hiển thị lỗi khi route gặp sự cố runtime.
  - `loading.tsx`: Custom UI hiển thị loading trong quá trình chuyển route.
- **`(public)/` & `(protected)/` Groups:** Sử dụng để tổ chức route:
  - `(public)/`: Chứa các trang public, ai cũng truy cập được, ưu tiên SEO (ví dụ: trang chủ, trang sản phẩm, blog).
  - `(protected)/`: Chứa các trang yêu cầu xác thực người dùng (ví dụ: giỏ hàng, thanh toán, tài khoản - chưa có trong MVP).
- **`api/`:** Dùng để tạo các API routes ngay trong Next.js (khi cần custom backend logic nhỏ cho frontend, nhưng chủ yếu dự án dùng backend độc lập).
- **`middleware.ts`:** Dùng cho middleware, xử lý các logic chạy trước khi route được truy cập (ví dụ: bảo vệ route, kiểm tra xác thực).

### Thư Mục `features/` - Feature Modules

- **Kiến Trúc Feature-Based:** Thư mục này tổ chức code theo features (ví dụ: `homepage`, `product`, `auth`). Mỗi feature module tự chứa tất cả logic, components, hooks liên quan đến tính năng đó.
- **Tính Module Hóa & Dễ Mở Rộng:** Kiến trúc feature-based giúp dự án module hóa cao, dễ thêm tính năng mới, dễ bảo trì và dễ scale khi dự án lớn mạnh.
- **Bên Trong Mỗi Feature Module:**
  - `components/`: Chứa các components đặc thù của feature (Client hoặc Server Components).
  - `hooks/`: Chứa các React Hooks đặc thù của feature.
  - `services/` (Tuỳ Chọn): Chứa logic API service đặc thù của feature (ưu tiên dùng thư mục `services/` gốc).
  - `index.ts`: File export các components và hooks của feature module để import dễ dàng từ bên ngoài.

### Thư Mục `services/` - Tầng API Service

- **Tầng Giao Tiếp API Tập Trung:** Thư mục này chứa toàn bộ code giao tiếp với backend API.
- **Abstraction & Reusability:** Tầng service API giúp tách biệt logic API, tái sử dụng code API calls, và dễ dàng thay đổi backend implementation nếu cần.
- **`api.ts`:** Cấu hình API client chung (ví dụ: Axios instance) với base URL, headers, interceptors.
- **`authService.ts`, `productService.ts`, ...:** Mỗi file service đại diện cho một domain API (ví dụ: xác thực, sản phẩm, bài viết), chứa các function API calls liên quan đến domain đó.

### Thư Mục `components/` - Reusable UI Components

- **UI Components Tái Sử Dụng:** Thư mục này chứa các UI components được thiết kế để tái sử dụng khắp ứng dụng, đảm bảo tính nhất quán và giảm thiểu code trùng lặp.
- **Phân Loại Theo Loại Component:**
  - `ui/`: Chứa các UI components nguyên tử (atoms) - các UI elements cơ bản (button, input, modal, ...).
  - `layout/`: Chứa các components layout (molecules) - các components cấu trúc layout trang (header, footer, sidebar, ...).
  - `seo/`: Chứa các SEO components - các components hỗ trợ SEO (metadata, schema markup).
  - `form/`: Chứa các form components (organisms) - các form phức tạp, tái sử dụng.
- **`index.ts`:** File export tất cả các reusable components để import dễ dàng (TẠM THỜI CHƯA DÙNG CÁCH NÀY).

### Thư Mục `hooks/` - Reusable Custom Hooks

- **Custom Hooks Tái Sử Dụng:** Thư mục này chứa các custom React Hooks tái sử dụng, đóng gói logic tái sử dụng để component code clean và tập trung vào UI.
- **Ví Dụ:** `useAuth.ts` (logic xác thực), `useCart.ts` (logic giỏ hàng), `useFetch.ts` (logic fetch API chung), `useSEO.ts` (logic SEO).
- **`index.ts`:** File export tất cả các reusable hooks.

### Thư Mục `contexts/` - Context Providers

- **Quản Lý Global State Tập Trung:** Thư mục này chứa các Context Providers để quản lý global state của ứng dụng bằng React Context API.
- **Ví Dụ:** `AuthContext.tsx` (state xác thực), `CartContext.tsx` (state giỏ hàng), `ThemeContext.tsx` (state theme mode).
- **Centralized State Management:** Context Providers giúp chia sẻ state xuống component tree mà không cần prop drilling, quản lý state hiệu quả và có tổ chức.
- **`index.ts`:** File export tất cả các context providers.

### Thư Mục `utils/` - Utility Functions

- **Các Hàm Utility Tái Sử Dụng:** Thư mục này chứa các utility functions (pure functions, không side-effects) để tái sử dụng logic helper.
- **Ví Dụ:** `format.ts` (currency formatting, date formatting), `helpers.ts` (slug generation), `logger.ts` (logging utility).
- **Code Clean & Dễ Test:** Utility functions giúp code clean, dễ test và tái sử dụng, giảm code trùng lặp.
- **`index.ts`:** File export tất cả các utility functions.

### Thư Mục `styles/` - Global Styles

- **Global CSS:** File `styles/globals.css` chứa global styles cho toàn bộ ứng dụng, bao gồm các Tailwind CSS directives và custom global CSS rules.
- **Styling Nhất Quán:** Global styles đảm bảo giao diện nhất quán trên toàn bộ website.

### Thư Mục `config/` - Configuration

- **Cấu Hình Tập Trung:** Thư mục này chứa các file cấu hình cho ứng dụng.
- **`env.ts`:** Quản lý environment variables, giúp cấu hình ứng dụng theo môi trường (dev, staging, production).
- **`siteConfig.ts`:** Chứa các cấu hình chung của website, ví dụ: SEO defaults, theme configurations, tên app, domain.
- **`index.ts`:** File export tất cả các cấu hình.

## 🎯 Các Nguyên Tắc & Quy Ước Coding Quan Trọng

- **Kiến Trúc Feature-Based:** Tổ chức code theo features để dễ quản lý và mở rộng.
- **Ưu Tiên Server Components:** Sử dụng Server Components mặc định cho pages và components để tận dụng SSR/SSG và tối ưu SEO, hiệu suất. Chỉ dùng Client Components khi thực sự cần interactivity.
- **Tách Biệt Server & Client Components:** Giữ ranh giới rõ ràng giữa Server và Client Components để tránh lỗi và đảm bảo hiệu suất. **Không dùng React Hooks trực tiếp trong Server Components**.
- **Reusable Components & Hooks:** Tạo reusable UI components và custom hooks để giảm code trùng lặp và tăng tính nhất quán.
- **Centralized State Management:** Sử dụng Context API (và có thể mở rộng thêm Zustand/Redux Toolkit) để quản lý global state.
- **Tầng API Service:** Sử dụng thư mục `services/` để tạo tầng API service giao tiếp với backend, giúp code API có tổ chức và dễ maintain.
- **Tối Ưu SEO:** Ưu tiên SEO bằng cách dùng Server Components, tối ưu metadata và cấu trúc nội dung.
- **Theming & Styling:** Sử dụng Tailwind CSS và ThemeContext để quản lý theme tập trung và đảm bảo styling nhất quán.

## 🚀 Bắt Đầu Dự Án

1.  **Cài Đặt Dependencies:** Đảm bảo đã cài Node.js và yarn. Chạy `yarn` ở thư mục gốc dự án.
2.  **Chạy Development Server:** Chạy `yarn dev` ở thư mục gốc để start development server.
3.  **Truy Cập Ứng Dụng:** Mở trình duyệt và truy cập `http://localhost:3000` để xem frontend Lamin Pharmacy ở chế độ development.
4.  **Khám Phá Codebase:** Bắt đầu khám phá codebase bằng cách xem file `app/page.tsx` (Trang Chủ) và thư mục `features/homepage/` để hiểu cách tổ chức features và pages.

## 🤝 Hướng Dẫn Đóng Góp Code

- **Tạo Feature Branches:** Khi làm feature mới hoặc fix bug, tạo branch mới từ `main` branch với tên branch mô tả (ví dụ: `feature/add-shopping-cart`, `fix/header-logo-issue`).
- **Tuân Thủ Quy Ước Coding:** Code theo các quy ước và best practices đã mô tả trong tài liệu này.
- **Code Clean & Comment Đầy Đủ:** Viết code dễ hiểu, dễ maintain. Comment code để giải thích logic phức tạp hoặc components.
- **Viết Test (Tương Lai):** (Ở các giai đoạn sau) Viết unit tests và integration tests để đảm bảo chất lượng code và tránh regression.
- **Tạo Pull Requests:** Khi xong feature hoặc fix bug, tạo Pull Request (PR) để merge branch vào `main` branch. Đặt tên và mô tả PR rõ ràng, chi tiết.
- **Code Reviews:** Chuẩn bị code của bạn sẽ được review bởi team và đóng góp feedback cho code của người khác.

## 🔄 Kiến trúc Services và API Integration

### Root Services vs Feature Services

Dự án sử dụng hai tầng services để tách biệt concerns:

- **Root Services (`/services`):** Giao tiếp trực tiếp với API, tập trung vào data fetching/sending, không chứa business logic
- **Feature Services (`/features/*/services`):** Chứa business logic, chuyển đổi dữ liệu từ API format sang domain models

Luồng dữ liệu trong ứng dụng:
\`\`\`
UI Components → Feature Hooks → Feature Services → Root Services → API Client → Backend API
\`\`\`

**Vai trò của Root Services:**

- Gọi trực tiếp đến các endpoints API thông qua apiClient
- Xử lý các vấn đề chung như authentication, error handling
- Trả về dữ liệu nguyên bản từ API (raw data)
- Tổ chức theo domain của backend API (auth, crm, item, media, store)

**Vai trò của Feature Services:**

- Sử dụng Root Services thay vì gọi trực tiếp API
- Chuyển đổi dữ liệu từ API format sang domain models phù hợp với UI
- Tổng hợp dữ liệu từ nhiều Root Services nếu cần
- Tổ chức theo features của frontend (product, article, cart, etc.)

### API Factory Pattern

Dự án sử dụng Factory Pattern để dễ dàng chuyển đổi giữa mock và real services:

\`\`\`typescript
// Tạo factory cho một service
const myServiceFactory = createApiServiceFactory<MyService>(mockService, realService);

// Sử dụng service
const myService = myServiceFactory.getService();
\`\`\`

**Cách hoạt động của API Factory:**

- `createApiServiceFactory` nhận vào mock service và real service, trả về một factory
- Factory có method `getService()` trả về service phù hợp dựa trên cấu hình
- Các hooks và components sử dụng `getService()` để lấy service, không cần biết đó là mock hay real

Để chuyển đổi giữa mock và real API, cấu hình biến môi trường `NEXT_PUBLIC_API_MODE`:

- `mock`: Sử dụng mock services (phát triển, testing)
- `real`: Sử dụng real services (production)

### Mappers và Data Transformation

Mappers chuyển đổi dữ liệu giữa API format và domain models:

\`\`\`typescript
// Ví dụ mapper
export function mapApiModelToDomainModel(apiModel: ApiModel): DomainModel {
return {
id: apiModel.\_id,
name: apiModel.name,
// Các trường khác...
};
}
\`\`\`

**Vai trò của Mappers:**

- Chuyển đổi dữ liệu từ API format sang domain models phù hợp với UI
- Đảm bảo UI components nhận được dữ liệu đúng format bất kể nguồn dữ liệu
- Xử lý các edge cases và differences giữa mock và real data

Khi tạo mới một feature, hãy:

1. Định nghĩa domain models trong `types/`
2. Tạo mappers trong `mappers/`
3. Sử dụng mappers trong cả mock và real services

### Hướng dẫn tạo mới một Service

1.  **Tạo Root Service (nếu cần):**

    - Tạo file trong thư mục `/services/` phù hợp
    - Implement các methods gọi trực tiếp đến API
      \`\`\`typescript
      // services/item/newItemService.ts
      import apiClient from "../api/apiClient";

    export interface NewItem {
    \_id: string;
    name: string;
    // Các trường khác...
    }

    class NewItemService {
    async getItems(): Promise<NewItem[]> {
    return apiClient.get("/api/items");
    }
    // Các methods khác...
    }

    export const newItemService = new NewItemService();
    \`\`\`

2.  **Tạo Feature Service Interface:**

    - Định nghĩa interface trong `/features/your-feature/types/yourFeatureTypes.ts`
      \`\`\`typescript
      // features/your-feature/types/yourFeatureTypes.ts
      export interface YourFeatureItem {
      id: string;
      name: string;
      // Các trường khác...
      }

    export interface YourFeatureService {
    getItems(): Promise<YourFeatureItem[]>;
    // Các methods khác...
    }
    \`\`\`

3.  **Implement Real Service:**

    - Implement interface sử dụng root services
      \`\`\`typescript
      // features/your-feature/services/yourFeatureService.ts
      import { newItemService } from "@/services/item/newItemService";
      import { mapNewItemToYourFeatureItem } from "../mappers/yourFeatureMappers";
      import type { YourFeatureItem, YourFeatureService } from "../types/yourFeatureTypes";

    class YourFeatureServiceImpl implements YourFeatureService {
    async getItems(): Promise<YourFeatureItem[]> {
    const items = await newItemService.getItems();
    return items.map(mapNewItemToYourFeatureItem);
    }
    // Các methods khác...
    }

    export const yourFeatureService = new YourFeatureServiceImpl();
    \`\`\`

4.  **Implement Mock Service:**

    - Tạo mock data trong `/features/your-feature/mocks/`
    - Implement interface sử dụng mock data
      \`\`\`typescript
      // features/your-feature/mocks/yourFeatureMockService.ts
      import { mockItems } from "./yourFeatureMockData";
      import type { YourFeatureItem, YourFeatureService } from "../types/yourFeatureTypes";

    class YourFeatureMockService implements YourFeatureService {
    async getItems(): Promise<YourFeatureItem[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockItems;
    }
    // Các methods khác...
    }

    export const yourFeatureMockService = new YourFeatureMockService();
    \`\`\`

5.  **Tạo Factory:**

    - Sử dụng `createApiServiceFactory` để tạo factory
    - Export method `getYourFeatureService()`
      \`\`\`typescript
      // features/your-feature/services/yourFeatureServiceFactory.ts
      import { createApiServiceFactory } from "@/services/api/apiFactory";
      import { yourFeatureMockService } from "../mocks/yourFeatureMockService";
      import { yourFeatureService } from "./yourFeatureService";
      import type { YourFeatureService } from "../types/yourFeatureTypes";

    export const yourFeatureServiceFactory = createApiServiceFactory<YourFeatureService>(
    yourFeatureMockService,
    yourFeatureService
    );

    export const getYourFeatureService = () => yourFeatureServiceFactory.getService();
    \`\`\`

6.  **Sử dụng trong Hooks:**

    - Import `getYourFeatureService` và sử dụng trong hooks
      \`\`\`typescript
      // features/your-feature/hooks/useYourFeature.ts
      import { useState, useEffect } from "react";
      import { getYourFeatureService } from "../services/yourFeatureServiceFactory";
      import type { YourFeatureItem } from "../types/yourFeatureTypes";

    export function useYourFeature() {
    const [items, setItems] = useState<YourFeatureItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchItems = async () => {
    try {
    const service = getYourFeatureService();
    const data = await service.getItems();
    setItems(data);
    } catch (err) {
    setError(err as Error);
    } finally {
    setLoading(false);
    }
    };

        fetchItems();

    }, []);

    return { items, loading, error };
    }
    \`\`\`

### Chuyển đổi từ Mock sang Real API

Để chuyển đổi từ mock sang real API, hãy thực hiện các bước sau:

1. **Kiểm tra API endpoints:**

   - Xác nhận các endpoints trong apiClient.ts khớp với API thực tế
   - Cập nhật URL, headers, và authentication nếu cần

2. **Cập nhật mappers:**

   - Đảm bảo mappers chuyển đổi đúng từ API response sang domain models
   - Xử lý các edge cases và differences giữa mock và real data

3. **Cập nhật environment variables:**

   - Đặt `NEXT_PUBLIC_API_MODE=real` trong file `.env.local`
   - Cấu hình các biến môi trường khác như API_URL

4. **Kiểm tra xác thực:**

   - Đảm bảo authService.ts hoạt động đúng với API thực tế
   - Kiểm tra flow đăng nhập/đăng xuất

5. **Triển khai error handling:**

   - Cập nhật interceptors trong apiClient.ts để xử lý lỗi API
   - Thêm UI components để hiển thị lỗi

6. **Testing:**
   - Kiểm tra tất cả các API calls với dữ liệu thực
   - Kiểm tra các edge cases (empty responses, errors, etc.)

### Best Practices khi làm việc với API

1. **Error Handling:**

   - Luôn bọc API calls trong try-catch blocks
   - Sử dụng interceptors để xử lý lỗi chung
   - Hiển thị thông báo lỗi thân thiện với người dùng

2. **Loading States:**

   - Luôn theo dõi trạng thái loading của API calls
   - Hiển thị skeleton loaders hoặc spinners khi đang loading

3. **Caching:**

   - Sử dụng React Query hoặc SWR để caching và revalidation
   - Tránh gọi API nhiều lần cho cùng một dữ liệu

4. **Pagination:**

   - Implement pagination cho các danh sách lớn
   - Sử dụng infinite scrolling hoặc pagination controls

5. **Retry Logic:**

   - Implement retry logic cho các API calls quan trọng
   - Sử dụng exponential backoff để tránh overload server

6. **Logging:**
   - Log các API calls và responses để debug
   - Sử dụng các tools như Sentry để theo dõi lỗi

## 🔑 Điểm Mấu Chốt Cần Nhớ

- **Feature-Based Là Ưu Tiên:** Dự án xây dựng theo feature-based để dễ scale và tổ chức.
- **Server Components Cho Hiệu Suất & SEO:** Ưu tiên dùng Server Components để tối ưu hiệu suất và SEO.
- **Reusable Components & Hooks:** Xây dựng reusable components và hooks để giảm trùng lặp code và nhất quán UI.
- **Context API Quản Lý Global State:** Dùng Context API để quản lý global state của ứng dụng.
- **Tầng API Service Cho Backend Integration:** Sử dụng thư mục `services/` để tạo tầng API service giao tiếp với backend, code API clean và dễ maintain.
