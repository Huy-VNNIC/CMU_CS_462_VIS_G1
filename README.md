# COCOMO II Advanced Calculator


![COCOMO II Calculator](https://img.shields.io/badge/COCOMO%20II-Advanced%20Calculator-blue)
![Version](https://img.shields.io/badge/version-1.1.0-brightgreen)
![Status](https://img.shields.io/badge/status-stable-brightgreen)

## Tổng quan

COCOMO II Advanced Calculator là công cụ hiện đại để ước tính nỗ lực phát triển phần mềm dựa trên mô hình Constructive Cost Model II (COCOMO II). Ứng dụng cung cấp giao diện người dùng trực quan cho quá trình ước tính dự án phần mềm, bao gồm các tính năng nâng cao như Scale Drivers, Cost Drivers và phân tích rủi ro Monte Carlo.

![COCOMO II Screenshot](./screenshots/cocomo-calculator.png)
![image](https://github.com/user-attachments/assets/ee99e749-cba5-47f5-b54b-cfca4051c515)

## Tính năng chính

- **Mô hình COCOMO II đầy đủ**:
  - Ước tính nỗ lực (person-months)
  - Ước tính lịch trình (tháng/tuần)
  - Ước tính quy mô nhóm phát triển

- **Các tham số COCOMO II nâng cao**:
  - Scale Drivers: Precedentedness, Development Flexibility, Architecture Resolution, Team Cohesion, và Process Maturity
  - Cost Drivers: 16 drivers trong 4 nhóm (Product Factors, Platform Factors, Personnel Factors, và Project Factors)

- **Phân tích rủi ro Monte Carlo**:
  - Phân tích xác suất cho effort, lịch trình và quy mô nhóm
  - Các phân vị P10, P50, P90 cho kế hoạch dự án thực tế
  - Ước tính rủi ro dựa trên mô phỏng đa biến

- **Giao diện người dùng hiện đại**:
  - Thiết kế đáp ứng (responsive design)
  - Hỗ trợ Dark Mode / Light Mode
  - Layout thân thiện với người dùng

- **Tích hợp API với mô hình ML nâng cao**:
  - Sử dụng mô hình học máy để cải thiện độ chính xác ước tính
  - Backend API linh hoạt với Python và Node.js

## Công nghệ sử dụng

- **Frontend**:
  - React
  - TypeScript
  - CSS3 hiện đại

- **Backend**:
  - Node.js
  - Express
  - Python (cho mô hình học máy)

## Cài đặt

### Yêu cầu hệ thống

- Node.js 14+
- Python 3.7+ (cho mô hình ML)
- npm hoặc yarn

### Cài đặt Frontend

```bash
# Clone repository
git clone https://github.com/yourusername/CMU_SE__404.git
cd CMU_SE__404/frontend

# Cài đặt dependencies
npm install

# Khởi chạy ứng dụng
npm start
```

### Cài đặt Backend

```bash
# Di chuyển đến thư mục backend
cd ../backend

# Cài đặt dependencies Node.js
npm install

# Cài đặt dependencies Python
pip install numpy scikit-learn

# Khởi chạy server
node app.js
```

## Cách sử dụng

1. **Nhập thông số cơ bản**:
   - Software Size (SLOC hoặc Function Points)
   - Sizing Method (SLOC/Function Points)
   - Mode (SLDC/Organic/Semi-detached/Embedded)
   - Các tham số tùy chỉnh (a, b, SCED, RCPX)

2. **Cấu hình Scale Drivers**:
   - Precedentedness
   - Development Flexibility
   - Architecture Resolution
   - Team Cohesion
   - Process Maturity

3. **Cấu hình Cost Drivers**:
   - Product factors (Reliability, Database Size, ...)
   - Platform factors (Execution Time Constraint, ...)
   - Personnel factors (Analyst Capability, ...)
   - Project factors (Tool Use, ...)

4. **Bật/tắt phân tích Monte Carlo** (tùy chọn)

5. **Nhấn "Calculate Effort"** để nhận kết quả ước tính

## API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/test` | GET | Kiểm tra server hoạt động |
| `/cocomo/drivers` | GET | Lấy danh sách Scale Drivers và Cost Drivers |
| `/predict` | POST | API cơ bản tương thích ngược |
| `/cocomo/detailed` | POST | Tính toán COCOMO II đầy đủ |
| `/cocomo/monte-carlo` | POST | Thực hiện phân tích rủi ro Monte Carlo |

## Cấu trúc dự án

```
CMU_SE__404/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── CocomoTable.tsx
│       │   ├── CostDrivers.tsx
│       │   ├── Dropdown.tsx
│       │   ├── Header.tsx
│       │   ├── InputField.tsx
│       │   ├── InputGroup.tsx
│       │   ├── MonteCarloResults.tsx
│       │   ├── ResultCard.tsx
│       │   ├── ScaleDrivers.tsx
│       │   └── ThemeToggle.tsx
│       ├── models/
│       │   └── types.ts
│       ├── services/
│       │   └── api.ts
│       ├── utils/
│       │   └── backend-helper.ts
│       ├── App.css
│       ├── App.tsx
│       ├── index.css
│       └── index.tsx
├── backend/
│   ├── ml_models/
│   │   ├── cocomo_basic_model.pkl
│   │   ├── cocomo_advanced_model.pkl
│   │   ├── create_dummy_model.py
│   │   ├── predict_basic.py
│   │   ├── predict_advanced.py
│   │   └── monte_carlo.py
│   ├── app.js
│   └── package.json
└── README.md
```

## Chi tiết kỹ thuật

### Mô hình COCOMO II

COCOMO II là mô hình ước tính nỗ lực phát triển phần mềm được phát triển bởi Barry Boehm. Công thức cơ bản:

```
PM = A * Size^E * EM
```

Trong đó:
- PM: Nỗ lực (person-months)
- A: Hằng số hiệu chỉnh (2.94 cho COCOMO II.2000)
- Size: Kích thước phần mềm (KSLOC)
- E: Hệ số quy mô (E = B + 0.01 * ∑SF)
- EM: Tích các hệ số điều chỉnh từ Cost Drivers

### Phân tích Monte Carlo

Phương pháp Monte Carlo được sử dụng để phân tích rủi ro bằng cách:
1. Tạo nhiều biến thể ngẫu nhiên của các tham số đầu vào
2. Tính toán kết quả cho mỗi bộ tham số
3. Phân tích phân phối kết quả để xác định các phân vị và xác suất

## Đóng góp

Đóng góp và báo lỗi luôn được chào đón! Vui lòng:

1. Fork repository
2. Tạo nhánh tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## Giấy phép

Dự án này được phân phối dưới Giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## Tác giả

- **Huy-VNNIC** - *Initial work and maintenance*

## Lời cảm ơn

- Dr. Barry Boehm và đội ngũ USC COCOMO II cho việc phát triển mô hình COCOMO II
- Các contributor đã giúp cải thiện ứng dụng
- [Software Engineering Institute](https://www.sei.cmu.edu/) cho tài liệu tham khảo

---

*Thời gian cập nhật: 2025-05-05 19:19:19 (UTC)*  
*Đăng nhập người dùng hiện tại: Huy-VNNIC*
