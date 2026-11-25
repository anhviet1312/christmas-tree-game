# [BUG-001] Lỗi Native Binding Rolldown Khi Build Trên Windows Node v22.3.0

* **Ngày phát hiện:** 2026-11-25
* **Người xử lý:** Antigravity Agent
* **Mức độ nghiêm trọng:** Nghiêm trọng (Không thể build sản phẩm `npm run build`)
* **Trạng thái:** ✅ Đã giải quyết (Resolved)

---

### 1. Mô tả Triệu chứng (Symptom)
Khi chạy lệnh build dự án React:
```bash
npm run build
```
Quá trình build thất bại với thông báo lỗi:
```text
Error: Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
    at file:///D:/Code_Golang/ChrimasTree/frontend/node_modules/rolldown/dist/shared/binding-DXnWtC_4.mjs:599:34
    cause: Error: Cannot find module '@rolldown/binding-win32-x64-msvc'
```

---

### 2. Nguyên nhân Gốc rễ (Root Cause)
* Lệnh khởi tạo mặc định kéo về phiên bản thử nghiệm `vite@8.x` tích hợp engine đóng gói Rust mới là `rolldown`.
* Engine `rolldown` yêu cầu các file binary C++ native (`@rolldown/binding-win32-x64-msvc`). Tuy nhiên trên Windows với Node.js `v22.3.0`, trình quản lý gói `npm` bị lỗi không tự động tải các gói `optionalDependencies` nền tảng dẫn tới thiếu file `.node`.

---

### 3. Giải pháp Xử lý (Resolution)
Chuyển cấu hình `frontend/package.json` về phiên bản **Vite 5 (`vite@^5.4.11`)** — phiên bản cực kỳ ổn định, tương thích 100% với mọi phiên bản Node.js hiện đại mà không phụ thuộc vào native binary chưa ổn định của rolldown:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.460.0",
    "canvas-confetti": "^1.9.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",
    "vite": "^5.4.11",
    "tailwindcss": "^3.4.15",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

---

### 4. Kết quả Sau khi Sửa & Xác minh (Verification)
Chạy lại lệnh build:
```bash
npm run build
```
Kết quả biên dịch thành công xuất sắc:
```text
vite v5.4.21 building for production...
transforming...
✓ 1589 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.00 kB │ gzip:  0.57 kB
dist/assets/index-B-tprUIR.css   34.34 kB │ gzip:  6.54 kB
dist/assets/index-tEvbX4dk.js   201.95 kB │ gzip: 61.77 kB
✓ built in 2.94s
```
Toàn bộ mã nguồn React được tối ưu và đóng gói vào `frontend/dist`.
