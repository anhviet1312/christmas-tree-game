from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, UserResource, Tree, TreeSlot
from app.schemas import AdminUserOut, BuffResourceRequest, SetRoleRequest
from app.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Management"])

@router.get("/users", response_model=List[AdminUserOut])
def get_all_users(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Lấy danh sách toàn bộ người chơi kèm thông tin tài nguyên và cây thông"""
    users = db.query(User).order_by(User.id.desc()).all()
    results = []

    for u in users:
        snowflakes = u.resource.snowflakes if u.resource else 0
        login_streak = u.resource.login_streak if u.resource else 0
        unlocked_layers = u.tree.unlocked_layers if u.tree else 2

        # Tính điểm Festive Score
        total_festive = 0
        if u.tree:
            slots = db.query(TreeSlot).filter(TreeSlot.tree_id == u.tree.id, TreeSlot.item_id.isnot(None)).all()
            for s in slots:
                if s.item:
                    total_festive += s.item.festive_score

        results.append(AdminUserOut(
            id=u.id,
            username=u.username,
            display_name=u.display_name,
            role=u.role,
            created_at=u.created_at,
            snowflakes=snowflakes,
            unlocked_layers=unlocked_layers,
            total_festive_score=total_festive,
            login_streak=login_streak
        ))

    return results

@router.post("/users/{user_id}/buff")
def buff_user_resource(
    user_id: int,
    request: BuffResourceRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Thêm (hoặc bớt) Bông Tuyết cho một người chơi cụ thể"""
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người chơi này!")

    resource = db.query(UserResource).filter(UserResource.user_id == user_id).first()
    if not resource:
        resource = UserResource(user_id=user_id, snowflakes=100)
        db.add(resource)

    old_balance = resource.snowflakes
    resource.snowflakes += request.amount
    # Không để số âm
    if resource.snowflakes < 0:
        resource.snowflakes = 0

    db.commit()
    db.refresh(resource)

    sign = "+" if request.amount >= 0 else ""
    return {
        "message": f"Admin đã buff {sign}{request.amount:,} ❄️ cho người chơi [{target_user.username}]! Lý do: {request.reason}",
        "user_id": target_user.id,
        "username": target_user.username,
        "old_balance": old_balance,
        "new_balance": resource.snowflakes
    }

@router.post("/users/{user_id}/set-role")
def set_user_role(
    user_id: int,
    request: SetRoleRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Thay đổi quyền hạn (role) của người chơi: 'admin' hoặc 'user'"""
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người chơi này!")

    # Chặn tự giáng quyền của chính mình nếu là admin duy nhất
    if target_user.id == current_admin.id and request.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn không thể tự hạ quyền Admin của chính mình!"
        )

    target_user.role = request.role
    db.commit()

    return {
        "message": f"Đã cập nhật quyền hạn của [{target_user.username}] thành '{request.role}'!",
        "user_id": target_user.id,
        "username": target_user.username,
        "new_role": target_user.role
    }
