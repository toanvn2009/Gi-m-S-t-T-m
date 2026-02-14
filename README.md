# 🏠 Giám Sát Tổ Ấm — NHÀ QUÊ

**Giám Sát Tổ Ấm** là ứng dụng quản lý thi công công trình thông minh, được thiết kế riêng để giúp chủ đầu tư theo dõi mọi khía cạnh của quá trình xây dựng một cách minh bạch, trực quan và hiệu quả nhất. Hiện tại ứng dụng đang phục vụ cho dự án **NHÀ QUÊ** của chủ đầu tư **Đỗ Văn Toàn**.

---

## ✨ Tính năng chính

### 🏗️ Theo dõi Tiến độ Thông minh
- Lộ trình thi công chi tiết từng giai đoạn.
- Tính toán phần trăm hoàn thành tự động dựa trên các đầu mục công việc.
- Cảnh báo rủi ro về thời gian nếu tiến độ thực tế không đạt kỳ vọng.

### 🤖 Trí tuệ Nhân tạo (AI Studio)
- **Phân tích hình ảnh:** Tự động nhận diện các hạng mục đã hoàn thành thông qua ảnh chụp thực tế tại công trường.
- **Phân tích tiến độ:** AI đưa ra nhận xét, đánh giá và lời khuyên dựa trên dữ liệu tổng thể của dự án.
- **Trợ lý AI (Chatbot):** Giải đáp thắc mắc về kỹ thuật xây dựng, phong thủy, và tra cứu dữ liệu dự án nhanh chóng.

### 💸 Quản lý Chi phí & Ngân sách
- Theo dõi mọi hóa đơn, khoản chi từ vật tư đến nhân công.
- Biểu đồ phân bổ chi phí trực quan (Đã chi vs Còn lại).
- Quản lý ngân sách dự kiến 1.4 tỷ đồng cho dự án NHÀ QUÊ.
- **Tự động tính toán:** Chỉ cần nhập số lượng và đơn giá, hệ thống tự động tính tổng tiền.

### 👷 Quản lý Nhà thầu & Lỗi thi công
- Lưu trữ danh bạ nhà thầu, thợ xây, kiến trúc sư.
- Hệ thống đánh giá sao (rating) để kiểm soát chất lượng đội ngũ.
- **Danh sách Lỗi (Issue Tracker):** Ghi nhận các lỗi thi công cần sửa chữa hoặc các việc vặt phát sinh.
- **Kho lưu trữ tài liệu:** Upload và lưu trữ Hợp đồng, Bản vẽ, Giấy tờ quan trọng (hỗ trợ file PDF/Ảnh).

### 🔄 Sao lưu & Khôi phục Dữ liệu
- **Xuất dữ liệu (Export):** Tải về toàn bộ dữ liệu dự án dưới dạng file `.json`.
- **Nhập dữ liệu (Import):** Khôi phục dữ liệu từ file backup (hữu ích khi chuyển đổi thiết bị).

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React, Vite, TypeScript.
- **Styling:** Tailwind CSS (Modern UI, Glassmorphism).
- **State Management:** Zustand (có hỗ trợ Persistence lưu trữ tại trình duyệt).
- **AI Engine:** Google Gemini API (AI Studio).
- **Icons:** Google Material Symbols.

---

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

### Yêu cầu hệ thống
- **Node.js:** Phiên bản 18.x trở lên.
- **Gemini API Key:** Lấy tại [Google AI Studio](https://aistudio.google.com/).

### Các bước thực hiện

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình môi trường:**
   Tạo file `.env.local` tại thư mục gốc và thêm khóa API của bạn:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Chạy ứng dụng chế độ Development:**
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng:**
   Mở trình duyệt và truy cập: `http://localhost:5173`

---

## 📝 Thông tin dự án thực tế

- **Tên công trình:** NHÀ QUÊ
- **Địa chỉ:** Đồi Ảnh - Đông Sơn - Yên Thế - Bắc Giang
- **Chủ đầu tư:** Đỗ Văn Toàn
- **Ngân sách:** 1.400.000.000 VNĐ
- **Ngày khởi công:** 12/03/2025

---

## 📄 Giấy phép

Thiết kế và phát triển dành riêng cho dự án **Giám Sát Tổ Ấm**. 
Mọi thắc mắc vui lòng liên hệ trợ lý AI tích hợp trong ứng dụng.
