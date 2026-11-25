# [BUG-002] ModuleNotFoundError: No module named 'psycopg' Khi Deploy Lên Render

* **Ngày phát hiện:** 2026-11-25
* **Người xử lý:** Antigravity Agent
* **Mức độ nghiêm trọng:** Nghiêm trọng (Server crash khi khởi động trên Render)
* **Trạng thái:** ✅ Đã giải quyết (Resolved)

---

### 1. Mô tả Triệu chứng (Symptom)
Khi deploy Web Service lên Render kết nối với PostgreSQL (Neon / Render Postgres):
Quá trình build thành công nhưng khi server khởi động chạy lệnh `uvicorn app.main:app`, server crash với log:
```text
Traceback (most recent call last):
  File "/opt/render/project/src/backend/app/main.py", line 17, in <module>
    from app.database import engine, Base, SessionLocal
  File "/opt/render/project/src/backend/app/database.py", line 9, in <module>
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
  ...
  File "/opt/render/project/src/.venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/psycopg.py", line 497, in import_dbapi
    import psycopg
ModuleNotFoundError: No module named 'psycopg'
```

---

### 2. Nguyên nhân Gốc rễ (Root Cause)
* Trong SQLAlchemy 2.0, khi chuỗi kết nối là `postgresql://...` (không chỉ định rõ driver sau dấu cộng), SQLAlchemy mặc định ưu tiên tìm kiếm driver **`psycopg` (phiên bản 3)** thay vì `psycopg2`.
* File `backend/requirements.txt` trước đó chỉ có `psycopg2-binary`, dẫn đến SQLAlchemy 2.0 không tìm thấy module `psycopg`.

---

### 3. Giải pháp Xử lý (Resolution)
1. **Chỉ định tường minh driver `psycopg2` trong chuỗi kết nối (`backend/app/config.py`):**
   ```python
   # Tương thích chuẩn SQLAlchemy 2.0 cho PostgreSQL (hỗ trợ cả Neon / Render)
   if DATABASE_URL.startswith("postgres://"):
       DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
   elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
       DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
   ```
2. **Bổ sung cả `psycopg[binary]` vào `backend/requirements.txt`:**
   ```text
   psycopg2-binary>=2.9.9
   psycopg[binary]>=3.1.0
   ```
   Việc này đảm bảo server hỗ trợ cả 2 chuẩn driver PostgreSQL phổ biến nhất hiện nay.

---

### 4. Kết quả Sau khi Sửa & Xác minh (Verification)
* Kiểm tra trên SQLite local: 18/18 kịch bản test `test_api.py` hoạt động bình thường.
* Trên Render: SQLAlchemy kết nối trực tiếp qua driver `psycopg2` hoặc `psycopg` mà không còn bị thiếu package.
