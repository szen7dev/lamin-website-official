import type { Coach } from '@/features/homepage/types/coachTypes';

// ĐỘI NGŨ CHUYÊN MÔN lấy từ s7-data-hub, đổi sang hình dạng `Coach` mà giao diện đang dùng — cùng cách
// làm với `features/product/api/storeCatalog.ts`: đổi NGUỒN, giữ nguyên HÌNH DẠNG để màn hình không cần
// biết dữ liệu đến từ đâu.
//
// s7 chỉ trả ĐÚNG BỐN TRƯỜNG công khai (`{id, name, position, avatar_url, bio}` — xem
// `store_public.js publicTeamMember()`), khác hẳn `Coach` cũ vốn là một bản ghi HR/CRM đầy đủ (lương, hợp
// đồng, bảo hiểm…). Property KHÔNG có trong response CHỦ Ý để `undefined`, không bịa — màn hình đọc field
// nào thì field đó rỗng, đúng những gì admin CHƯA khai.

export interface StoreTeamMember {
  id: string;
  name: string;
  position: string | null;
  avatar_url: string | null;
  bio: string | null;
}

// `avatar_url` là URL ĐẦY ĐỦ (CDN của s7, không phải đường dẫn tương đối kiểu trixgo) — đặt thẳng vào
// `image`. Nơi hiển thị (CoachesList/CoachDetail) phải TỰ NHẬN RA đây là URL đầy đủ và dùng thẳng, KHÔNG
// được đưa qua `apiClient.getContactImageUrl()` — hàm đó luôn ghép thêm gốc CDN của trixgo vào trước, đưa
// một URL đã đầy đủ vào sẽ ra một đường dẫn hỏng.
export const toCoach = (m: StoreTeamMember): Coach =>
  ({
    __s7: true,
    _id: m.id,
    name: m.name,
    image: m.avatar_url || '',
    note: m.bio || '',
    position: m.position ? { _id: m.position, name: m.position } : undefined,
    // s7 chưa có khái niệm "chuyên khoa" tách khỏi chức danh — để trống, giao diện đã có sẵn nhánh hiện
    // "Chuyên gia" khi thiếu field này (xem CoachesList.tsx / CoachDetail.tsx).
    field: undefined,
  }) as Coach;

/** Lấy đội ngũ thô. `null` = gian hàng chưa cấu hình / s7 không với tới được → nơi gọi tự quay về nguồn cũ. */
async function fetchTeam(): Promise<StoreTeamMember[] | null> {
  try {
    const r = await fetch('/api/cua-hang/doi-ngu', { cache: 'no-store' });
    if (r.status === 503) return null;
    if (!r.ok) return null;
    const j = await r.json();

    return Array.isArray(j?.data) ? (j.data as StoreTeamMember[]) : null;
  } catch {
    return null;
  }
}

/** Danh sách CTV/Chuyên gia, đã đổi hình dạng. `null` → nơi gọi rơi về nguồn cũ. */
export async function getStoreTeamList(): Promise<Coach[] | null> {
  const rows = await fetchTeam();

  return rows ? rows.map(toCoach) : null;
}

/** Một người theo id. `null` = chưa cấu hình / không tìm thấy / không phải vai Chuyên gia-CTV. */
export async function getStoreTeamMember(id: string): Promise<Coach | null> {
  try {
    const r = await fetch(`/api/cua-hang/doi-ngu/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (r.status === 503) return null;
    if (!r.ok) return null;
    const j = await r.json();

    return j?.data ? toCoach(j.data as StoreTeamMember) : null;
  } catch {
    return null;
  }
}
