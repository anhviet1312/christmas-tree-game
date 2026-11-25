# 🐛 Nhật Ký Sửa Lỗi Backend (Backend Bug Tracker)

Thư mục này lưu trữ toàn bộ lịch sử phát hiện, phân tích nguyên nhân và cách khắc phục các lỗi (bugs) xảy ra ở phân hệ Backend.

---

## 📌 Quy Trình Ghi Nhận Bug Mới
Khi phát hiện hoặc xử lý một lỗi mới, hãy tạo một file markdown theo định dạng:
`BUG-[Số Thứ Tự]-[Tên Lỗi Ngắn Gọn].md` (Ví dụ: `BUG-001-unicode-encode-error.md`).

---

## 📝 Mẫu File Ghi Nhận Lỗi (Template)

```markdown
# [BUG-XXX] Tiêu Đề Lỗi Ngắn Gọn

* **Ngày phát hiện:** YYYY-MM-DD
* **Người xử lý:** Tên người sửa
* **Mức độ nghiêm trọng:** Thấp / Trung bình / Cao / Nghiêm trọng (Crash)
* **Trạng thái:** Đã giải quyết (Resolved) / Đang xử lý (In Progress)

---

### 1. Mô tả Triệu chứng (Symptom)
- Lỗi xuất hiện khi thực hiện hành động gì?
- Chi tiết thông báo lỗi (Error trace / Log).

### 2. Nguyên nhân Gốc rễ (Root Cause)
- Tại sao lỗi lại xảy ra? Do thư viện, môi trường, hay logic thuật toán?

### 3. Giải pháp Xử lý (Resolution)
- Các file đã chỉnh sửa.
- Đoạn mã cụ thể trước và sau khi sửa.

### 4. Kết quả Sau khi Sửa & Xác minh (Verification)
- Chạy lệnh gì hoặc kịch bản nào để chứng minh lỗi đã được giải quyết triệt để.
```

---

## 📑 Danh Sách Các Lỗi Đã Ghi Nhận

| Mã Lỗi | Tên Lỗi | Mức Độ | Trạng Thái | File Chi Tiết |
| :---: | :--- | :---: | :---: | :--- |
| **BUG-001** | `UnicodeEncodeError: 'charmap' codec can't encode character '\U0001f384'` khi chạy `run.py` trên Git Bash Windows | Cao (Crash) | ✅ Resolved | [BUG-001-cp1252-unicode-encode-error.md](./BUG-001-cp1252-unicode-encode-error.md) |
