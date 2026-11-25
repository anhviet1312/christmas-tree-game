from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, UserResource, Item, UserInventory
from app.schemas import ItemOut, BuyItemRequest, InventoryOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/shop", tags=["Shop & Inventory"])

@router.get("/items", response_model=List[ItemOut])
def list_shop_items(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả vật phẩm trang trí có sẵn trong cửa hàng Giáng Sinh"""
    items = db.query(Item).order_by(Item.category, Item.price).all()
    return items

@router.post("/buy")
def buy_item(
    request: BuyItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mua vật phẩm từ cửa hàng bằng Bông tuyết"""
    # 1. Kiểm tra vật phẩm
    item = db.query(Item).filter(Item.id == request.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy vật phẩm này trong cửa hàng")

    # 2. Kiểm tra số dư tài nguyên
    total_cost = item.price * request.quantity
    resource = db.query(UserResource).filter(UserResource.user_id == current_user.id).first()
    if not resource or resource.snowflakes < total_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bạn không đủ Bông tuyết để mua {request.quantity}x {item.name}! Cần {total_cost} ❄️ nhưng hiện chỉ có {resource.snowflakes if resource else 0} ❄️."
        )

    # 3. Trừ tài nguyên
    resource.snowflakes -= total_cost

    # 4. Thêm vào túi đồ (UserInventory)
    inventory_item = db.query(UserInventory).filter(
        UserInventory.user_id == current_user.id,
        UserInventory.item_id == item.id
    ).first()

    if inventory_item:
        inventory_item.quantity += request.quantity
    else:
        inventory_item = UserInventory(
            user_id=current_user.id,
            item_id=item.id,
            quantity=request.quantity
        )
        db.add(inventory_item)

    db.commit()
    db.refresh(resource)
    db.refresh(inventory_item)

    return {
        "message": f"Mua thành công {request.quantity}x {item.name}!",
        "snowflakes_spent": total_cost,
        "remaining_snowflakes": resource.snowflakes,
        "inventory_quantity": inventory_item.quantity
    }

@router.get("/inventory", response_model=List[InventoryOut])
def get_user_inventory(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách vật phẩm người chơi đang sở hữu trong túi đồ"""
    inventory = db.query(UserInventory).filter(
        UserInventory.user_id == current_user.id,
        UserInventory.quantity > 0
    ).all()
    return inventory
