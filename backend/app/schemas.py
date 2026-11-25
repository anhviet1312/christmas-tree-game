from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models import ItemCategory

# --- Auth Schemas ---
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Tên đăng nhập (ít nhất 3 ký tự)")
    password: str = Field(..., min_length=6, max_length=100, description="Mật khẩu (ít nhất 6 ký tự)")
    display_name: Optional[str] = Field(None, max_length=100, description="Tên hiển thị người chơi")

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    username: str
    display_name: Optional[str] = None
    role: str = "user"
    created_at: datetime

    class Config:
        from_attributes = True

# --- Resource Schemas ---
class ResourceOut(BaseModel):
    snowflakes: int
    can_claim: bool
    remaining_claim_seconds: int
    next_claim_at: Optional[datetime] = None
    can_daily_checkin: bool
    login_streak: int
    last_daily_login: Optional[datetime] = None

class ClaimResponse(BaseModel):
    message: str
    claimed_snowflakes: int
    current_snowflakes: int
    next_claim_at: datetime

class DailyCheckinResponse(BaseModel):
    message: str
    claimed_snowflakes: int
    current_snowflakes: int
    login_streak: int

# --- Item & Shop Schemas ---
class ItemOut(BaseModel):
    id: int
    code: str
    name: str
    category: ItemCategory
    price: int
    festive_score: int
    image_url: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class BuyItemRequest(BaseModel):
    item_id: int
    quantity: int = Field(1, ge=1, le=10)

class InventoryOut(BaseModel):
    id: int
    item_id: int
    quantity: int
    item: ItemOut

    class Config:
        from_attributes = True

# --- Tree & Slot Schemas ---
class TreeSlotOut(BaseModel):
    layer_index: int
    slot_index: int
    item_id: Optional[int] = None
    item: Optional[ItemOut] = None

    class Config:
        from_attributes = True

class LayerOut(BaseModel):
    layer_index: int
    layer_name: str
    max_slots: int
    is_unlocked: bool
    unlock_cost: Optional[int] = None
    slots: List[TreeSlotOut]

class TreeOut(BaseModel):
    id: int
    user_id: int
    owner_name: str
    unlocked_layers: int
    total_festive_score: int
    layers: List[LayerOut]

class EquipSlotRequest(BaseModel):
    layer_index: int
    slot_index: int
    item_id: int

class UnequipSlotRequest(BaseModel):
    layer_index: int
    slot_index: int

class UpgradeLayerResponse(BaseModel):
    message: str
    unlocked_layer: int
    remaining_snowflakes: int

# --- Admin Schemas ---
class AdminUserOut(BaseModel):
    id: int
    username: str
    display_name: Optional[str] = None
    role: str = "user"
    created_at: datetime
    snowflakes: int
    unlocked_layers: int
    total_festive_score: int
    login_streak: int

class BuffResourceRequest(BaseModel):
    amount: int = Field(..., ge=-10000000, le=10000000, description="Số lượng tuyết cộng thêm (có thể âm để trừ)")
    reason: Optional[str] = Field("Admin quà tặng", description="Lý do buff")

class SetRoleRequest(BaseModel):
    role: str = Field(..., pattern="^(user|admin)$", description="Quyền mới: 'user' hoặc 'admin'")

