# Rule: việc nhiều bước phải có checklist tick dần

**Standing rule của chủ dự án.**

Việc từ **3 bước trở lên** thì **liệt kê checklist trước khi bắt đầu**, rồi tick từng mục trong lúc làm.

## Cách làm

- **Liệt kê trước.** Danh sách hiện ra ngay đầu, trước khi sửa file đầu tiên — để chủ dự án thấy phạm vi và
  chặn lại nếu thừa/thiếu.
- **Một mục = một kết quả kiểm chứng được.** "Sửa API" là mục tồi. "Đổi base URL trong `.env.production` và
  xác nhận bằng grep trên `.next`" là mục tốt.
- **Chỉ tick khi thật sự xong và đã kiểm.** Tick vì "code đã viết xong" là nói dối — repo này build được
  ngay cả khi type sai ([`verify-in-browser.md`](verify-in-browser.md)).
- **Đúng một mục đang làm** tại một thời điểm.
- **Tick ngay khi xong**, đừng gom lại tick một lượt cuối buổi — mất hết ý nghĩa theo dõi.
- **Việc phát sinh → thêm mục mới**, không nhét lặng vào một mục cũ rồi vẫn tick nó.
- Mục nào **không làm được** thì nói rõ là không làm được và vì sao, đừng bỏ trống cho trôi.

## Vì sao

Chủ dự án không đọc mã nguồn nên không tự biết việc đã tới đâu. Một câu "đã xong" cuối buổi không phân biệt
được giữa *làm đủ 6 việc* và *làm 4 việc rồi quên 2*. Checklist biến tiến độ thành thứ nhìn thấy được.

Đi kèm: [`propose-before-build.md`](propose-before-build.md) — checklist là bước sau khi phương án đã được
gật, không phải bước thay thế cho việc trình phương án.
