import sys
import os

# Đảm bảo console trên Windows (Git Bash, CMD, PowerShell) xuất được UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("🎄 Đang khởi chạy Server Game Cây Thông Noel...")
    print("👉 Mở trình duyệt chơi game tại:       http://localhost:8000")
    print("👉 Tài liệu Swagger API tại:           http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
