# 📋 Danh Sách Chức Năng Frontend (Frontend Functions List)

Giao diện Web được xây dựng bằng **React 18 + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti**. Dưới đây là danh sách chi tiết các Component, dịch vụ và luồng tương tác người dùng.

---

## 1. Phân Hệ Dịch Vụ API (`src/services/api.js`)

| Tên Hàm (Function) | Endpoint Kết Nối | Mô tả chức năng |
| :--- | :--- | :--- |
| `api.register` | `POST /api/auth/register` | Gửi dữ liệu đăng ký người dùng mới. Lưu JWT token vào `localStorage`. |
| `api.login` | `POST /api/auth/login` | Gửi thông tin đăng nhập, nhận và lưu JWT token. |
| `api.getMe` | `GET /api/auth/me` | Lấy thông tin tài khoản người dùng đang đăng nhập. |
| `api.getResources` | `GET /api/resources` | Lấy số lượng Bông tuyết ❄️, trạng thái cooldown, và điểm danh ngày. |
| `api.claimResource` | `POST /api/resources/claim` | Gọi thu hoạch 25 ❄️ sau chu kỳ 30 phút. |
| `api.dailyCheckin` | `POST /api/resources/daily-checkin` | Gọi điểm danh nhận 100+ ❄️ hàng ngày. |
| `api.getShopItems` | `GET /api/shop/items` | Tải danh sách 12 vật phẩm trang trí từ cửa hàng. |
| `api.buyItem` | `POST /api/shop/buy` | Gửi yêu cầu mua vật phẩm bằng Bông tuyết. |
| `api.getInventory` | `GET /api/shop/inventory` | Tải danh sách vật phẩm người chơi đang sở hữu trong túi. |
| `api.getMyTree` | `GET /api/tree` | Tải cấu trúc các tầng, slot và vật phẩm trên cây của tôi. |
| `api.getPublicTree` | `GET /api/tree/public/:username` | Tải cây thông của bạn bè theo username. |
| `api.upgradeLayer` | `POST /api/tree/upgrade-layer` | Gửi yêu cầu mở khóa tầng tiếp theo của cây. |
| `api.equipSlot` | `POST /api/tree/slot/equip` | Gắn vật phẩm từ túi đồ vào slot trang trí đã chọn. |
| `api.unequipSlot` | `POST /api/tree/slot/unequip` | Gỡ vật phẩm khỏi slot và cất lại vào túi đồ. |
| `api.adminGetUsers` | `GET /api/admin/users` | Admin: Tải danh sách người chơi kèm tài nguyên & thông số cây thông. |
| `api.adminBuffUser` | `POST /api/admin/users/:id/buff` | Admin: Thêm/bớt Bông tuyết ❄️ cho người chơi chỉ định. |
| `api.adminSetRole` | `POST /api/admin/users/:id/set-role` | Admin: Thay đổi quyền hạn giữa 'admin' và 'user'. |

---

## 2. Danh Sách Các Thành Phần Giao Diện (React Components)

| Tên Component | File | Mô Tả & Tương Tác |
| :--- | :--- | :--- |
| **`App`** | `src/App.jsx` | Component gốc: Quản lý State tập trung (User, Resources, Tree, Shop, Inventory), điều phối các Modal và hiển thị thông báo Toast. |
| **`Navbar`** | `src/components/Navbar.jsx` | Thanh điều hướng đầu trang:<br>- Đếm số Bông tuyết ❄️ (hiệu ứng xoay vòng).<br>- Điểm Khí thế Giáng sinh ⭐.<br>- Nút mở Cửa hàng, Túi đồ, Ghé thăm bạn bè.<br>- Nút `🛡️ Admin` đặc biệt (chỉ hiển thị khi tài khoản có quyền Admin).<br>- Đăng nhập / Đăng xuất người dùng. |
| **`AdminModal`** | `src/components/AdminModal.jsx` | **Bảng Quản Trị Viên (Admin Panel)**:<br>- Thống kê tổng số người chơi, tổng tuyết toàn server.<br>- Tìm kiếm người chơi theo username/tên hiển thị.<br>- Nút `Buff Tuyết ❄️` (nhập số lượng hoặc chọn nhanh +100, +500, +1000, +5000).<br>- Nút phong quyền Admin hoặc hạ quyền User. |
| **`ChristmasTree`** | `src/components/ChristmasTree.jsx` | **Trái tim của trò chơi**: Hiển thị cây thông 4 tầng hình chóp lá xanh viền tuyết.<br>- Tầng 0 (Đỉnh): 1 slot cho Sao/Thiên thần.<br>- Tầng 1 (Trên): 2 slots.<br>- Tầng 2 (Giữa): 3 slots (có nút mở khóa 150 ❄️).<br>- Tầng 3 (Đáy): 4 slots (có nút mở khóa 300 ❄️).<br>- Hover vào slot đã cắm hiển thị nút gỡ `(x)`. |
| **`ResourceCard`** | `src/components/ResourceCard.jsx` | Hiển thị 2 thẻ thu thập tài nguyên:<br>1. **Thu Hoạch Tuyết (30 phút)**: Đồng hồ đếm ngược `MM:SS` thời gian thực, nút bấm phát sáng khi sẵn sàng.<br>2. **Điểm Danh Ngày**: Đếm chuỗi streak ngày liên tiếp, nút nhận quà 100+ ❄️. |
| **`ShopModal`** | `src/components/ShopModal.jsx` | Cửa hàng Giáng Sinh dạng Popup:<br>- Lọc theo danh mục: Tất cả, Đỉnh cây ⭐️, Treo cành 🔴, Dây đèn ✨, Hộp quà 🎁.<br>- Kiểm tra số dư Bông tuyết, nút Mua (vô hiệu hóa nếu không đủ tuyết). |
| **`EquipModal`** | `src/components/EquipModal.jsx` | Bảng chọn đồ trang trí khi bấm vào slot trống:<br>- Tự động lọc danh sách chỉ hiển thị đồ hợp lệ với tầng đó (Ví dụ: Đỉnh cây chỉ hiện Topper).<br>- Bấm "Gắn Lên" kích hoạt hiệu ứng pháo hoa Confetti. |
| **`InventoryModal`** | `src/components/InventoryModal.jsx` | Bảng xem toàn bộ đồ trang trí đang có trong túi kho đồ cùng số lượng. |
| **`AuthModal`** | `src/components/AuthModal.jsx` | Hộp thoại Đăng nhập / Đăng ký tài khoản mới kèm thông báo nhận 100 ❄️ khởi đầu. |
| **`VisitModal`** | `src/components/VisitModal.jsx` | Hộp thoại tìm kiếm và chiêm ngưỡng cây thông của bạn bè theo username. |
| **`Snowfall`** | `src/components/Snowfall.jsx` | Hiệu ứng tuyết rơi tự nhiên toàn màn hình với tốc độ, kích thước và độ trong suốt ngẫu nhiên. |
| **`ItemIcon`** | `src/components/ItemIcon.jsx` | Hiển thị emoji và animation sinh động cho từng món đồ (rung rinh `sway`, lấp lánh `twinkle`, trôi nổi `float`). |
| **`AudioPlayer`** | `src/components/AudioPlayer.jsx` | **Trình phát nhạc Giáng Sinh** tích hợp trên Navbar:<br>- Bật / Tắt âm thanh (Mute/Unmute).<br>- Tùy chỉnh thanh trượt âm lượng.<br>- Chuyển đổi giữa 3 bản nhạc: *Jingle Bells*, *We Wish You A Merry Christmas*, *Deck The Halls*.<br>- Phát hiệu ứng âm thanh chuông ngân khi thu hoạch tuyết và gắn đồ lên cây. |
| **`BottomNav`** | `src/components/BottomNav.jsx` | **Thanh điều hướng đáy màn hình (Dành riêng cho Mobile)**:<br>- Cố định dưới chân màn hình điện thoại (hiển thị khi `< md`).<br>- Nút bấm to, rõ, dễ chạm bằng ngón tay cái: Cửa hàng 🛒, Túi đồ 🎒, Ghé thăm 👀, Admin 🛡️. |
