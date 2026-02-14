# Changelog

## [2026-02-14] — Phase 8: Professional Features & Fixes

### Added
- **Import/Export Data**: 
  - Đã thêm tính năng Xuất dữ liệu đầy đủ (bao gồm Project, Timeline, Photos, Finance, Logs, Contractors, Documents, Issues).
  - Đã thêm tính năng Nhập dữ liệu từ file JSON để khôi phục/chuyển dữ liệu sang máy khác.
- **Document Management**:
  - Upload file đính kèm (Ảnh, PDF, Doc...) cho tài liệu dự án.
  - Drag-and-drop support cho việc upload.
- **Photo Gallery Enhancements**:
  - Xem ảnh lớn (Lightbox) khi click vào ảnh.
  - Sửa thông tin ảnh (Giai đoạn, AI Tag) trực tiếp trên ảnh.
  - Nhóm ảnh theo Giai đoạn thi công (Phase).
- **Issue Tracker**:
  - Thêm module Quản lý Lỗi thi công & Việc vặt.
  - CRUD Issues (Tạo, Sửa, Xóa, Đổi trạng thái).

### Changed
- **Finance Module**:
  - Tách trường "Số lượng" thành 2 trường riêng biệt: `Số lượng` (số) và `Đơn vị` (text) để nhập liệu rõ ràng hơn.
  - Tự động tính `Tổng tiền = Số lượng * Đơn giá` khi nhập liệu.
  - Cập nhật hiển thị số tiền trong các thẻ thống kê sang dạng đầy đủ (VD: `1.500.000.000đ`) thay vì viết tắt.
  - Cập nhật Layout Modal thêm/sửa hóa đơn thành 4 cột.
- **Timeline UI**:
  - Cải thiện hiển thị step progress.
  - Fix lỗi tràn text trong Timeline.

### Fixed
- Lỗi `z-index` khiến nút Edit/AI trên ảnh không click được.
- Lỗi tính toán sai tổng tiền trong Finance.

## [2026-02-14] — Phase 2: Dynamic Dashboard & AI Integration

### Added
- **Dynamic Dashboard**: Connected DashboardOverview to Zustand store (replaced hardcoded data).
- **Update Modal**: New `UpdateProjectModal` for adding timeline steps, photos, and finance items.
- **Photo Upload**: `FileUpload` component with Base64 conversion and drag-drop support.
- **AI Analysis**: Integrated Gemini AI to analyze construction photos directly from dashboard.
- **Data Export**: JSON export functionality for project backup.

### Fixed
- TypeScript error `TS2459` (AppState export).
- Cosmetic issue: Display `undefined%` in timeline progress.

## [2026-02-14] — Initial Setup & Skills Integration

### Fixed
- Xóa `importmap` trong `index.html` — conflict với Vite module resolution, gây blank page
- Thêm `<script type="module" src="/index.tsx">` vào `index.html` — entry point bị thiếu
- Fix "Invalid hook call" error — React version conflict giữa CDN (esm.sh) và node_modules

### Added
- Tạo `.env.local` với `GEMINI_API_KEY` cho tích hợp AI
- Copy **13 skills** từ `antigravity-awesome-skills` vào `.agent/skills/`:
  - `gemini-api-dev` — Gemini AI integration
  - `react-best-practices` — 57 React performance rules
  - `react-state-management` — Zustand/Redux/Jotai patterns
  - `react-patterns` — Component composition & hooks
  - `react-ui-patterns` — Loading/error/empty states
  - `zustand-store-ts` — Zustand TypeScript templates
  - `typescript-pro` — Advanced TypeScript patterns
  - `tailwind-patterns` — Tailwind v4 CSS patterns
  - `frontend-design` — Production-grade design principles
  - `ui-ux-pro-max` — Design intelligence (50 styles, 97 palettes)
  - `error-handling-patterns` — Resilient error handling
  - `javascript-pro` — Modern ES6+ & async patterns
  - `file-uploads` — Secure file upload handling
- Tạo `.brain/brain.json` — Kiến thức dự án (static)
- Tạo `.brain/session.json` — Trạng thái session (dynamic)
- Tạo `CHANGELOG.md`

### Analysis
- Phân tích toàn bộ codebase — xác định tất cả components đang dùng hardcoded data
- Lập roadmap phát triển 7 phases từ Infrastructure → UX Polish
- Mapping 13 skills → các phases phát triển tương ứng
