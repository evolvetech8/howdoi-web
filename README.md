# EvolveTech / DepositGuard — Tiếng Nói Độc Lập Về Tài Chính Cá Nhân Cho Người Việt

> *"Giúp người Việt không còn sợ hãi tiền bạc, làm chủ tài chính và sống an tâm hơn."* — Archonic

Nền tảng tài chính cá nhân thực chiến kết hợp giữa:
1. **Web Platform (`https://www.evolvetech.biz.vn/`)**: Bộ công cụ mô phỏng rủi ro tài chính mua nhà (**DepositGuard**), tính tài chính tự động (Lãi kép, Lương Gross-Net 2026, Ngân sách 50/30/20, Vay mua nhà) và kho cẩm nang thực chiến.
2. **Hệ thống Backend & API dùng chung**: Thiết kế sẵn để kết nối trực tiếp với ứng dụng **iOS App** tiếp theo mà Archonic sẽ phát hành.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS, Lucide Icons, Inter Font (hỗ trợ tối ưu tiếng Việt)
- **Biểu đồ tài chính tương tác**: Recharts
- **Backend & API**: Next.js Route Handlers (`/api/subscribe`)
- **Tối ưu SEO**: Metadata động, OpenGraph, JSON-LD Schema

---

## 🚀 Chạy Ứng Dụng Trên Máy Local

1. Mở terminal tại thư mục này:
   ```bash
   cd "/Volumes/SIDE HUSTLE/HOWDOI"
   ```
2. Khởi động server phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

---

## 📱 Sẵn Sàng Cho Ứng Dụng iOS Của Archonic

Kiến trúc thư mục và thuật toán tính toán tại `lib/finance-math.ts` được tách biệt hoàn toàn dưới dạng pure TypeScript/JavaScript.

Khi phát triển ứng dụng di động iOS (Flutter hoặc React Native / Swift):
- Các thuật toán tính lãi kép, tính thuế TNCN, phân bổ 6 chiếc lọ có thể tái sử dụng 100%.
- Endpoint `/api/subscribe` và cơ sở dữ liệu Supabase kết nối trực tiếp với ứng dụng iOS qua Supabase SDK mà không cần viết lại backend.

---

## 🌐 Tên Miền Chính Thức & Quản Trị Triển Khai (Vercel)

- **Website chính thức**: [https://www.evolvetech.biz.vn/](https://www.evolvetech.biz.vn/) (`evolvetech.biz.vn`)
- **Vercel Project Dashboard**: [https://vercel.com/evolvetech8s-projects](https://vercel.com/evolvetech8s-projects)

### Hướng dẫn triển khai & cấu hình tên miền trên Vercel
1. Đẩy mã nguồn lên GitHub:
   ```bash
   git add .
   git commit -m "chore: update official domain to evolvetech.biz.vn"
   git push origin main
   ```
2. Truy cập bảng điều khiển dự án tại [https://vercel.com/evolvetech8s-projects](https://vercel.com/evolvetech8s-projects).
3. Vào mục **Settings** -> **Domains** -> Đảm bảo `evolvetech.biz.vn` và `www.evolvetech.biz.vn` đã được kết nối.
4. Cấu hình DNS tại nhà đăng ký tên miền:
   - Bản ghi **A**: Host `@` trỏ tới IP `76.76.21.21`
   - Bản ghi **CNAME**: Host `www` trỏ tới `cname.vercel-dns.com`
5. Vercel tự động cấp chứng chỉ SSL HTTPS miễn phí.
