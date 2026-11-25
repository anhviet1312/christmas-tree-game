# [BUG-001] UnicodeEncodeError 'charmap' Codec Khi Chạy Server Trên Windows Terminal

* **Ngày phát hiện:** 2026-11-25
* **Người xử lý:** Antigravity Agent
* **Mức độ nghiêm trọng:** Cao (Crash ứng dụng lúc khởi động)
* **Trạng thái:** ✅ Đã giải quyết (Resolved)

---

### 1. Mô tả Triệu chứng (Symptom)
Khi chạy lệnh khởi động server:
```bash
python backend/run.py
```
Trong môi trường **Git Bash (MINGW64)** hoặc PowerShell/CMD trên Windows, chương trình bị dừng ngay lập tức kèm thông báo lỗi:
```text
Traceback (most recent call last):
  File "D:\Code_Golang\ChrimasTree\backend\run.py", line 5, in <module>
    print("\U0001f384 \u0110ang kh\u1edfi ch\u1ea1y Server Game C▒y Th▒ng Noel...")
  File "C:\Users\Hoang Quoc Viet\AppData\Local\Programs\Python\Python311\Lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
UnicodeEncodeError: 'charmap' codec can't encode character '\U0001f384' in position 0: character maps to <undefined>
```

---

### 2. Nguyên nhân Gốc rễ (Root Cause)
* Trên hệ điều hành Windows, các console terminal truyền thống thường gán bảng mã chuẩn `cp1252` hoặc `cp437` cho `sys.stdout`.
* Các bảng mã cũ này không chứa các ký tự emoji Unicode (như cây thông Noel `\U0001f384` 🎄) và một số ký tự dấu tiếng Việt phức tạp, dẫn đến hàm mã hóa ký tự `codecs.charmap_encode` ném ngoại lệ `UnicodeEncodeError`.

---

### 3. Giải pháp Xử lý (Resolution)
Cấu hình tự động chuyển đổi luồng xuất chuẩn (`sys.stdout` và `sys.stderr`) sang bảng mã **UTF-8** ngay khi chương trình được nạp trên Windows:

```python
import sys

# Đảm bảo console trên Windows (Git Bash, CMD, PowerShell) xuất được UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
```

* Các file đã áp dụng:
  - `backend/run.py`
  - `backend/app/main.py`
  - `backend/test_api.py`

---

### 4. Kết quả Sau khi Sửa & Xác minh (Verification)
Chạy lại lệnh:
```bash
python backend/run.py
```
Kết quả hiển thị chính xác các ký tự tiếng Việt và emoji không còn bị lỗi:
```text
============================================================
🎄 Đang khởi chạy Server Game Cây Thông Noel...
👉 Mở trình duyệt chơi game tại:       http://localhost:8000
👉 Tài liệu Swagger API tại:           http://localhost:8000/docs
============================================================
```
Ứng dụng khởi chạy máy chủ Uvicorn thành công hoàn toàn.
