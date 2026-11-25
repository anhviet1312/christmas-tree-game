from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, UserResource, Tree, TreeSlot, Item
from app.schemas import ResourceOut, ClaimResponse, DailyCheckinResponse
from app.auth import get_current_user
from app.config import (
    CLAIM_COOLDOWN_MINUTES,
    BASE_CLAIM_REWARD,
    DAILY_BASE_REWARD,
    DAILY_STREAK_BONUS
)

router = APIRouter(prefix="/api/resources", tags=["Resources & Economy"])

def calculate_tree_festive_bonus(user_id: int, db: Session) -> int:
    """Tính điểm không khí Giáng sinh từ các vật phẩm đang cắm trên cây để làm buff thưởng"""
    tree = db.query(Tree).filter(Tree.user_id == user_id).first()
    if not tree:
        return 0
    
    slots = db.query(TreeSlot).filter(TreeSlot.tree_id == tree.id, TreeSlot.item_id.isnot(None)).all()
    bonus = 0
    for slot in slots:
        if slot.item:
            bonus += slot.item.festive_score
    # Cứ mỗi 10 điểm festive score thì thưởng thêm 1 bông tuyết mỗi lần claim
    return bonus // 10

@router.get("", response_model=ResourceOut)
def get_user_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(UserResource).filter(UserResource.user_id == current_user.id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài nguyên người dùng")

    now = datetime.utcnow()
    diff = now - resource.last_claimed_at
    cooldown = timedelta(minutes=CLAIM_COOLDOWN_MINUTES)
    
    can_claim = diff >= cooldown
    remaining_seconds = 0
    next_claim_at = resource.last_claimed_at + cooldown
    if not can_claim:
        remaining_seconds = max(0, int((cooldown - diff).total_seconds()))

    # Kiểm tra điểm danh ngày
    can_daily = True
    if resource.last_daily_login:
        if resource.last_daily_login.date() == now.date():
            can_daily = False

    return {
        "snowflakes": resource.snowflakes,
        "can_claim": can_claim,
        "remaining_claim_seconds": remaining_seconds,
        "next_claim_at": next_claim_at,
        "can_daily_checkin": can_daily,
        "login_streak": resource.login_streak,
        "last_daily_login": resource.last_daily_login
    }

@router.post("/claim", response_model=ClaimResponse)
def claim_resource(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(UserResource).filter(UserResource.user_id == current_user.id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài nguyên người dùng")

    now = datetime.utcnow()
    diff = now - resource.last_claimed_at
    cooldown = timedelta(minutes=CLAIM_COOLDOWN_MINUTES)

    if diff < cooldown:
        remaining = int((cooldown - diff).total_seconds())
        minutes, seconds = divmod(remaining, 60)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tuyết chưa rơi đủ dày! Vui lòng chờ thêm {minutes} phút {seconds} giây để thu hoạch."
        )

    # Thưởng cơ bản + Thưởng buff từ cây thông
    festive_buff = calculate_tree_festive_bonus(current_user.id, db)
    total_reward = BASE_CLAIM_REWARD + festive_buff

    resource.snowflakes += total_reward
    resource.last_claimed_at = now
    db.commit()

    message = f"Thu hoạch thành công +{total_reward} Bông tuyết ❄️!"
    if festive_buff > 0:
        message += f" (Trong đó có +{festive_buff} tuyết từ hiệu ứng trang trí cây)"

    return {
        "message": message,
        "claimed_snowflakes": total_reward,
        "current_snowflakes": resource.snowflakes,
        "next_claim_at": now + cooldown
    }

@router.post("/daily-checkin", response_model=DailyCheckinResponse)
def daily_checkin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(UserResource).filter(UserResource.user_id == current_user.id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài nguyên")

    now = datetime.utcnow()

    # Kiểm tra xem hôm nay đã điểm danh chưa
    if resource.last_daily_login:
        if resource.last_daily_login.date() == now.date():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Hôm nay bạn đã điểm danh nhận quà Giáng sinh rồi! Hẹn gặp lại vào ngày mai nhé."
            )

        # Tính chuỗi liên tiếp (login streak)
        day_diff = (now.date() - resource.last_daily_login.date()).days
        if day_diff == 1:
            resource.login_streak += 1
        else:
            resource.login_streak = 1
    else:
        resource.login_streak = 1

    # Thưởng cơ bản + Thưởng streak
    streak_bonus = (resource.login_streak - 1) * DAILY_STREAK_BONUS
    reward = DAILY_BASE_REWARD + streak_bonus

    resource.snowflakes += reward
    resource.last_daily_login = now
    db.commit()

    return {
        "message": f"Điểm danh ngày thứ {resource.login_streak} thành công! Nhận được +{reward} Bông tuyết ❄️!",
        "claimed_snowflakes": reward,
        "current_snowflakes": resource.snowflakes,
        "login_streak": resource.login_streak
    }
