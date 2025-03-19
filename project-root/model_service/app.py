from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Định nghĩa đường dẫn mô hình (chỉnh lại nếu cần)
MODEL_PATH = "/home/nhathuy/CMU_CS_462_VIS_G1/project-root/model_service/software_effort_model.pkl"


# Load model từ file
with open(MODEL_PATH, "rb") as model_file:
    model = pickle.load(model_file)

# Kiểm tra model đã load đúng chưa
if not hasattr(model, "predict"):
    raise ValueError("❌ Lỗi: Model không có phương thức 'predict'. Hãy kiểm tra lại file .pkl!")

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()
#         print("📌 Dữ liệu nhận được:", data)  # Debug xem nhận được gì

#         # Kiểm tra nếu key "feature" có tồn tại trong JSON không
#         if "feature" not in data:
#             return jsonify({"error": "Thiếu key 'feature' trong JSON request!"})

#         df = pd.DataFrame([[data["feature"]]])  # Chỉ lấy 1 feature
#         prediction = model.predict(df)
#         return jsonify({"predicted_effort": prediction.tolist()})

#     except Exception as e:
#         return jsonify({"error": str(e)})
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Nhận dữ liệu từ request JSON
        data = request.get_json()
        print("📌 Dữ liệu nhận được:", data)  # Debug đầu vào

        # Kiểm tra nếu dữ liệu không hợp lệ
        if not isinstance(data, dict):
            return jsonify({"error": "Dữ liệu gửi lên phải là JSON object!"})

        # Kiểm tra xem các feature bắt buộc có trong dữ liệu không
        required_features = ["feature", "complexity", "lines_of_code"]
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Thiếu feature: {feature}"})

        # Chuyển dữ liệu thành DataFrame (Phải là list chứa dictionary)
        df = pd.DataFrame([data])

        # Thực hiện dự đoán
        prediction = model.predict(df)

        return jsonify({"predicted_effort": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
