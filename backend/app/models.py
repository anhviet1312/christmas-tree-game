from datetime import datetime
import enum
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.database import Base

class ItemCategory(str, enum.Enum):
    TOPPER = "TOPPER"       # Ngôi sao / Thiên thần đỉnh cây
    ORNAMENT = "ORNAMENT"   # Quả cầu, chuông, tất, bánh gừng
    LIGHT = "LIGHT"         # Dây đèn trang trí
    GIFT = "GIFT"           # Hộp quà dưới gốc

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Quan hệ 1 - 1
    resource = relationship("UserResource", back_populates="user", uselist=False, cascade="all, delete-orphan")
    tree = relationship("Tree", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    # Quan hệ 1 - N
    inventory = relationship("UserInventory", back_populates="user", cascade="all, delete-orphan")

class UserResource(Base):
    __tablename__ = "user_resources"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    snowflakes = Column(BigInteger, default=100) # Tài nguyên khởi đầu
    last_daily_login = Column(DateTime, nullable=True)
    login_streak = Column(Integer, default=0)
    last_claimed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resource")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(SqlEnum(ItemCategory), nullable=False)
    price = Column(BigInteger, default=10, nullable=False)
    festive_score = Column(Integer, default=5, nullable=False)
    image_url = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)

class UserInventory(Base):
    __tablename__ = "user_inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="inventory")
    item = relationship("Item")

class Tree(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    unlocked_layers = Column(Integer, default=2) # Mặc định mở 2 tầng (Tầng 0 & Tầng 1)

    user = relationship("User", back_populates="tree")
    slots = relationship("TreeSlot", back_populates="tree", cascade="all, delete-orphan")

class TreeSlot(Base):
    __tablename__ = "tree_slots"

    id = Column(Integer, primary_key=True, index=True)
    tree_id = Column(Integer, ForeignKey("trees.id"), index=True, nullable=False)
    layer_index = Column(Integer, nullable=False) # 0: Đỉnh, 1: Tầng 1, 2: Tầng 2, 3: Tầng 3
    slot_index = Column(Integer, nullable=False)  # 0, 1, 2...
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tree = relationship("Tree", back_populates="slots")
    item = relationship("Item")
