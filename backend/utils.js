// Tiền xử lý đầu vào giống như khi training
const preprocessInput = (inputData) => {
  // Cần điều chỉnh hàm này để phản ánh đúng tiền xử lý dữ liệu khi train
  // Dưới đây là mẫu, bạn cần điều chỉnh theo mô hình của mình
  
  // Ví dụ: chuyển đổi các giá trị Nominal/Ordinal thành số
  const processedData = {
    // Các trường số giữ nguyên giá trị
    SLOC: inputData.SLOC,
    Percent_Design_Modified: inputData.Percent_Design_Modified,
    Integration_Required: inputData.Integration_Required,
    SW_Understanding: inputData.SW_Understanding,
    Platform_Volatility: inputData.Platform_Volatility,
    Time_Constraint: inputData.Time_Constraint,
    Analyst_Capability: inputData.Analyst_Capability,
    Tool_Experience: inputData.Tool_Experience,
    Ratio_Feature: inputData.Ratio_Feature,
    Interval_Feature: inputData.Interval_Feature,
    
    // Các trường cần mã hóa - điều chỉnh theo mô hình của bạn
    Ordinal_Feature: encodeOrdinal(inputData.Ordinal_Feature),
    Nominal_Feature: encodeNominal(inputData.Nominal_Feature),
  };
  
  return processedData;
};

// Các hàm encode - cần điều chỉnh theo mô hình của bạn
function encodeOrdinal(value) {
  const mapping = { 'Low': 1, 'Medium': 2, 'High': 3 };
  return mapping[value] || 0;
}

function encodeNominal(value) {
  const mapping = { 'MobileApp': 0, 'DesktopApp': 1, 'WebApp': 2 };
  return mapping[value] || 0;
}

module.exports = { preprocessInput };