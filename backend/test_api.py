import sys
import os
import json
import time

# Đảm bảo console trên Windows xuất được UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Đảm bảo import được module app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def run_all_tests():
    print("=" * 60)
    print("🎄 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN BACKEND GAME CÂY THÔNG NOEL 🎄")
    print("=" * 60)

    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("✅ 1. Health check: OK")

        # 2. Đăng ký tài khoản mới
        test_user = f"player_{int(time.time())}"
        register_payload = {
            "username": test_user,
            "password": "password123",
            "display_name": "Người Tuyết Vui Vẻ ⛄️"
        }
        res = client.post("/api/auth/register", json=register_payload)
        assert res.status_code == 201, f"Register failed: {res.text}"
        auth_data = res.json()
        token = auth_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"✅ 2. Đăng ký tài khoản [{test_user}]: OK, nhận Token!")

        # 3. Kiểm tra tài nguyên khởi đầu (Starter 100 bông tuyết)
        res = client.get("/api/resources", headers=headers)
        assert res.status_code == 200, f"Get resources failed: {res.text}"
        res_data = res.json()
        assert res_data["snowflakes"] == 100, f"Starter snowflakes should be 100, got {res_data['snowflakes']}"
        print(f"✅ 3. Tài nguyên khởi đầu (Starter kit): OK, có đúng {res_data['snowflakes']} ❄️")

        # 4. Kiểm tra Cây thông ban đầu (2 tầng mở khóa)
        res = client.get("/api/tree", headers=headers)
        assert res.status_code == 200, f"Get tree failed: {res.text}"
        tree_data = res.json()
        assert tree_data["unlocked_layers"] == 2, f"Expected 2 layers unlocked, got {tree_data['unlocked_layers']}"
        print(f"✅ 4. Cây thông ban đầu: OK, {tree_data['unlocked_layers']} tầng mở sẵn")

        # 5. Claim tài nguyên chu kỳ lần đầu (hợp lệ vì đăng ký đã set lùi 30m)
        res = client.post("/api/resources/claim", headers=headers)
        assert res.status_code == 200, f"Claim failed: {res.text}"
        claim_data = res.json()
        print(f"✅ 5. Thu hoạch chu kỳ (Claim 30m): OK -> {claim_data['message']}")

        # 6. Thử claim ngay lập tức lần thứ 2 -> Phải bị chặn (Cooldown 30m)
        res = client.post("/api/resources/claim", headers=headers)
        assert res.status_code == 400, f"Expected cooldown 400 error, got {res.status_code}"
        print(f"✅ 6. Kiểm tra chống spam Cooldown: OK (Bị chặn đúng: {res.json()['detail']})")

        # 7. Điểm danh hàng ngày (Daily Check-in)
        res = client.post("/api/resources/daily-checkin", headers=headers)
        assert res.status_code == 200, f"Daily checkin failed: {res.text}"
        daily_data = res.json()
        print(f"✅ 7. Điểm danh nhận thưởng ngày: OK -> {daily_data['message']}")

        # 8. Thử điểm danh lần 2 trong cùng một ngày -> Phải bị chặn
        res = client.post("/api/resources/daily-checkin", headers=headers)
        assert res.status_code == 400, f"Expected daily limit 400 error, got {res.status_code}"
        print(f"✅ 8. Kiểm tra chống điểm danh 2 lần/ngày: OK (Bị chặn đúng: {res.json()['detail']})")

        # 9. Danh sách vật phẩm trong Cửa hàng
        res = client.get("/api/shop/items")
        assert res.status_code == 200, f"Get shop items failed: {res.text}"
        items = res.json()
        assert len(items) >= 10, f"Expected at least 10 items in shop, got {len(items)}"
        topper = next(i for i in items if i["code"] == "topper_gold_star")
        bauble = next(i for i in items if i["code"] == "ornament_red_bauble")
        print(f"✅ 9. Cửa hàng vật phẩm: OK, tìm thấy {len(items)} món đồ trang trí")

        # 10. Mua vật phẩm từ Cửa hàng
        # Mua Ngôi sao vàng (50 ❄️)
        res = client.post("/api/shop/buy", headers=headers, json={"item_id": topper["id"], "quantity": 1})
        assert res.status_code == 200, f"Buy topper failed: {res.text}"
        # Mua Quả cầu đỏ (15 ❄️)
        res = client.post("/api/shop/buy", headers=headers, json={"item_id": bauble["id"], "quantity": 1})
        assert res.status_code == 200, f"Buy bauble failed: {res.text}"
        print("✅ 10. Mua sắm vật phẩm (Ngôi sao vàng + Quả cầu đỏ): OK, đã trừ tuyết và cộng vào túi đồ")

        # 11. Kiểm tra Túi đồ cá nhân (Inventory)
        res = client.get("/api/shop/inventory", headers=headers)
        assert res.status_code == 200, f"Get inventory failed: {res.text}"
        inv_data = res.json()
        assert len(inv_data) == 2, f"Expected 2 items in inventory, got {len(inv_data)}"
        print(f"✅ 11. Kiểm tra túi đồ: OK, đang có {len(inv_data)} loại món đồ")

        # 12. Gắn Ngôi sao vàng lên Đỉnh cây (Layer 0, Slot 0)
        res = client.post("/api/tree/slot/equip", headers=headers, json={
            "layer_index": 0,
            "slot_index": 0,
            "item_id": topper["id"]
        })
        assert res.status_code == 200, f"Equip topper failed: {res.text}"
        print(f"✅ 12. Gắn Ngôi sao vàng lên Đỉnh: OK -> {res.json()['message']}")

        # 13. Kiểm tra logic chặn đặt sai vị trí: Thử đặt Quả cầu lên Đỉnh cây -> Phải báo lỗi
        res = client.post("/api/tree/slot/equip", headers=headers, json={
            "layer_index": 0,
            "slot_index": 0,
            "item_id": bauble["id"]
        })
        assert res.status_code == 400, "Should reject non-topper on layer 0"
        print("✅ 13. Kiểm tra ràng buộc slot: OK (Không cho gắn quả cầu lên đỉnh cây)")

        # 14. Gắn Quả cầu đỏ lên Tầng 1, Slot 0
        res = client.post("/api/tree/slot/equip", headers=headers, json={
            "layer_index": 1,
            "slot_index": 0,
            "item_id": bauble["id"]
        })
        assert res.status_code == 200, f"Equip bauble failed: {res.text}"
        print(f"✅ 14. Gắn Quả cầu đỏ lên Tầng 1, Slot 0: OK -> {res.json()['message']}")

        # 15. Kiểm tra trạng thái cây thông sau khi trang trí
        res = client.get("/api/tree", headers=headers)
        assert res.status_code == 200
        tree_data = res.json()
        expected_score = topper["festive_score"] + bauble["festive_score"]
        assert tree_data["total_festive_score"] == expected_score, f"Expected festive score {expected_score}, got {tree_data['total_festive_score']}"
        print(f"✅ 15. Kiểm tra cây thông: OK, Điểm Giáng sinh đạt {tree_data['total_festive_score']} điểm!")

        # 16. Ghé thăm cây thông của người khác qua Username công khai
        res = client.get(f"/api/tree/public/{test_user}")
        assert res.status_code == 200, f"Public tree failed: {res.text}"
        pub_tree = res.json()
        assert pub_tree["owner_name"] == "Người Tuyết Vui Vẻ ⛄️"
        print(f"✅ 16. Ghé thăm cây thông bạn bè (Public URL): OK, chủ sở hữu [{pub_tree['owner_name']}]")

        # 17. Gỡ Quả cầu đỏ khỏi Tầng 1 Slot 0 -> Trả lại vào túi đồ
        res = client.post("/api/tree/slot/unequip", headers=headers, json={
            "layer_index": 1,
            "slot_index": 0
        })
        assert res.status_code == 200, f"Unequip failed: {res.text}"
        print(f"✅ 17. Gỡ trang trí trả về túi: OK -> {res.json()['message']}")

        # 18. Nâng cấp mở khóa thêm tầng mới (Layer 2)
        res = client.post("/api/tree/upgrade-layer", headers=headers)
        assert res.status_code == 200, f"Upgrade layer failed: {res.text}"
        upgrade_data = res.json()
        print(f"✅ 18. Mở khóa tầng cây tiếp theo: OK -> {upgrade_data['message']}")

        # 19. Đăng ký tài khoản Admin chuyên biệt
        admin_user = f"admin_{int(time.time())}"
        # Set username chứa 'admin' để tự nhận role 'admin'
        res = client.post("/api/auth/register", json={
            "username": admin_user,
            "password": "adminpassword123",
            "display_name": "Quản Trị Viên Giáng Sinh 🛡️"
        })
        assert res.status_code == 201
        admin_token = res.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        # Tự gán quyền admin cho admin_user để test
        from app.database import SessionLocal
        from app.models import User
        db = SessionLocal()
        u = db.query(User).filter(User.username == admin_user).first()
        u.role = "admin"
        db.commit()
        db.close()
        print(f"✅ 19. Tạo tài khoản Admin [{admin_user}]: OK")

        # 20. Chặn người dùng thường truy cập API Admin
        res = client.get("/api/admin/users", headers=headers)
        assert res.status_code == 403, "User thường không được truy cập API Admin"
        print("✅ 20. Chặn User thường vào API Admin: OK (403 Forbidden)")

        # 21. Admin lấy danh sách toàn bộ User
        res = client.get("/api/admin/users", headers=admin_headers)
        assert res.status_code == 200
        admin_users_list = res.json()
        assert len(admin_users_list) >= 2
        print(f"✅ 21. Admin lấy danh sách Users: OK, tìm thấy {len(admin_users_list)} người chơi")

        # 22. Admin Buff tài nguyên cho người chơi thường (+500 bông tuyết)
        target_uid = auth_data["user"]["id"]
        res = client.post(f"/api/admin/users/{target_uid}/buff", headers=admin_headers, json={
            "amount": 500,
            "reason": "Thưởng Giáng sinh từ Admin"
        })
        assert res.status_code == 200
        buff_result = res.json()
        print(f"✅ 22. Admin buff tài nguyên: OK -> {buff_result['message']}")

        # 23. Kiểm tra số dư người chơi sau khi được buff
        res = client.get("/api/resources", headers=headers)
        assert res.status_code == 200
        new_balance = res.json()["snowflakes"]
        assert new_balance == buff_result["new_balance"]
        print(f"✅ 23. Kiểm tra số dư người chơi sau Buff: OK, đạt {new_balance} ❄️")

        # 24. Admin thay đổi Role của người chơi
        res = client.post(f"/api/admin/users/{target_uid}/set-role", headers=admin_headers, json={
            "role": "admin"
        })
        assert res.status_code == 200
        print(f"✅ 24. Admin phong quyền Admin cho User: OK -> {res.json()['message']}")

    print("=" * 60)
    print("🎉 TẤT CẢ 24/24 BƯỚC KIỂM THỬ BACKEND ĐỀU THÀNH CÔNG RỰC RỠ! 🎉")
    print("=" * 60)

if __name__ == "__main__":
    run_all_tests()
