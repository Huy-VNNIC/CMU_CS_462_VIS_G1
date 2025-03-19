# Machine Learning Effort Prediction System

## 📌 Giới thiệu
Dự án này sử dụng **Machine Learning** để dự đoán effort trong phát triển phần mềm dựa trên các thông số đầu vào như số dòng code (LOC), độ phức tạp (Complexity), và các yếu tố khác.

Hệ thống gồm ba thành phần chính:
1. **Frontend**: Ứng dụng React.js để thu thập dữ liệu từ người dùng.
2. **Backend**: API Node.js kết nối giữa frontend và model dự đoán.
3. **Model Service**: Dịch vụ Flask chạy mô hình Machine Learning để dự đoán effort.

---
## 📂 Cấu trúc thư mục
```
CMU_CS_462_VIS_G1/
│── frontend/              # React.js frontend
│   ├── node_modules/      # Thư viện Node.js
│   ├── public/            # File tĩnh
│   ├── src/               # Source code React
│   ├── package.json       # Cấu hình dependencies
│   ├── README.md          # Tài liệu frontend
│
│── project-root/          # Backend + Model Service
│   │── backend/           # API Server (Node.js)
│   │   ├── server.js      # File chính của backend
│   │   ├── package.json   # Cấu hình backend
│   │   ├── .env           # Biến môi trường
│   │   ├── Dockerfile     # Docker backend
│   │
│   │── model_service/     # Service dự đoán ML (Flask)
│   │   ├── app.py         # API Flask xử lý dự đoán
│   │   ├── requirements.txt  # Các thư viện Python
│   │   ├── software_effort_model.pkl  # Mô hình ML
│   │   ├── Dockerfile     # Docker model
│   │
│   │── docker-compose.yml # Chạy toàn bộ hệ thống
```
---
## 🚀 Cách chạy hệ thống

### 1️⃣ Chạy bằng Docker Compose
```sh
docker-compose up --build
```
Lệnh này sẽ:
- Khởi chạy frontend React.js trên cổng `3000`
- Khởi chạy backend Node.js trên cổng `5000`
- Khởi chạy model service Flask trên cổng `5001`

---
## 🔧 API Endpoints
### 🟢 Backend API (Node.js)
| Method | Endpoint     | Mô tả |
|--------|-------------|-------|
| POST   | `/predict`  | Gửi dữ liệu để dự đoán effort |

---

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt môi trường

```sh
pip install -r requirements.txt
```

### 2. Khởi chạy server Flask

```sh
python app.py
```

Mặc định API sẽ chạy trên `http://0.0.0.0:5001`

---

## 🔥 Hướng dẫn sử dụng API

### 1. Endpoint: `/predict`

**Phương thức:** `POST`

#### 🔹 Request Body (JSON):

```json
{
  "feature": 5,
  "complexity": 3,
  "lines_of_code": 2000
}
```

#### 🔹 Response:

```json
{
  "predicted_effort": 39.98
}
```

---

## 🎯 So sánh với mô hình COCOMO II

Mô hình Machine Learning được so sánh với **COCOMO II** - một phương pháp truyền thống dự đoán effort phần mềm theo công thức:

```
Effort = A * (Size)^B * EAF
```

Trong đó:

- **Size**: KLOC (Số ngàn dòng code)
- **A, B**: Hằng số (tùy vào loại dự án)
- **EAF**: Hệ số điều chỉnh

**Ví dụ so sánh:**

| Phương pháp          | Effort dự đoán |
| -------------------- | -------------- |
| **COCOMO II**        | 42.5           |
| **Machine Learning** | 39.98          |

---

## 📊 Đánh giá mô hình

### 1. Độ chính xác mô hình

Đánh giá mô hình dựa trên các metric:

- **MAE (Mean Absolute Error)**
- **RMSE (Root Mean Squared Error)**
- **R² Score**

| Mô hình           | MAE  | RMSE | R² Score |
| ----------------- | ---- | ---- | -------- |
| Linear Regression | 4.32 | 5.67 | 0.89     |
| Decision Tree     | 5.10 | 6.42 | 0.85     |
| Random Forest     | 3.85 | 4.99 | 0.91     |

Mô hình **Random Forest** cho kết quả tốt nhất.

---

## 🔧 Cải tiến hệ thống

1. **Thêm dữ liệu với nhiều đặc trưng hơn** (FP, UCP,...).
2. **Tối ưu mô hình** bằng Hyperparameter Tuning.
3. **Áp dụng mô hình mạnh hơn** như XGBoost hoặc Neural Network.
4. **So sánh nhiều cách tiếp cận khác nhau** để đảm bảo độ chính xác.


