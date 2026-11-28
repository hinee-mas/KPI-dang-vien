# KPI Đảng viên – Trường TH&THCS Vĩnh Gia 2

Ứng dụng web (cài được lên điện thoại) để đảng viên tự chấm điểm KPI 100 điểm = 30 (tiêu chí chung) + 70 (6 trục nhiệm vụ), tải minh chứng; quản trị xem tổng hợp, xếp loại, xuất Excel.

## Các tệp
- `index.html` – ứng dụng chính
- `manifest.webmanifest`, `sw.js`, `icons/` – để cài như ứng dụng và dùng khi mất mạng
- `Code.gs` – mã Google Apps Script lưu dữ liệu vào Google Trang tính của quản trị

## Bước 1. Đưa lên GitHub Pages
1. Tạo kho mới, tên không dấu, ví dụ `kpi-dang-vien`.
2. Tải **tất cả** tệp và thư mục `icons` lên **thư mục gốc** của kho (cùng cấp README).
3. Settings → Pages → Source: *Deploy from a branch* → nhánh `main`, thư mục `/ (root)` → Save.
4. Chờ 1–3 phút, mở `https://<tài-khoản>.github.io/<tên-kho>/`.

Chỉ làm đến bước này là dùng được ở **chế độ cá nhân**: mỗi người chấm trên máy mình, chưa có tổng hợp chung.

## Cách khác: đưa lên Netlify (không cần GitHub)
1. Vào app.netlify.com/drop, đăng nhập.
2. Kéo cả **thư mục** đã giải nén (chứa `index.html`) vào khung "Drag and drop your site folder here".
3. Netlify cấp ngay địa chỉ dạng `ten-ngau-nhien.netlify.app`; đổi tên ở Site configuration → Change site name.
4. Muốn cập nhật: vào tab Deploys, kéo thả thư mục mới đè lên.
Bước 2 bên dưới (nộp chung về Google Trang tính) làm giống hệt: sửa `window.KPI_API` trong `index.html` rồi triển khai lại.

## Bước 2. Bật nộp chung về Google Trang tính (khuyến nghị)
1. Đăng nhập email cá nhân của quản trị, tạo một Google Trang tính mới.
2. Tiện ích mở rộng → Apps Script → xóa mã cũ, dán toàn bộ `Code.gs`.
3. Đổi `ADMIN_PIN` thành mã quản trị riêng của bạn.
4. Triển khai → Tùy chọn triển khai mới → Ứng dụng web: *Thực thi với tư cách: Tôi*; *Người có quyền truy cập: Bất kỳ ai* → Triển khai, cấp quyền khi Google hỏi.
5. Sao chép URL ứng dụng web (kết thúc bằng `/exec`).
6. Mở `index.html`, tìm dòng `window.KPI_API='';` và dán URL vào giữa hai dấu nháy. Lưu lại và tải đè lên GitHub.

Từ đó: đảng viên đăng nhập bằng họ tên + mã PIN tự đặt; dữ liệu và bảng tổng hợp xuất hiện ở trang tính `DuLieu`; tệp minh chứng nằm trong thư mục Drive `KPI-MinhChung`. Quản trị đăng nhập, tick "Tôi là quản trị" và nhập `ADMIN_PIN` để mở tab Tổng hợp.

## Lưu ý bảo mật
- Tệp minh chứng được đặt chế độ "ai có liên kết đều xem được". Không tải tài liệu mật.
- Mã PIN cá nhân nên 6 chữ số; không dùng chung. Không chia sẻ `ADMIN_PIN`.
- Sau khi sửa `Code.gs` phải triển khai lại phiên bản mới.

## Cập nhật theo Quy định 366-QĐ/TW (30/8/2025)
- Nhóm tiêu chí chung (30 điểm) dùng nội dung **Phụ lục 4** (cá nhân không giữ chức vụ lãnh đạo, quản lý): 3 nhóm, 16 tiêu chí. Quy định chỉ nêu tổng 30 điểm, không chia điểm từng nhóm; mức chia mặc định 18/4/8 nằm ở hằng số `GM` trong `index.html` (dòng chú thích bắt đầu bằng "Phụ lục 4").
- Xếp loại theo **Điều 11**: ngưỡng 90/70/50; xuất sắc cần ≥30% nhiệm vụ vượt mức; chậm tiến độ ≤20% nhiệm vụ mới còn đạt "Hoàn thành"; >50% nhiệm vụ không hoàn thành hoặc vi phạm điều đảng viên không được làm ⇒ "Không hoàn thành".
- Bản chấm đã lưu theo mã tiêu chí cũ (1.1 … 3.4) sẽ không còn khớp, cần đánh dấu lại phần A.
- Đăng nhập chỉ hoạt động khi `window.KPI_API` có địa chỉ `/exec`; nếu để trống, đầu trang hiện dòng cảnh báo vàng.

## Đổi mã PIN (đảng viên)
Sau khi đăng nhập, bấm nút **Đổi mã PIN** ở đầu trang: nhập PIN hiện tại, PIN mới (4–8 chữ số) và nhập lại. Toàn bộ bản chấm, xếp loại, nhận xét được chuyển sang mã mới. Cần dán lại `Code.gs` mới và **Triển khai phiên bản mới** để tính năng này chạy. Quên PIN hiện tại thì không tự đổi được (hệ thống không lưu PIN).
