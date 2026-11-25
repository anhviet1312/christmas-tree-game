# 📋 Danh Sách Chức Năng Backend (Backend Functions List)

Hệ thống Backend được xây dựng bằng **Python (FastAPI + SQLAlchemy + Pydantic + JWT)**. Dưới đây là danh sách chi tiết các chức năng, endpoint và quy tắc nghiệp vụ.

---

## 1. Phân Hệ Xác Thực & Người Dùng (`routers/auth.py`)

| Tên Function | Phương thức & URL | Mô tả nghiệp vụ | Dữ liệu đầu vào | Dữ liệu trả về |
| :--- | :--- | :--- | :--- | :--- |
| `register` | `POST /api/auth/register` | Đăng ký tài khoản mới.<br>- Băm mật khẩu bằng `bcrypt`.<br>- Tự động cấp **100 Bông tuyết ❄️** khởi đầu.<br>- Tự động tạo cây thông ban đầu (2 tầng). | `username`, `password`, `display_name` | JWT Token + Thông tin người dùng |
| `login` | `POST /api/auth/login` | Xác thực đăng nhập bằng username & password. Cấp JWT Access Token. | `username`, `password` | JWT Token + Thông tin người dùng |
| `login_for_docs` | `POST /api/auth/token` | Endpoint phục vụ Authorize Form trực tiếp trong giao diện Swagger `/docs`. | `OAuth2PasswordRequestForm` | JWT Token |
| `get_me` | `GET /api/auth/me` | Lấy thông tin cá nhân của người chơi từ JWT Token. | Bearer Token (Header) | Thông tin User |

---

## 2. Phân Hệ Kinh Tế & Thu Hoạch Tài Nguyên (`routers/resources.py`)

| Tên Function | Phương thức & URL | Mô tả nghiệp vụ | Dữ liệu đầu vào | Dữ liệu trả về |
| :--- | :--- | :--- | :--- | :--- |
| `get_user_resources` | `GET /api/resources` | Lấy số lượng Bông tuyết hiện tại, trạng thái điểm danh ngày, số giây đếm ngược tới lần claim tiếp theo. | Bearer Token | `snowflakes`, `can_claim`, `remaining_claim_seconds`, `can_daily_checkin`, `login_streak` |
| `claim_resource` | `POST /api/resources/claim` | Cơ chế Idle/Cooldown: Cứ sau 30 phút được thu hoạch (+25 ❄️).<br>- Tự động cộng thêm buff thưởng từ **Điểm Giáng Sinh** của cây thông (`festive_score // 10`).<br>- Chặn và trả về số phút/giây nếu chưa hết cooldown. | Bearer Token | `claimed_snowflakes`, `current_snowflakes`, `next_claim_at` |
| `daily_checkin` | `POST /api/resources/daily-checkin` | Điểm danh nhận thưởng ngày (+100 ❄️ cơ bản).<br>- Tự động tính chuỗi ngày liên tiếp (`login_streak`).<br>- Mỗi ngày streak cộng thêm +15 ❄️.<br>- Chặn nhận thưởng lần thứ 2 trong cùng ngày. | Bearer Token | `claimed_snowflakes`, `current_snowflakes`, `login_streak` |
| `calculate_tree_festive_bonus` | *Internal Helper* | Tính tổng điểm Festive của các vật phẩm đang cắm trên cây để làm hệ số thưởng cho lần claim. | `user_id`, `db` | `int` (Điểm thưởng thêm) |

---

## 3. Phân Hệ Cửa Hàng & Túi Đồ (`routers/shop.py`)

| Tên Function | Phương thức & URL | Mô tả nghiệp vụ | Dữ liệu đầu vào | Dữ liệu trả về |
| :--- | :--- | :--- | :--- | :--- |
| `list_shop_items` | `GET /api/shop/items` | Lấy danh sách 12 vật phẩm Giáng sinh bán trong shop (Ngôi sao, thiên thần, quả cầu, chuông, tất, đèn, hộp quà). | Public | Danh sách vật phẩm kèm giá, điểm, loại |
| `buy_item` | `POST /api/shop/buy` | Dùng Bông tuyết để mua vật phẩm vào túi đồ.<br>- Kiểm tra số dư tuyết.<br>- Trừ tài nguyên và cộng dồn số lượng vào `UserInventory`. | `item_id`, `quantity` | Số dư mới, số lượng trong túi |
| `get_user_inventory` | `GET /api/shop/inventory` | Lấy danh sách các vật phẩm người chơi đang sở hữu trong túi đồ (kèm số lượng). | Bearer Token | Danh sách vật phẩm trong túi |

---

## 4. Phân Hệ Cây Thông & Trang Trí (`routers/tree.py`)

| Tên Function | Phương thức & URL | Mô tả nghiệp vụ | Dữ liệu đầu vào | Dữ liệu trả về |
| :--- | :--- | :--- | :--- | :--- |
| `get_my_tree` | `GET /api/tree` | Lấy thông tin cây thông của tôi: số tầng đã mở, trạng thái từng slot (trống hay đang cắm món gì), tổng điểm Festive. | Bearer Token | Cấu trúc đầy đủ các tầng & slot |
| `get_public_tree` | `GET /api/tree/public/{username}` | Xem cây thông của người chơi khác qua Username (phục vụ tính năng ghé thăm & chia sẻ). | `username` (Path) | Cấu trúc cây thông của người đó |
| `upgrade_tree_layer` | `POST /api/tree/upgrade-layer` | Dùng Bông tuyết mở khóa tầng tiếp theo (Tầng 2: 150 ❄️, Tầng 3: 300 ❄️). | Bearer Token | `unlocked_layer`, `remaining_snowflakes` |
| `equip_slot_item` | `POST /api/tree/slot/equip` | Gắn vật phẩm từ túi đồ lên slot trang trí:<br>- Kiểm tra tầng đã mở khóa chưa.<br>- Kiểm tra slot index hợp lệ.<br>- Đỉnh cây (Tầng 0) **chỉ nhận Topper** (Sao/Thiên thần).<br>- Nếu slot đã có đồ, tự động trả đồ cũ về túi đồ. | `layer_index`, `slot_index`, `item_id` | Kết quả gắn, điểm cộng |
| `unequip_slot_item` | `POST /api/tree/slot/unequip` | Gỡ vật phẩm khỏi slot và cất lại vào túi đồ cá nhân. | `layer_index`, `slot_index` | Kết quả gỡ |

---

## 5. Quy Tắc Cấu Trúc Cây Thông (`config.py`)
*   **Tầng 0 (Đỉnh cây):** 1 slot (Slot 0) — *Chỉ cho phép loại `TOPPER`*.
*   **Tầng 1 (Tầng trên):** 2 slot (Slot 0, 1) — *Cho phép `ORNAMENT`, `LIGHT`*.
*   **Tầng 2 (Tầng giữa):** 3 slot (Slot 0, 1, 2) — *Mở khóa: 150 ❄️*.
*   **Tầng 3 (Tầng đáy):** 4 slot (Slot 0, 1, 2, 3) — *Mở khóa: 300 ❄️, cho phép cả `GIFT`*.
