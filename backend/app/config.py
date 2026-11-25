import os

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./christmas_tree.db")

# Tương thích chuẩn SQLAlchemy 2.0 cho PostgreSQL (hỗ trợ cả Neon / Render)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# JWT Security
SECRET_KEY = os.getenv("SECRET_KEY", "christmas-magic-super-secret-key-2026-hohoho")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 ngày

# Game Rules & Economy
STARTER_SNOWFLAKES = 100            # Tài nguyên khởi đầu khi tạo tài khoản
CLAIM_COOLDOWN_MINUTES = 30         # Cứ 30 phút được nhận 1 lần
BASE_CLAIM_REWARD = 25              # Số bông tuyết mỗi lần nhận theo chu kỳ
DAILY_BASE_REWARD = 100             # Số bông tuyết điểm danh ngày
DAILY_STREAK_BONUS = 15             # Mỗi ngày liên tiếp cộng thêm 15 bông tuyết

# Cấu hình tầng cây và slot
# Layer 0: Đỉnh cây (Chỉ 1 slot cho Ngôi sao / Topper)
# Layer 1: Tầng 1 (2 slots)
# Layer 2: Tầng 2 (3 slots)
# Layer 3: Tầng 3 (4 slots)
LAYER_SLOT_CAPACITIES = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
}

# Giá mở khóa các tầng tiếp theo (tầng 0 và tầng 1 mặc định đã có)
LAYER_UNLOCK_COSTS = {
    2: 150,  # Mở tầng 2 cần 150 tuyết
    3: 300,  # Mở tầng 3 cần 300 tuyết
}
