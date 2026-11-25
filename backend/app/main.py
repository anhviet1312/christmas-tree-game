import os
import sys

# Đảm bảo console trên Windows xuất được UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.database import engine, Base, SessionLocal
from app.seed import seed_items
from app.routers import auth, resources, shop, tree

# Đảm bảo bảng được tạo ngay cả khi import độc lập
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo bảng CSDL khi server bắt đầu chạy
    Base.metadata.create_all(bind=engine)
    
    # Khởi tạo vật phẩm cửa hàng ban đầu
    db = SessionLocal()
    try:
        seed_items(db)
    finally:
        db.close()
    
    yield

app = FastAPI(
    title="🎄 Christmas Tree Game API",
    description="Backend API cho trò chơi thu thập tài nguyên và trang trí Cây Thông Noel dịp Giáng Sinh 2026",
    version="1.0.0",
    lifespan=lifespan
)

# Cấu hình CORS để Frontend (Vercel, localhost) gọi được API dễ dàng
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if frontend_url else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router API
app.include_router(auth.router)
app.include_router(resources.router)
app.include_router(shop.router)
app.include_router(tree.router)

@app.get("/api/health", tags=["Health Check"])
def health_check():
    return {
        "message": "Ho Ho Ho! 🎅 Máy chủ Game Cây Thông Noel hoạt động bình thường!",
        "version": "1.0.0",
        "status": "online"
    }

# Tự động phục vụ giao diện React đã build nếu thư mục frontend/dist tồn tại
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
else:
    @app.get("/", tags=["Health Check"])
    def root():
        return {
            "message": "Ho Ho Ho! 🎅 Chào mừng bạn đến với Game Cây Thông Giáng Sinh API!",
            "docs_url": "/docs",
            "status": "online"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
