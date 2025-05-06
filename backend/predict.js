const { spawn } = require('child_process');
const path = require('path');

// Hàm này sẽ gọi đến script Python để thực hiện dự đoán
const predictEffort = async (inputData) => {
  return new Promise((resolve, reject) => {
    try {
      // Điều chỉnh đường dẫn đến script Python và model của bạn
      const pythonPath = path.join(__dirname, '.venv', 'bin', 'python');
      const pythonProcess = spawn(pythonPath, [
        path.join(__dirname, 'model/predict_model.py'),
        JSON.stringify(inputData)
      ]);

      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}: ${error}`));
        }

        try {
          // Nếu có kết quả từ Python
          if (result.trim()) {
            const parsedResult = JSON.parse(result);
            resolve(parsedResult);
          } else {
            // Sử dụng công thức COCOMO cơ bản nếu không có kết quả Python
            console.log("No Python output, using basic COCOMO formula");
            const size = inputData.softwareSize || 1000;
            const mode = inputData.mode || 'organic';
            
            // Hệ số dựa vào mode
            let a, b;
            switch (mode) {
              case 'organic':
                a = 2.4; b = 1.05;
                break;
              case 'semi-detached':
                a = 3.0; b = 1.12;
                break;
              case 'embedded':
                a = 3.6; b = 1.20;
                break;
              default:
                a = 3.0; b = 1.12;
            }
            
            // Điều chỉnh các hệ số dựa vào reliability và complexity
            if (inputData.reliability) {
              a *= inputData.reliability;
            }
            if (inputData.complexity) {
              a *= inputData.complexity;
            }
            
            // Công thức COCOMO cơ bản: Effort = a * (Size^b)
            const effort = a * Math.pow(size / 1000, b);
            resolve(effort);
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          reject(new Error(`Failed to parse prediction result: ${parseError.message}`));
        }
      });
    } catch (err) {
      console.error('Spawn error:', err);
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    }
  });
};

module.exports = { predictEffort };