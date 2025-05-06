const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Trang chủ
app.get('/', (req, res) => {
  res.send('COCOMO II API with ML Model is running. Test successful!');
});

// Route kiểm tra
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// API endpoint dự đoán cơ bản (tương thích ngược)
app.post('/predict', (req, res) => {
  try {
    const { softwareSize, mode, reliability = 1.15, complexity = 1.30 } = req.body;
    
    // Gọi script Python để thực hiện dự đoán
    const python = spawn('python', [
      path.join(__dirname, 'ml_models', 'predict_basic.py'),
      softwareSize.toString(),
      mode,
      reliability.toString(),
      complexity.toString()
    ]);
    
    let dataString = '';
    
    // Nhận dữ liệu từ quá trình Python
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Xử lý lỗi từ quá trình Python
    python.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    // Khi quá trình Python kết thúc
    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          error: `Python process exited with code ${code}`
        });
      }
      
      try {
        const results = JSON.parse(dataString);
        
        res.json({
          success: true,
          prediction: results.effort,
          schedule: results.schedule,
          teamSize: results.teamSize
        });
      } catch (error) {
        console.error('Error parsing Python output:', error);
        res.status(500).json({
          success: false,
          error: 'Error parsing prediction results'
        });
      }
    });
  } catch (error) {
    console.error('Error calculating effort:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error calculating effort'
    });
  }
});

// API endpoint để lấy danh sách các drivers
app.get('/cocomo/drivers', (req, res) => {
  const drivers = {
    scaleDrivers: {
      precedentedness: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      developmentFlexibility: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      architectureResolution: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      teamCohesion: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      processMaturiy: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High']
    },
    costDrivers: {
      // Product factors
      reliability: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      databaseSize: ['Low', 'Nominal', 'High', 'Very High'],
      complexity: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      reusability: ['Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      documentation: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      
      // Platform factors
      executionTimeConstraint: ['Nominal', 'High', 'Very High', 'Extra High'],
      storageConstraint: ['Nominal', 'High', 'Very High', 'Extra High'],
      platformVolatility: ['Low', 'Nominal', 'High', 'Very High'],
      
      // Personnel factors
      analystCapability: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      programmerCapability: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      applicationExperience: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      platformExperience: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      languageExperience: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      
      // Project factors
      toolUse: ['Very Low', 'Low', 'Nominal', 'High', 'Very High'],
      multisiteDevelopment: ['Very Low', 'Low', 'Nominal', 'High', 'Very High', 'Extra High'],
      schedule: ['Very Low', 'Low', 'Nominal', 'High', 'Very High']
    },
    sizingMethods: ['SLOC', 'Function Points']
  };
  
  res.json({
    success: true,
    drivers: drivers
  });
});

// API endpoint cho COCOMO II chi tiết với mô hình ML
app.post('/cocomo/detailed', (req, res) => {
  try {
    const { 
      size, 
      sizingMethod = 'SLOC',
      scaleDrivers = {}, 
      costDrivers = {}, 
      unadjustedFP = 0,
      sced = 0, 
      rcpx = 0,
      riskAnalysis = false 
    } = req.body;
    
    // Chuẩn bị tham số cho script Python
    const pythonArgs = [
      path.join(__dirname, 'ml_models', 'predict_advanced.py'),
      JSON.stringify({
        size: size,
        sizingMethod: sizingMethod,
        scaleDrivers: scaleDrivers,
        costDrivers: costDrivers,
        unadjustedFP: unadjustedFP,
        sced: sced,
        rcpx: rcpx,
        riskAnalysis: riskAnalysis
      })
    ];
    
    // Gọi script Python để thực hiện dự đoán với mô hình ML
    const python = spawn('python', pythonArgs);
    
    let dataString = '';
    
    // Nhận dữ liệu từ quá trình Python
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Xử lý lỗi từ quá trình Python
    python.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    // Khi quá trình Python kết thúc
    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          error: `Python process exited with code ${code}`
        });
      }
      
      try {
        const results = JSON.parse(dataString);
        res.json({
          success: true,
          result: results
        });
      } catch (error) {
        console.error('Error parsing Python output:', error);
        res.status(500).json({
          success: false,
          error: 'Error parsing prediction results'
        });
      }
    });
  } catch (error) {
    console.error('Error calculating detailed COCOMO:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error calculating effort'
    });
  }
});

// API endpoint cho phân tích Monte Carlo
app.post('/cocomo/monte-carlo', (req, res) => {
  try {
    const pythonArgs = [
      path.join(__dirname, 'ml_models', 'monte_carlo.py'),
      JSON.stringify(req.body)
    ];
    
    // Gọi script Python để thực hiện phân tích Monte Carlo
    const python = spawn('python', pythonArgs);
    
    let dataString = '';
    
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          error: `Python process exited with code ${code}`
        });
      }
      
      try {
        const results = JSON.parse(dataString);
        res.json({
          success: true,
          analysis: results
        });
      } catch (error) {
        console.error('Error parsing Python output:', error);
        res.status(500).json({
          success: false,
          error: 'Error parsing risk analysis results'
        });
      }
    });
  } catch (error) {
    console.error('Error in Monte Carlo analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error in risk analysis'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- GET  /test`);
  console.log(`- GET  /cocomo/drivers`);
  console.log(`- POST /predict (basic mode - with ML model)`);
  console.log(`- POST /cocomo/detailed (advanced mode - with ML model)`);
  console.log(`- POST /cocomo/monte-carlo (risk analysis - with ML model)`);
  console.log(`Current Date and Time (UTC): 2025-05-05 18:16:50`);
  console.log(`Current User's Login: Huy-VNNIC`);
});