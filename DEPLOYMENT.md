# 🚀 Hướng Dẫn Deploy Chi Tiết Lên Render (Backend) & Vercel (Frontend)

Tài liệu này hướng dẫn bạn từng bước đưa trò chơi Cây Thông Noel lên môi trường Production **hoàn toàn miễn phí 100%**:
* **Backend:** Deploy trên [Render.com](https://render.com) (Python FastAPI).
* **Database:** Tạo trên [Neon.tech](https://neon.tech) (PostgreSQL Serverless Free vĩnh viễn).
* **Frontend:** Deploy trên [Vercel.com](https://vercel.com) (React 18 + Vite).

---

## 📌 BƯỚC 1: Đẩy Mã Nguồn Lên GitHub

1. Khởi tạo Git trong thư mục dự án (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Init fullstack Christmas Tree Game"
   ```
2. Tạo 1 repository mới trên [GitHub.com](https://github.com/new) (ví dụ: `christmas-tree-game`).
3. Đẩy code lên GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/christmas-tree-game.git
   git branch -M main
   git push -u origin main
   ```

---

## 📌 BƯỚC 2: Tạo Database PostgreSQL Miễn Phí (Neon.tech)

> *Lưu ý: Render có gói PostgreSQL miễn phí nhưng sẽ bị xóa sau 30 ngày. Sử dụng **Neon.tech** được miễn phí vĩnh viễn 0.5GB (quá đủ cho hàng chục nghìn người chơi).*

1. Truy cập [Neon.tech](https://neon.tech) và đăng ký/đăng nhập bằng tài khoản GitHub.
2. Nhấp nút **Create Project** (Đặt tên: `christmas-tree-db`).
3. Tại trang tổng quan (Dashboard), sao chép chuỗi kết nối **Connection String** dạng:
   ```text
   postgres://username:password@ep-cool-snowflake-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   *(Lưu chuỗi này lại để dùng ở Bước 3).*

---

## 📌 BƯỚC 3: Deploy Backend Lên Render.com

1. Truy cập [Render.com](https://render.com) và đăng nhập bằng GitHub.
2. Tại thanh điều hướng, nhấp **New +** ➡️ Chọn **Web Service**.
3. Chọn repository `christmas-tree-game` vừa push.
4. Cấu hình các mục như sau:
   * **Name:** `christmas-tree-api` (hoặc tên tùy thích)
   * **Region:** `Singapore` (để tốc độ tải từ Việt Nam nhanh nhất)
   * **Root Directory:** `backend`
   * **Runtime:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type:** `Free`
5. Cuộn xuống phần **Environment Variables**, bấm **Add Environment Variable** và thêm:
   | Key | Value |
   | :--- | :--- |
   | `DATABASE_URL` | Dán chuỗi kết nối Neon ở Bước 2 vào đây |
   | `SECRET_KEY` | Nhập một chuỗi ký tự bí mật bất kỳ (vd: `noel-super-secret-key-2026`) |
   | `PYTHON_VERSION` | `3.11.1` |
6. Bấm nút **Deploy Web Service**.
7. Chờ 2 - 3 phút để Render build xong. Khi xuất hiện chữ **Live**, hãy sao chép URL của backend (ví dụ: `https://christmas-tree-api.onrender.com`).

---

## 📌 BƯỚC 4: Deploy Frontend Lên Vercel.com

1. Truy cập [Vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Nhấp nút **Add New...** ➡️ Chọn **Project**.
3. Tìm và nhấp **Import** bên cạnh repository `christmas-tree-game`.
4. Tại màn hình **Configure Project**:
   * **Root Directory:** Bấm nút **Edit** và chọn thư mục `frontend`.
   * **Framework Preset:** `Vite` (Vercel sẽ tự động nhận diện).
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Mở phần **Environment Variables**, thêm biến:
   * **Key:** `VITE_API_BASE_URL`
   * **Value:** Dán URL Backend từ Render ở Bước 3 vào đây (Ví dụ: `https://christmas-tree-api.onrender.com` - *lưu ý không có dấu `/` ở cuối*).
6. Nhấp nút **Deploy**.
7. Sau khoảng 30 giây, Vercel sẽ hoàn tất và cung cấp cho bạn một đường link chính thức (Ví dụ: `https://christmas-tree-game.vercel.app`).

---

## 🎉 BƯỚC 5: Kiểm Tra Kết Quả
1. Truy cập đường link Vercel của bạn trên trình duyệt điện thoại hoặc máy tính.
2. Thử đăng ký 1 tài khoản mới:
   - Kiểm tra số dư nhận được 100 ❄️ khởi đầu.
   - Bấm điểm danh ngày nhận thêm tuyết.
   - Mua đồ trong shop và gắn lên cây thông Noel!
