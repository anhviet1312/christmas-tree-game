from sqlalchemy.orm import Session
from app.models import Item, ItemCategory

INITIAL_ITEMS = [
    # --- Đỉnh cây (Topper) ---
    {
        "code": "topper_gold_star",
        "name": "Ngôi Sao Vàng Chí Tôn ⭐️",
        "category": ItemCategory.TOPPER,
        "price": 50,
        "festive_score": 25,
        "image_url": "star-gold.png",
        "description": "Ngôi sao 5 cánh tỏa ánh hào quang lấp lánh trên đỉnh cây thông."
    },
    {
        "code": "topper_ice_angel",
        "name": "Thiên Thần Pha Lê Tuyết 👼",
        "category": ItemCategory.TOPPER,
        "price": 120,
        "festive_score": 60,
        "image_url": "angel-crystal.png",
        "description": "Thiên thần hộ mệnh tinh khiết mang lại phước lành và bình an."
    },

    # --- Vật phẩm treo cành (Ornament) ---
    {
        "code": "ornament_red_bauble",
        "name": "Quả Châu Đỏ Rực Rỡ 🔴",
        "category": ItemCategory.ORNAMENT,
        "price": 15,
        "festive_score": 8,
        "image_url": "bauble-red.png",
        "description": "Quả châu thủy tinh màu đỏ thắm truyền thống của mùa lễ hội."
    },
    {
        "code": "ornament_gold_bauble",
        "name": "Quả Châu Vàng Hoàng Gia 🟡",
        "category": ItemCategory.ORNAMENT,
        "price": 20,
        "festive_score": 10,
        "image_url": "bauble-gold.png",
        "description": "Quả châu phủ bụi kim tuyến óng ánh phản chiếu ánh đèn."
    },
    {
        "code": "ornament_jingle_bell",
        "name": "Chuông Bạc Ngân Vang 🔔",
        "category": ItemCategory.ORNAMENT,
        "price": 25,
        "festive_score": 12,
        "image_url": "bell-silver.png",
        "description": "Cặp chuông bạc đính nơ đỏ phát ra âm thanh Jingle Bells du dương."
    },
    {
        "code": "ornament_candy_cane",
        "name": "Kẹo Gậy Bạc Hà 🍬",
        "category": ItemCategory.ORNAMENT,
        "price": 15,
        "festive_score": 7,
        "image_url": "candy-cane.png",
        "description": "Cây kẹo que sọc đỏ trắng ngọt ngào hương thơm thảo mộc."
    },
    {
        "code": "ornament_gingerbread",
        "name": "Bánh Quy Người Gừng 🍪",
        "category": ItemCategory.ORNAMENT,
        "price": 20,
        "festive_score": 10,
        "image_url": "gingerbread.png",
        "description": "Chú người gừng mỉm cười nướng giòn rụm với đường kem tuyết."
    },
    {
        "code": "ornament_santa_sock",
        "name": "Vớ Giáng Sinh Chờ Quà 🧦",
        "category": ItemCategory.ORNAMENT,
        "price": 30,
        "festive_score": 15,
        "image_url": "sock-red.png",
        "description": "Chiếc tất nhung đỏ ấm áp để Ông già Noel ghé bỏ quà bí mật."
    },

    # --- Dây đèn (Light) ---
    {
        "code": "light_fairy_warm",
        "name": "Đèn Đom Đóm Vàng Ấm ✨",
        "category": ItemCategory.LIGHT,
        "price": 40,
        "festive_score": 20,
        "image_url": "light-warm.png",
        "description": "Dải đèn vàng lung linh xua tan giá lạnh đêm Giáng sinh."
    },
    {
        "code": "light_rainbow_flash",
        "name": "Đèn Nhấp Nháy 7 Màu 🌈",
        "category": ItemCategory.LIGHT,
        "price": 60,
        "festive_score": 30,
        "image_url": "light-rainbow.png",
        "description": "Hệ thống đèn LED nhiều màu với hiệu ứng chớp tắt vui nhộn."
    },

    # --- Hộp quà gốc cây (Gift) ---
    {
        "code": "gift_red_ribbon",
        "name": "Hộp Quà Nơ Đỏ 🎁",
        "category": ItemCategory.GIFT,
        "price": 35,
        "festive_score": 18,
        "image_url": "gift-red.png",
        "description": "Món quà tuyệt đẹp được thắt ruy băng satin đặt dưới gốc thông."
    },
    {
        "code": "gift_green_mystery",
        "name": "Hộp Quà Xanh Bí Ẩn 🟢",
        "category": ItemCategory.GIFT,
        "price": 50,
        "festive_score": 25,
        "image_url": "gift-green.png",
        "description": "Hộp quà trang trọng mang đến nhiều điều bất ngờ thú vị."
    }
]

def seed_items(db: Session):
    """Khởi tạo danh sách vật phẩm ban đầu nếu database chưa có"""
    count = db.query(Item).count()
    if count == 0:
        for item_data in INITIAL_ITEMS:
            item = Item(**item_data)
            db.add(item)
        db.commit()
        print(f"Đã khởi tạo thành công {len(INITIAL_ITEMS)} vật phẩm Giáng sinh vào Cửa hàng!")
    else:
        print(f"Database đã có {count} vật phẩm, bỏ qua bước seed.")
