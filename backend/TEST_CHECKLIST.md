# ✅ Kịch Bản Kiểm Thử Backend (Backend Test Checklist)

Tài liệu này dùng để theo dõi và xác nhận chất lượng các chức năng phía Backend.

---

## 🚀 Cách Chạy Bộ Kiểm Thử Tự Động (Automated Testing)
Từ thư mục gốc dự án:
```powershell
python backend/test_api.py
```

---

## 📋 Danh Sách Các Bước Kiểm Thử (Test Cases)

| Mã Test | Tên Kịch Bản Kiểm Thử | Kỳ Vọng (Expected Result) | Trạng Thái |
| :---: | :--- | :--- | :---: |
| **TC-01** | **Health Check (`GET /api/health` hoặc `GET /`)** | Trả về mã HTTP 200, status `online`. | ✅ PASS |
| **TC-02** | **Đăng ký tài khoản mới (`POST /api/auth/register`)** | Tạo User thành công, băm mật khẩu, trả về JWT Token và User ID. | ✅ PASS |
| **TC-03** | **Kiểm tra Starter Kit (Tài nguyên ban đầu)** | Người dùng mới lập tức sở hữu đúng **100 Bông tuyết ❄️**. | ✅ PASS |
| **TC-04** | **Khởi tạo Cây thông mặc định** | Cây thông mới có sẵn **2 tầng mở khóa** (Tầng 0 và Tầng 1). | ✅ PASS |
| **TC-05** | **Thu hoạch chu kỳ hợp lệ (`POST /api/resources/claim`)** | Cộng +25 Bông tuyết ❄️, cập nhật thời điểm `last_claimed_at`. | ✅ PASS |
| **TC-06** | **Chống gian lận Cooldown Claim** | Bấm claim lần 2 ngay lập tức -> Server chặn với mã 400 và báo số phút/giây cần đợi. | ✅ PASS |
| **TC-07** | **Điểm danh hàng ngày (`POST /api/resources/daily-checkin`)** | Nhận +100 Bông tuyết, tăng streak lên 1. | ✅ PASS |
| **TC-08** | **Chặn điểm danh 2 lần/ngày** | Bấm điểm danh lần thứ 2 trong cùng ngày -> Server chặn với mã 400. | ✅ PASS |
| **TC-09** | **Xem danh mục Cửa hàng (`GET /api/shop/items`)** | Trả về danh sách đủ 12 vật phẩm (đã được seed sẵn). | ✅ PASS |
| **TC-10** | **Mua vật phẩm từ Shop (`POST /api/shop/buy`)** | Trừ chính xác số Bông tuyết tương ứng và thêm món đồ vào `UserInventory`. | ✅ PASS |
| **TC-11** | **Chặn mua khi không đủ tuyết** | Mua đồ đắt tiền hơn số dư -> Server báo lỗi 400 "Không đủ Bông tuyết". | ✅ PASS |
| **TC-12** | **Xem Túi đồ (`GET /api/shop/inventory`)** | Hiển thị đúng số lượng và chi tiết các món đồ vừa mua. | ✅ PASS |
| **TC-13** | **Gắn Topper lên Đỉnh cây (`POST /api/tree/slot/equip`)** | Gắn Ngôi sao vàng lên Tầng 0 Slot 0 thành công, trừ 1 món trong túi đồ. | ✅ PASS |
| **TC-14** | **Ràng buộc vị trí Đỉnh cây** | Thử gắn Quả cầu đỏ lên Tầng 0 (Đỉnh) -> Server chặn với mã 400 (chỉ nhận Topper). | ✅ PASS |
| **TC-15** | **Gắn đồ lên Tầng 1 (`POST /api/tree/slot/equip`)** | Gắn Quả cầu đỏ lên Tầng 1 Slot 0 thành công. | ✅ PASS |
| **TC-16** | **Tính tổng Điểm Giáng Sinh (`GET /api/tree`)** | Tổng điểm Festive Score tự động cộng dồn từ tất cả các slot đang cắm đồ. | ✅ PASS |
| **TC-17** | **Gỡ đồ khỏi Slot (`POST /api/tree/slot/unequip`)** | Gỡ Quả cầu đỏ -> Slot trở về trống, trả lại +1 món vào Túi đồ. | ✅ PASS |
| **TC-18** | **Mở khóa Tầng tiếp theo (`POST /api/tree/upgrade-layer`)** | Trừ 150 Bông tuyết và mở thành công Tầng 2. | ✅ PASS |
| **TC-19** | **Xem Cây thông bạn bè (`GET /api/tree/public/{username}`)** | Trả về trạng thái cây công khai của người chơi khác mà không yêu cầu token chủ sở hữu. | ✅ PASS |

---

## 🔍 Kiểm Thử Thủ Công Qua Swagger UI
1. Khởi chạy server: `python backend/run.py`
2. Mở trình duyệt: `http://localhost:8000/docs`
3. Nhấp nút **Authorize** (ổ khóa màu xanh góc phải) và nhập tài khoản thử nghiệm để gọi thử các API có bảo mật.
