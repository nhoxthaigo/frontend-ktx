# Hệ thống Quản lý Tiền Điện - Frontend

## Tổng quan

Frontend cho hệ thống quản lý tiền điện ký túc xá sinh viên được phát triển với React + Vite, bao gồm các chức năng quản lý đơn giá điện, hóa đơn phòng, hóa đơn sinh viên và thống kê.

## Cấu trúc Components

### Admin Components

- `ElectricManager.jsx` - Component chính quản lý tiền điện cho admin
- `BulkElectricityActions.jsx` - Thao tác hàng loạt
- `ElectricityStatisticsCards.jsx` - Hiển thị thống kê
- `ElectricBillPrintView.jsx` - In hóa đơn

### User Components

- `StudentElectricBills.jsx` - Xem hóa đơn tiền điện cho sinh viên

## Chức năng chính

### Admin

1. **Quản lý Đơn giá Điện**

   - Tạo, xem danh sách đơn giá điện
   - Thiết lập thời gian áp dụng đơn giá

2. **Quản lý Hóa đơn Phòng**

   - Tạo hóa đơn tiền điện cho phòng
   - Cập nhật, xóa hóa đơn (chỉ khi draft)
   - Tính tiền điện cho sinh viên trong phòng
   - Hoàn thiện hóa đơn
   - Tạo hóa đơn hàng loạt từ CSV
   - Xuất báo cáo Excel

3. **Quản lý Hóa đơn Sinh viên**

   - Xem danh sách hóa đơn sinh viên
   - Xử lý thanh toán
   - Thanh toán hàng loạt

4. **Thống kê**
   - Tổng quan số liệu
   - Thống kê theo tháng
   - Tỷ lệ thanh toán

### Sinh viên

1. **Xem Hóa đơn**
   - Danh sách hóa đơn tiền điện
   - Chi tiết hóa đơn
   - Lọc theo trạng thái, tháng, năm
   - Thống kê tổng quan cá nhân

## API Endpoints

### Đơn giá điện

- `GET /api/electricity/rates` - Lấy danh sách đơn giá
- `POST /api/electricity/rates` - Tạo đơn giá mới

### Hóa đơn phòng

- `GET /api/electricity/room-bills` - Lấy danh sách hóa đơn phòng
- `POST /api/electricity/room-bills` - Tạo hóa đơn phòng
- `GET /api/electricity/room-bills/:id` - Chi tiết hóa đơn
- `PUT /api/electricity/room-bills/:id` - Cập nhật hóa đơn
- `DELETE /api/electricity/room-bills/:id` - Xóa hóa đơn
- `POST /api/electricity/room-bills/:id/calculate` - Tính tiền sinh viên
- `PUT /api/electricity/room-bills/:id/finalize` - Hoàn thiện hóa đơn
- `POST /api/electricity/bulk-create` - Tạo hàng loạt
- `PUT /api/electricity/bulk/finalize` - Hoàn thiện hàng loạt

### Hóa đơn sinh viên

- `GET /api/electricity/student-bills` - Lấy danh sách hóa đơn sinh viên
- `PUT /api/electricity/student-bills/:id/payment` - Thanh toán
- `POST /api/electricity/bulk/payments` - Thanh toán hàng loạt

### Thống kê

- `GET /api/electricity/statistics` - Thống kê cơ bản
- `GET /api/electricity/advanced-statistics` - Thống kê nâng cao

### Export

- `GET /api/electricity/export/excel` - Xuất Excel
- `GET /api/electricity/export/pdf` - Xuất PDF

## Quy trình sử dụng

### Cho Admin

1. **Thiết lập đơn giá điện**

   - Truy cập tab "Đơn giá điện"
   - Thêm đơn giá mới với thời gian áp dụng

2. **Tạo hóa đơn phòng**

   - Tab "Hóa đơn phòng" > "Tạo hóa đơn"
   - Nhập thông tin: phòng, kỳ hóa đơn, số điện cũ/mới
   - Hoặc sử dụng "Tạo hàng loạt" với file CSV

3. **Tính tiền cho sinh viên**

   - Sau khi tạo hóa đơn phòng, click "Tính tiền sinh viên"
   - Hệ thống tự động phân chia tiền điện cho từng sinh viên

4. **Hoàn thiện hóa đơn**

   - Click "Hoàn thiện" để không thể chỉnh sửa nữa

5. **Quản lý thanh toán**
   - Tab "Hóa đơn sinh viên" để xem và xử lý thanh toán

### Cho Sinh viên

1. **Xem hóa đơn**

   - Truy cập menu "Hóa đơn điện" trên header
   - Xem danh sách và chi tiết hóa đơn

2. **Theo dõi thanh toán**
   - Kiểm tra trạng thái thanh toán
   - Xem lịch sử thanh toán

## Tính năng nâng cao

### Tạo hóa đơn hàng loạt

- Format CSV: `id_phong,tu_ngay,den_ngay,so_dien_cu,so_dien_moi,ghi_chu`
- Tải template mẫu
- Xử lý lỗi từng dòng

### Thống kê và báo cáo

- Dashboard với các chỉ số tổng quan
- Biểu đồ theo tháng
- Xuất báo cáo Excel/PDF

### Notifications

- Toast notifications cho tất cả thao tác
- Thông báo lỗi chi tiết

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build for production
npm run build
```

## Dependencies chính

- React 19.1.0
- React Router DOM 7.6.0
- Axios 1.9.0
- React Hot Toast (notifications)
- React Icons
- Tailwind CSS

## Notes

- Component sử dụng Tailwind CSS cho styling
- Toast notifications được cấu hình global trong App.jsx
- API client được cấu hình trong `services/api/index.js`
- Authentication được xử lý trong `services/auth/`

## Roadmap

- [ ] Thêm biểu đồ cho thống kê
- [ ] Export PDF với template đẹp hơn
- [ ] Real-time notifications
- [ ] Tích hợp payment gateway
- [ ] Mobile responsive improvements
