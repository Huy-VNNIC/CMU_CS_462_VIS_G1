import sys
import json
import pickle
import numpy as np
import pandas as pd

# Đường dẫn đến file mô hình của bạn
MODEL_PATH = './model/your_model.pkl'

try:
    # Load mô hình đã train
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    
    # Nhận dữ liệu từ Node.js
    input_json = sys.argv[1]
    input_data = json.loads(input_json)
    
    # Chuyển đổi input_data thành định dạng mà mô hình của bạn mong đợi
    # Đoạn này cần điều chỉnh dựa trên cấu trúc mô hình và dữ liệu train của bạn
    features = pd.DataFrame([input_data])
    
    # Thực hiện dự đoán
    prediction = model.predict(features)[0]
    
    # Trả kết quả về cho Node.js
    print(json.dumps(float(prediction)))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)