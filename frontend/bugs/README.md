# 🐛 Nhật Ký Sửa Lỗi Frontend (Frontend Bug Tracker)

Thư mục này lưu trữ toàn bộ lịch sử phát hiện, phân tích nguyên nhân và cách khắc phục các lỗi (bugs) liên quan đến giao diện Web (React / Vite / Tailwind).

---

## 📌 Quy Trình Ghi Nhận Bug Mới
Khi phát hiện hoặc xử lý một lỗi giao diện mới, hãy tạo một file markdown theo định dạng:
`BUG-[Số Thứ Tự]-[Tên Lỗi Ngắn Gọn].md` (Ví dụ: `BUG-001-vite-rolldown-windows-binding.md`).

---

## 📝 Mẫu File Ghi Nhận Lỗi (Template)

```markdown
# [BUG-XXX] Tiêu Đề Lỗi Giao Diện Ngắn Gọn

* **Ngày phát hiện:** YYYY-MM-DD
* **Người xử lý:** Tên người sửa
* **Mức độ nghiêm trọng:** Thấp / Trung bình / Cao / Nghiêm trọng (Crash build/render)
* **Trạng thái:** Đã giải quyết (Resolved) / Đang xử lý (In Progress)

---

### 1. Mô tả Triệu chứng (Symptom)
- Lỗi xuất hiện khi thực hiện thao tác gì trên giao diện hoặc lệnh build nào?
- Chi tiết thông báo lỗi (Console log / Build error).

### 2. Nguyên nhân Gốc rễ (Root Cause)
- Tại sao lỗi xảy ra? (Lỗi cú pháp JSX, dependency không tương thích, thiếu CSS, v.v.).

### 3. Giải pháp Xử lý (Resolution)
- Các component/file đã chỉnh sửa.
- Đoạn mã cụ thể trước và sau khi sửa.

### 4. Kết quả Sau khi Sửa & Xác minh (Verification)
- Kết quả chạy `npm run build` hoặc thao tác kiểm tra lại trên trình duyệt.
```

---

## 📑 Danh Sách Các Lỗi Đã Ghi Nhận

| Mã Lỗi | Tên Lỗi | Mức Độ | Trạng Thái | File Chi Tiết |
| :---: | :--- | :---: | :---: | :--- |
| **BUG-001** | Lỗi build Vite 8 thiếu Native Binding Rolldown trên môi trường Windows Node v22.3.0 | Nghiêm trọng (Build Fail) | ✅ Resolved | [BUG-001-vite-rolldown-windows-binding.md](./BUG-001-vite-rolldown-windows-binding.md) |
