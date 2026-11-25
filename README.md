# 🎄 Trò Chơi Cây Thông Noel (Christmas Tree Idle Game)

Web game Giáng Sinh phong cách Cozy Idle / Decorator: Thu thập Bông Tuyết ❄️, mua sắm đồ trang trí, mở khóa tầng cây và trang trí cây thông Noel lung linh.

---

## 📁 Cấu Trúc Dự Án
```text
ChrimasTree/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── config.py         # Cấu hình luật game (cooldown 30m, starter 100 ❄️, JWT)
│   │   ├── database.py       # SQLAlchemy (SQLite cho local, Neon/Postgres cho deploy)
│   │   ├── models.py         # DB Models (User, Resource, Item, Tree, Slot)
│   │   ├── schemas.py        # Pydantic Schemas input/output
│   │   ├── auth.py           # Bcrypt & JWT Security
│   │   ├── seed.py           # 12 món đồ Giáng sinh mặc định trong Shop
│   │   ├── main.py           # FastAPI app, CORS & Static files
│   │   └── routers/
│   │       ├── auth.py       # API Đăng ký, Đăng nhập, Profile
│   │       ├── resources.py  # API Thu hoạch 30m, Điểm danh ngày
│   │       ├── shop.py       # API Cửa hàng, Túi đồ
│   │       └── tree.py       # API Cây thông, Gắn/Gỡ đồ, Mở tầng
│   ├── requirements.txt      # Thư viện phụ thuộc
│   ├── run.py                # File khởi chạy nhanh máy chủ
│   └── test_api.py           # Bộ kiểm thử tự động 18/18 bước
└── frontend/                 # React 18 + Vite + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── ChristmasTree.jsx   # Cây thông 4 tầng, tán lá cành thông, gắn slot
    │   │   ├── ResourceCard.jsx    # Thu hoạch đếm ngược 30m + Điểm danh ngày
    │   │   ├── ShopModal.jsx       # Cửa hàng sắm đồ bằng Bông tuyết
    │   │   ├── EquipModal.jsx      # Chọn đồ từ túi để cắm vào slot
    │   │   ├── InventoryModal.jsx  # Túi đồ cá nhân
    │   │   ├── AuthModal.jsx       # Đăng nhập & Đăng ký tài khoản
    │   │   ├── VisitModal.jsx      # Ghé thăm cây thông của bạn bè
    │   │   ├── Snowfall.jsx        # Hiệu ứng tuyết rơi tự nhiên
    │   │   └── ItemIcon.jsx        # Icon vật phẩm & hiệu ứng lấp lánh
    │   ├── services/
    │   │   └── api.js              # Kết nối RESTful API Backend
    │   ├── App.jsx                 # Giao diện chính kết nối trạng thái
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Hướng Dẫn Chạy Game Trên Máy (Local)

### Cách 1: Chạy Siêu Nhanh (1 Lệnh duy nhất)
Giao diện React đã được build sẵn vào thư mục `frontend/dist`. Bạn chỉ cần khởi chạy Backend, nó sẽ phục vụ toàn bộ Web Game:
```powershell
python backend/run.py
```
👉 Mở trình duyệt truy cập: **http://localhost:8000**  
👉 Xem tài liệu Swagger API: **http://localhost:8000/docs**

---

### Cách 2: Chạy Chế Độ Phát Triển (Hot-Reload)
* **Terminal 1 (Backend):**
  ```powershell
  python backend/run.py
  ```
* **Terminal 2 (Frontend Dev):**
  ```powershell
  cd frontend
  npm run dev
  ```
  👉 Mở trình duyệt tại: **http://localhost:5173** (Mọi thay đổi code frontend sẽ cập nhật tức thì).

---

## 🧪 Chạy Kiểm Thử Tự Động Backend
```powershell
python backend/test_api.py
```
*(Kiểm tra toàn bộ 18/18 bước: Đăng ký, Đăng nhập, Nhận tuyết khởi đầu, Thu hoạch 30m, Chống spam Cooldown, Điểm danh ngày, Mua sắm vật phẩm, Cắm đồ lên cây thông, Ràng buộc đỉnh cây, Nâng cấp tầng).*

---

## ☁️ Hướng Dẫn Deploy Lên Render & Vercel (Miễn Phí 100%)
Dự án đã được thiết lập sẵn đầy đủ cấu hình cho:
* **Backend:** Deploy trên [Render.com](https://render.com) qua `render.yaml` và `Procfile`.
* **Database:** Kết nối PostgreSQL vĩnh viễn trên [Neon.tech](https://neon.tech).
* **Frontend:** Deploy trên [Vercel.com](https://vercel.com) qua `frontend/vercel.json`.

👉 **Xem hướng dẫn chi tiết từng bước bấm chuột tại:** [DEPLOYMENT.md](file:///d:/Code_Golang/ChrimasTree/DEPLOYMENT.md)
