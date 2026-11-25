from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, UserResource, Tree
from app.schemas import UserRegister, UserLogin, Token, UserOut
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.config import STARTER_SNOWFLAKES

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # 1. Kiểm tra username đã tồn tại chưa
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập này đã được sử dụng!"
        )

    # 2. Tạo tài khoản User
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        password_hash=hashed_pwd,
        display_name=user_data.display_name or user_data.username
    )
    db.add(new_user)
    db.flush()  # Lấy ID của new_user

    # 3. Cấp tài nguyên khởi đầu (Starter Kit: 100 bông tuyết)
    initial_resource = UserResource(
        user_id=new_user.id,
        snowflakes=STARTER_SNOWFLAKES,
        last_daily_login=None,
        login_streak=0,
        # Đặt thời điểm claim lùi lại 30 phút để người mới có thể claim ngay lần đầu nếu muốn
        last_claimed_at=datetime.utcnow() - timedelta(minutes=31)
    )
    db.add(initial_resource)

    # 4. Khởi tạo cây thông Noel cho người chơi (Mặc định mở 2 tầng)
    initial_tree = Tree(
        user_id=new_user.id,
        unlocked_layers=2
    )
    db.add(initial_tree)

    db.commit()
    db.refresh(new_user)

    # 5. Sinh JWT Token
    access_token = create_access_token(data={"sub": new_user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác!"
        )

    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Endpoint hỗ trợ Swagger Docs OAuth2 Password form
@router.post("/token", response_model=Token, include_in_schema=False)
def login_for_docs(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác!"
        )

    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
