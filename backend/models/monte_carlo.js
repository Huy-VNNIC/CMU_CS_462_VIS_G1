/**
 * Monte Carlo Risk Analysis for COCOMO II
 */
class MonteCarloAnalysis {
    /**
     * Run Monte Carlo simulation for COCOMO II
     * @param {Object} params - Parameters for simulation
     * @param {number} params.size - Software size
     * @param {number} params.exponent - Size exponent
     * @param {number} params.effortMultiplier - Effort multiplier
     * @param {number} params.A - Constant A
     * @param {number} params.iterations - Number of iterations
     * @return {Object} Statistics from simulation
     */
    static runSimulation(params) {
      const {
        size,
        exponent,
        effortMultiplier,
        A = 2.94,
        iterations = 10000
      } = params;
      
      // Arrays to store results
      const efforts = [];
      const schedules = [];
      const costs = [];
      
      // Define uncertainty ranges (typical ranges from studies)
      const sizeUncertainty = 0.15;  // 15% uncertainty in size
      const emUncertainty = 0.10;    // 10% uncertainty in effort multipliers
      const coeffUncertainty = 0.08; // 8% uncertainty in A coefficient
      
      // Perform simulation
      for (let i = 0; i < iterations; i++) {
        // Generate random variations using triangular distribution
        const sizeVar = this._triangularRandom(1 - sizeUncertainty, 1, 1 + sizeUncertainty);
        const emVar = this._triangularRandom(1 - emUncertainty, 1, 1 + emUncertainty);
        const coeffVar = this._triangularRandom(1 - coeffUncertainty, 1, 1 + coeffUncertainty);
        
        // Apply variations to parameters
        const simSize = size * sizeVar;
        const simEM = effortMultiplier * emVar;
        const simA = A * coeffVar;
        
        // Calculate effort with varied parameters
        const effort = simA * Math.pow(simSize / 1000, exponent) * simEM;
        efforts.push(effort);
        
        // Calculate schedule
        const schedule = 3.67 * Math.pow(effort, 0.28 + 0.2 * (exponent - 0.91));
        schedules.push(schedule);
        
        // Calculate cost (assuming average cost per person-month)
        const avgCostPerPM = 10000;  // Example: $10k per person-month
        const cost = effort * avgCostPerPM;
        costs.push(cost);
      }
      
      // Sort arrays for percentile calculations
      efforts.sort((a, b) => a - b);
      schedules.sort((a, b) => a - b);
      costs.sort((a, b) => a - b);
      
      // Return statistical results
      return {
        effort: this._calculateStatistics(efforts),
        schedule: this._calculateStatistics(schedules),
        cost: this._calculateStatistics(costs),
      };
    }
    
    /**
     * Calculate statistics from simulation results
     */
    static _calculateStatistics(data) {
      const n = data.length;
      
      return {
        min: data[0],
        max: data[n - 1],
        mean: data.reduce((sum, val) => sum + val, 0) / n,
        median: data[Math.floor(n / 2)],
        p10: data[Math.floor(n * 0.10)],  // 10th percentile
        p25: data[Math.floor(n * 0.25)],  // 25th percentile
        p75: data[Math.floor(n * 0.75)],  // 75th percentile
        p90: data[Math.floor(n * 0.90)],  // 90th percentile
        p95: data[Math.floor(n * 0.95)]   // 95th percentile
      };
    }
    
    /**
     * Generate a random number using triangular distribution
     */
    static _triangularRandom(min, mode, max) {
      const r = Math.random();
      const f = (max - min) / (mode - min);
      
      if (r <= f) {
        return min + Math.sqrt(r * (mode - min) * (max - min));
      } else {
        return max - Math.sqrt((1 - r) * (max - mode) * (max - min));
      }
    }
  }
  
  module.exports = MonteCarloAnalysis;