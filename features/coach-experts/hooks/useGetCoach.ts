'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getCoach } from '../api/getCoach';
import { getStoreTeamList } from '../api/storeTeam';
import { GetCoachParams } from '../../homepage/types/coachTypes';

/** Bo dau + ha chu thuong - cung cach so khop voi `features/product/api/storeCatalog.ts`. */
const khongDau = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

/**
 * Hook to fetch coach/expert data
 * @param params Query parameters for the API request
 * @returns Query result with coach data
 */
export const useGetCoach = (params: GetCoachParams = {}) => {
  const {
    data: { coaches, pagination },
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_COACHES', params],
    queryFn: async () => {
      // Gian hàng s7 TRƯỚC, cùng nguyên tắc với sản phẩm — `null` = chưa cấu hình/không với tới được thì
      // rơi về nguồn cũ. s7 chưa phân trang đội ngũ công khai (danh sách nhỏ, dưới 200 người), nên lọc từ
      // khoá ở PHÍA TRÌNH DUYỆT và không trả `nextCursor` — nút "Sau" tự ẩn, đúng ý vì không còn trang sau.
      const fromStore = await getStoreTeamList();
      if (fromStore) {
        const kw = khongDau((params.keyword || '').trim());
        const hits = kw ? fromStore.filter((c) => khongDau(c.name).includes(kw)) : fromStore;

        const list = params.limit ? hits.slice(0, params.limit) : hits;

        return {
          coaches: list,
          // s7 chưa phân trang — trả đủ số liệu để `Pagination` không "nói dối" (totalPage/totalRecord
          // đúng bằng đúng những gì đã trả), `nextCursor` rỗng để nút "Sau" tự ẩn.
          pagination: { nextCursor: '', limit: list.length, totalRecord: list.length, totalPage: 1 },
        };
      }

      return getCoach(params);
    },
  });

  return {
    coaches,
    pagination,
    isLoading,
    error,
  };
};
