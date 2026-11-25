from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.models import User, UserResource, Tree, TreeSlot, Item, UserInventory, ItemCategory
from app.schemas import (
    TreeOut, LayerOut, TreeSlotOut, EquipSlotRequest,
    UnequipSlotRequest, UpgradeLayerResponse
)
from app.auth import get_current_user
from app.config import LAYER_SLOT_CAPACITIES, LAYER_UNLOCK_COSTS

router = APIRouter(prefix="/api/tree", tags=["Christmas Tree & Decoration"])

LAYER_NAMES = {
    0: "Đỉnh cây (Topper)",
    1: "Tầng 1 (Tầng trên)",
    2: "Tầng 2 (Tầng giữa)",
    3: "Tầng 3 (Tầng đáy & Gốc cây)"
}

def build_tree_response(tree: Tree, user: User, db: Session) -> TreeOut:
    """Helper xây dựng cấu trúc chi tiết các tầng và slot của cây thông"""
    # Lấy tất cả slot đã được lưu trong DB
    db_slots = db.query(TreeSlot).filter(TreeSlot.tree_id == tree.id).all()
    slots_map: Dict[tuple, TreeSlot] = {(s.layer_index, s.slot_index): s for s in db_slots}

    total_festive_score = 0
    layers_data: List[LayerOut] = []

    # Duyệt qua các tầng tối đa được hỗ trợ (0 đến 3)
    for layer_idx, max_slots in LAYER_SLOT_CAPACITIES.items():
        is_unlocked = layer_idx < tree.unlocked_layers
        unlock_cost = LAYER_UNLOCK_COSTS.get(layer_idx, None) if not is_unlocked else None

        slots_in_layer: List[TreeSlotOut] = []
        for slot_idx in range(max_slots):
            slot = slots_map.get((layer_idx, slot_idx))
            if slot and slot.item_id and slot.item:
                total_festive_score += slot.item.festive_score
                slots_in_layer.append(TreeSlotOut(
                    layer_index=layer_idx,
                    slot_index=slot_idx,
                    item_id=slot.item_id,
                    item=slot.item
                ))
            else:
                slots_in_layer.append(TreeSlotOut(
                    layer_index=layer_idx,
                    slot_index=slot_idx,
                    item_id=None,
                    item=None
                ))

        layers_data.append(LayerOut(
            layer_index=layer_idx,
            layer_name=LAYER_NAMES.get(layer_idx, f"Tầng {layer_idx}"),
            max_slots=max_slots,
            is_unlocked=is_unlocked,
            unlock_cost=unlock_cost,
            slots=slots_in_layer
        ))

    return TreeOut(
        id=tree.id,
        user_id=tree.user_id,
        owner_name=user.display_name or user.username,
        unlocked_layers=tree.unlocked_layers,
        total_festive_score=total_festive_score,
        layers=layers_data
    )

@router.get("", response_model=TreeOut)
def get_my_tree(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy thông tin toàn bộ cây thông của người chơi hiện tại"""
    tree = db.query(Tree).filter(Tree.user_id == current_user.id).first()
    if not tree:
        # Tự động tạo nếu chưa có
        tree = Tree(user_id=current_user.id, unlocked_layers=2)
        db.add(tree)
        db.commit()
        db.refresh(tree)

    return build_tree_response(tree, current_user, db)

@router.get("/public/{username}", response_model=TreeOut)
def get_public_tree(username: str, db: Session = Depends(get_db)):
    """Xem cây thông của một người chơi bất kỳ để ghé thăm / chia sẻ"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người chơi này")

    tree = db.query(Tree).filter(Tree.user_id == user.id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Người chơi này chưa dựng cây thông")

    return build_tree_response(tree, user, db)

@router.post("/upgrade-layer", response_model=UpgradeLayerResponse)
def upgrade_tree_layer(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mở khóa tầng tiếp theo cho cây thông"""
    tree = db.query(Tree).filter(Tree.user_id == current_user.id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây thông")

    next_layer = tree.unlocked_layers
    if next_layer not in LAYER_UNLOCK_COSTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cây thông của bạn đã mở khóa tất cả các tầng tối đa!"
        )

    cost = LAYER_UNLOCK_COSTS[next_layer]
    resource = db.query(UserResource).filter(UserResource.user_id == current_user.id).first()
    if not resource or resource.snowflakes < cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cần {cost} Bông tuyết để mở khóa tầng mới! Bạn hiện có {resource.snowflakes if resource else 0} ❄️."
        )

    # Trừ tài nguyên & Mở tầng
    resource.snowflakes -= cost
    tree.unlocked_layers += 1
    db.commit()

    return {
        "message": f"Chúc mừng! Bạn đã mở khóa thành công {LAYER_NAMES.get(next_layer, f'Tầng {next_layer}')}!",
        "unlocked_layer": next_layer,
        "remaining_snowflakes": resource.snowflakes
    }

@router.post("/slot/equip")
def equip_slot_item(
    request: EquipSlotRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Gắn vật phẩm từ túi đồ lên một slot trang trí trên cây"""
    tree = db.query(Tree).filter(Tree.user_id == current_user.id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây thông")

    # 1. Kiểm tra tầng đã mở khóa chưa
    if request.layer_index >= tree.unlocked_layers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tầng này chưa được mở khóa! Hãy dùng Bông tuyết để nâng cấp tầng trước."
        )

    # 2. Kiểm tra slot_index có hợp lệ trong tầng không
    max_slots = LAYER_SLOT_CAPACITIES.get(request.layer_index, 0)
    if request.slot_index < 0 or request.slot_index >= max_slots:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vị trí slot không hợp lệ cho tầng này (chỉ từ 0 đến {max_slots - 1})"
        )

    # 3. Kiểm tra vật phẩm trong túi đồ
    inv_item = db.query(UserInventory).filter(
        UserInventory.user_id == current_user.id,
        UserInventory.item_id == request.item_id,
        UserInventory.quantity > 0
    ).first()
    if not inv_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn không có vật phẩm này trong túi đồ!"
        )

    # 4. Kiểm tra quy tắc vị trí trang trí
    item = db.query(Item).filter(Item.id == request.item_id).first()
    if request.layer_index == 0:
        if item.category != ItemCategory.TOPPER:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đỉnh cây chỉ có thể gắn Ngôi sao hoặc vật phẩm loại Topper!"
            )
    else:
        if item.category == ItemCategory.TOPPER:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ngôi sao đỉnh cây chỉ có thể đặt ở tầng Đỉnh!"
            )

    # 5. Lấy hoặc tạo slot
    slot = db.query(TreeSlot).filter(
        TreeSlot.tree_id == tree.id,
        TreeSlot.layer_index == request.layer_index,
        TreeSlot.slot_index == request.slot_index
    ).first()

    # Nếu slot đã có đồ, trả đồ cũ lại túi
    if slot and slot.item_id:
        old_inv = db.query(UserInventory).filter(
            UserInventory.user_id == current_user.id,
            UserInventory.item_id == slot.item_id
        ).first()
        if old_inv:
            old_inv.quantity += 1
        else:
            db.add(UserInventory(user_id=current_user.id, item_id=slot.item_id, quantity=1))

    # Giảm 1 món mới khỏi túi
    inv_item.quantity -= 1

    if slot:
        slot.item_id = request.item_id
    else:
        slot = TreeSlot(
            tree_id=tree.id,
            layer_index=request.layer_index,
            slot_index=request.slot_index,
            item_id=request.item_id
        )
        db.add(slot)

    db.commit()

    return {
        "message": f"Đã trang trí {item.name} lên {LAYER_NAMES.get(request.layer_index)} (vị trí {request.slot_index + 1})!",
        "item_name": item.name,
        "festive_score": item.festive_score
    }

@router.post("/slot/unequip")
def unequip_slot_item(
    request: UnequipSlotRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Gỡ vật phẩm khỏi slot và cất lại vào túi đồ"""
    tree = db.query(Tree).filter(Tree.user_id == current_user.id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Không tìm thấy cây thông")

    slot = db.query(TreeSlot).filter(
        TreeSlot.tree_id == tree.id,
        TreeSlot.layer_index == request.layer_index,
        TreeSlot.slot_index == request.slot_index
    ).first()

    if not slot or not slot.item_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vị trí slot này đang trống, không có gì để gỡ!"
        )

    unequipped_item_id = slot.item_id
    item = db.query(Item).filter(Item.id == unequipped_item_id).first()

    # Trả lại vào túi
    inv_item = db.query(UserInventory).filter(
        UserInventory.user_id == current_user.id,
        UserInventory.item_id == unequipped_item_id
    ).first()
    if inv_item:
        inv_item.quantity += 1
    else:
        db.add(UserInventory(user_id=current_user.id, item_id=unequipped_item_id, quantity=1))

    # Xóa khỏi slot
    slot.item_id = None
    db.commit()

    return {
        "message": f"Đã gỡ {item.name if item else 'vật phẩm'} và cất lại vào túi đồ!",
        "layer_index": request.layer_index,
        "slot_index": request.slot_index
    }
