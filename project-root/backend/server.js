const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || "http://model_service:5000/predict";

app.post("/predict", async (req, res) => {
    try {
        const response = await axios.post(MODEL_SERVICE_URL, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi gọi model service" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
