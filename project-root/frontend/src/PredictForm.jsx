import React, { useState } from "react";
import axios from "axios";

const PREDICT_API = process.env.REACT_APP_PREDICT_API;
if (!PREDICT_API) {
  throw new Error("❌ Missing environment variable REACT_APP_PREDICT_API");
}

const PredictForm = () => {
  const [inputs, setInputs] = useState({
    feature: "",
    complexity: "",
    lines_of_code: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  // Hàm xử lý nhập dữ liệu
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Hàm gửi dữ liệu đến API Flask
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error trước khi gửi request

    try {
      const response = await axios.post(PREDICT_API, {
        feature: parseFloat(inputs.feature),
        complexity: parseFloat(inputs.complexity),
        lines_of_code: parseFloat(inputs.lines_of_code),
      });

      setPrediction(response.data.predicted_effort);
    } catch (err) {
      setError(
        "❌ Lỗi khi gọi API: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Dự đoán Effort</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="feature"
          value={inputs.feature}
          onChange={handleChange}
          placeholder="Feature"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="complexity"
          value={inputs.complexity}
          onChange={handleChange}
          placeholder="Complexity"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="lines_of_code"
          value={inputs.lines_of_code}
          onChange={handleChange}
          placeholder="Lines of Code"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Dự đoán
        </button>
      </form>

      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      {prediction !== null && (
        <p className="text-green-500 mt-3 text-center font-bold">
          🔮 Kết quả dự đoán: {prediction}
        </p>
      )}
    </div>
  );
};

export default PredictForm;
