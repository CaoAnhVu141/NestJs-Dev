
## Tên dự án: Xây dựng nền tảng tìm kiếm việc làm

## Mô tả
- Hệ thống cho phép người dùng tìm kiếm và nộp CV một cách hiệu quả
- Hệ thống gồm 3 vai trò chính: Ứng viên, HR, và Admin, hoạt động theo quy trình duyệt CV chặt chẽ và phân quyền linh hoạt.

## Tính năng chính
* Ứng viên
- Đăng kí, đăng nhập
- Thực hiện nộp CV các job đang mở
- Xem lịch sử đã nộp CV
* HR 
- Xem danh sách CV đã được duyệt của ứng viên
- Quản lý công việc, công ty

* Admin
- Quản lý hệ thống bao gồm như user, company, job, permissions, role, resume
- Phân quyền cho HR: chỉ HR có role cụ thể mới được truy cập tính năng
- Hệ thống sẽ tự động gửi email tới ứng viên khi ứng viên quan tâm đến công việc của công ty

## Authentication & Authorization
- Sử dụng JWT (Access + Refresh Token) để xác thực người dùng
- Các API quan trọng đều được bảo vệ bằng NestJS AuthGuard
- Người dùng chỉ có thể truy cập các chức năng phù hợp với vai trò được cấp
- Hệ thống hỗ trợ tự động làm mới access token bằng refresh token khi hết hạn

## Công nghệ sử dụng
- Frontend: React
- Backend: NestJS
- Database: MongoDB
- Authentication: JWT (Access & Refresh Token)

## Mục tiêu dự án
- Thực hành xây dựng hệ thống quản lý phân quyền đa vai trò
- Thực hành với NestJS, MongoDB và bảo mật với JWT

## Link Frontend
- https://github.com/CaoAnhVu141/React_For_CV.git

## Các bước chạy dự án
- Cài đặt thư viện với câu lệnh: npm i
- Chạy dự án với câu lệnh: npm run dev
