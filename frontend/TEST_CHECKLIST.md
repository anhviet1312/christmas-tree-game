# ✅ Kịch Bản Kiểm Thử Giao Diện Frontend (Frontend Test Checklist)

Tài liệu này dùng để theo dõi và xác nhận chất lượng trải nghiệm người dùng (UX/UI) trên giao diện Web React.

---

## 🚀 Cách Kiểm Thử Nhanh
* **Kiểm tra Build sản xuất:**
  ```powershell
  cd frontend
  npm run build
  ```
* **Chạy Server phát triển (Hot-Reload):**
  ```powershell
  cd frontend
  npm run dev
  ```
  Truy cập: `http://localhost:5173`

---

## 📋 Danh Sách Kịch Bản Kiểm Thử Giao Diện (UI Test Cases)

| Mã Test | Thành Phần / Hành Động | Kỳ Vọng (Expected UI Behavior) | Trạng Thái |
| :---: | :--- | :--- | :---: |
| **UI-01** | **Hero Banner (Chưa đăng nhập)** | Hiển thị lời chào Giáng Sinh, cây thông lớn, 2 nút "Đăng Ký Nhận 100 ❄️" và "Ghé Thăm Bạn Bè". | ✅ PASS |
| **UI-02** | **Hiệu ứng Tuyết rơi (`Snowfall`)** | Các bông tuyết bay nhẹ nhàng khắp màn hình, không che khuất hay cản trở thao tác click chuột. | ✅ PASS |
| **UI-03** | **Đăng ký tài khoản mới** | Mở `AuthModal`, chọn tab Đăng ký. Sau khi đăng ký thành công: tự động đăng nhập, bắn pháo hoa Confetti, số dư hiển thị ngay **100 ❄️**. | ✅ PASS |
| **UI-04** | **Đăng nhập & Đăng xuất** | Đăng nhập thành công hiện tên người chơi và avatar; bấm nút Đăng xuất trở lại màn hình Hero. | ✅ PASS |
| **UI-05** | **Đồng hồ đếm ngược Claim 30m** | Hiển thị dạng `MM:SS` giảm dần từng giây. Khi đếm về `00:00`, nút chuyển sang màu xanh phát sáng "Thu Hoạch Ngay (+25 ❄️)". | ✅ PASS |
| **UI-06** | **Thao tác Claim Bông tuyết** | Bấm nút thu hoạch: Bắn pháo hoa Confetti xanh-trắng, số dư tuyết tăng lên, đồng hồ reset về 30:00. | ✅ PASS |
| **UI-07** | **Điểm danh ngày mới** | Bấm nút "Điểm Danh Nhận Quà 🎁": Bắn pháo hoa vàng-đỏ, tăng chuỗi Streak và chuyển nút sang "Đã Nhận Hôm Nay ✔️". | ✅ PASS |
| **UI-08** | **Mở Cửa Hàng (`ShopModal`)** | Hiển thị đủ 12 món đồ. Bấm chuyển tab (Tất cả, Đỉnh cây, Treo cành, Dây đèn, Hộp quà) danh sách lọc mượt mà. | ✅ PASS |
| **UI-09** | **Mua đồ trong Shop** | Bấm "Mua Ngay": Trừ tuyết trực tiếp trên thanh Navbar, số lượng trong túi đồ tự động tăng. | ✅ PASS |
| **UI-10** | **Kiểm tra thiếu tuyết trong Shop** | Vật phẩm có giá cao hơn số dư hiện có -> Nút chuyển thành màu xám "Thiếu Tuyết" và bị vô hiệu hóa. | ✅ PASS |
| **UI-11** | **Mở Túi Đồ (`InventoryModal`)** | Hiển thị tất cả món đồ đã mua kèm số lượng chính xác. | ✅ PASS |
| **UI-12** | **Trang trí Đỉnh cây (Slot Topper)** | Bấm vào slot `(+)` trên đỉnh: `EquipModal` **chỉ hiển thị các món loại Đỉnh (Ngôi sao/Thiên thần)**, không hiển thị quả cầu hay dây đèn. | ✅ PASS |
| **UI-13** | **Trang trí Tầng 1 (Slot Thường)** | Bấm vào slot `(+)` cành thông: `EquipModal` chỉ hiển thị các món quả cầu, chuông, tất, đèn (không hiển thị Topper). | ✅ PASS |
| **UI-14** | **Hiển thị đồ trên Cây thông** | Món đồ gắn lên slot lắc lư/lấp lánh sinh động. Điểm Khí thế Giáng sinh trên thanh Navbar lập tức tăng lên tương ứng. | ✅ PASS |
| **UI-15** | **Gỡ đồ khỏi Slot** | Di chuột vào món đồ trên cành thông hiện nút tròn đỏ `(x)`. Bấm gỡ -> Slot trở về trống, món đồ tự động hoàn trả vào túi đồ. | ✅ PASS |
| **UI-16** | **Mở khóa Tầng cây mới** | Bấm nút "Mở Khóa Tầng 2 (150 ❄️)": Xác nhận popup -> Tầng 2 biến từ màu xám mờ sang màu xanh thông tươi tốt với 3 slot mới. | ✅ PASS |
| **UI-17** | **Ghé thăm Bạn bè (`VisitModal`)** | Nhập username bạn bè và bấm Tìm kiếm: Hiển thị nguyên vẹn cây thông của bạn bè ở chế độ chỉ xem (không có nút gỡ đồ). | ✅ PASS |
| **UI-18** | **Tương thích Di động (Responsive)** | Giao diện tự động co giãn vừa vặn trên cả màn hình điện thoại (Mobile) và máy tính (Desktop). | ✅ PASS |
| **UI-19** | **Hiển thị nút `🛡️ Admin` trên Navbar** | Khi đăng nhập tài khoản có role `admin`, nút Admin xuất hiện trên Navbar; tài khoản thường không thấy. | ✅ PASS |
| **UI-20** | **Bảng Quản Trị Viên (`AdminModal`)** | Mở Admin Panel, hiển thị danh sách tất cả người chơi kèm số dư tuyết, cấp tầng cây và điểm không khí. | ✅ PASS |
| **UI-21** | **Thao tác Buff Tuyết cho User** | Bấm nút "Buff Tuyết ❄️", chọn số lượng (vd: +500) và bấm xác nhận: Tuyết được cộng ngay cho user đó, có hiệu ứng pháo hoa Confetti. | ✅ PASS |
| **UI-22** | **Phong / Hạ quyền Admin** | Bấm nút đổi quyền cho người chơi: Quyền hạn được cập nhật lập tức trong danh sách quản lý. | ✅ PASS |
