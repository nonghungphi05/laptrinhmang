# Mioto Clone (Next.js + Prisma + SQLite)

Dự án mô phỏng trang thuê xe tương tự Mioto với các phần chính:
- Trang chủ hiển thị danh sách xe nổi bật, ô tìm kiếm
- Trang chi tiết xe với gallery và form đặt xe
- API: GET /api/cars, GET /api/cars/:id, POST /api/bookings (hỗ trợ JSON hoặc form-data)
- Prisma ORM với SQLite, script seed dữ liệu mẫu

## Yêu cầu
- Node.js >= 18

## Cài đặt
```bash
npm install
```

## Cấu hình DB
Sử dụng SQLite (mặc định): `.env` đã chứa:
```ini
DATABASE_URL="file:./dev.db"
```
Chạy migrate/generate (nếu cần):
```bash
npx prisma migrate dev
npx prisma generate
```
Seed dữ liệu mẫu:
```bash
npm run db:seed
```

## Chạy dev server
```bash
npm run dev
```
Mặc định tại `http://localhost:3000`.

## API
- GET `/api/cars` hỗ trợ query `q`, `city`, `minPrice`, `maxPrice`
- GET `/api/cars/:id`
- POST `/api/bookings` nhận `{ carId, startAt, endAt, guestName?, guestEmail?, userId? }`

## Ghi chú
- Ảnh dùng Next Image với remotePatterns cho `images.unsplash.com` (cấu hình trong `next.config.ts`).
- Đây là bản rút gọn tối thiểu để mô phỏng UX như Mioto: lưới thẻ xe, trang chi tiết, đặt xe.
- Có thể mở rộng: lọc nâng cao, lịch trống, xác thực, thanh toán, bản đồ, đa ngôn ngữ.
