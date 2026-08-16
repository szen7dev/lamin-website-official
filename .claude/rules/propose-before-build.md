# Rule: PHÂN TÍCH → TÓM TẮT → ĐỀ XUẤT → CHỜ GẬT → MỚI LÀM

**Standing rule của chủ dự án. Áp dụng cho MỌI việc được giao.**

Bắt tay sửa code ngay khi vừa nhận yêu cầu là **sai quy trình**, kể cả khi phương án bạn chọn hoá ra đúng.

## Bốn bước

1. **PHÂN TÍCH** — đọc mã nguồn / cấu hình / bản build **thật**. Kiểm chứng được thì kiểm, đừng suy từ tên
   hàm hay trí nhớ phiên trước. Repo này có nhiều thứ nhìn một đằng chạy một nẻo
   ([`no-invented-facts.md`](no-invented-facts.md)).
2. **TÓM TẮT** — nói lại bằng **ngôn ngữ nghiệp vụ, không thuật ngữ**, vì chủ dự án không đọc mã nguồn:
   - Việc này thực chất là gì
   - Hiện trạng: đã có gì, thiếu gì
   - Làm xong thì **người dùng thấy gì khác**
3. **ĐỀ XUẤT** — 2–3 phương án kèm đánh đổi thật, **và nói rõ nên chọn cái nào, vì sao**. Bắt buộc kèm:
   - Cái gì bị đụng **ngoài phạm vi yêu cầu**
   - Cái gì có thể hỏng nếu chọn sai
4. **CHỜ GẬT** rồi mới sửa file đầu tiên.

**Giao việc KHÔNG PHẢI là đã duyệt phương án.** Lúc giao việc, chủ dự án chưa nhìn thấy hiện trạng mà bước 1
vừa moi ra — thường bước 1 làm thay đổi hẳn việc cần làm.

## Ngoại lệ (làm ngay, nhưng vẫn phải tóm tắt kết quả)

- Việc một bước, không phá được gì (đọc file, chạy lệnh chỉ đọc, tra cứu)
- Yêu cầu đã chi tiết tới mức không còn phương án nào để chọn
- Đang chữa cháy production — vá trước, báo ngay sau, **nói rõ đã tự quyết những gì**
- Chủ dự án bảo "cứ làm đi" cho **đúng việc đó** (không tự suy rộng sang việc kế tiếp)

## Riêng với repo này

Push lên `main` là **deploy thẳng ra lamin.com.vn** ([`deploy-gitops.md`](deploy-gitops.md)). Việc đó
**không bao giờ** rơi vào ngoại lệ — luôn phải hỏi trước, kể cả khi thay đổi chỉ là tài liệu.

Trong lúc làm: hiện **checklist tick dần** ([`task-checklist.md`](task-checklist.md)).
