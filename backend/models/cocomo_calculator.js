const constants = require('./cocomo_constants');

/**
 * COCOMO II Calculator
 */
class CocomoCalculator {
  constructor() {
    // Default values
    this.A = 2.94; // Constant for COCOMO II.2000
    this.B = 0.91; // Constant for COCOMO II.2000
  }
  
  /**
   * Calculate COCOMO II effort with full model parameters
   */
  calculateEffort(params) {
    const {
      size,
      sizingMethod = 'SLOC',
      scaleDrivers = {},
      costDrivers = {},
      riskAnalysis = false,
      mode = 'embedded',
      sced = 0,
      rcpx = 0,
      unadjustedFP = 0,
      unadustedFP = 0, // Typo in the original UI, kept for compatibility
    } = params;
    
    try {
      // Determine A and B based on mode if using basic model
      if (!params.useDetailedModel) {
        switch (mode.toLowerCase()) {
          case 'organic':
            this.A = 2.4;
            this.B = 1.05;
            break;
          case 'semi-detached':
            this.A = 3.0;
            this.B = 1.12;
            break;
          case 'embedded':
            this.A = 3.6;
            this.B = 1.20;
            break;
          default:
            this.A = 2.94;
            this.B = 0.91;
        }
      } else {
        // Use COCOMO II.2000 defaults
        this.A = 2.94;
        this.B = 0.91;
      }
      
      // Calculate exponent with scale factors
      let exponent = this.B;
      
      // Apply scale drivers if provided
      if (params.useDetailedModel && scaleDrivers) {
        const scaleFactor = this._calculateScaleFactor(scaleDrivers);
        exponent = 0.91 + 0.01 * scaleFactor;
      }
      
      // Calculate effort multiplier
      const effortMultiplier = this._calculateEffortMultiplier(costDrivers);
      
      // Calculate adjusted size
      let adjustedSize = size;
      if (sizingMethod === 'Function Points') {
        // Convert Function Points to SLOC
        const fpToSloc = 50; // Placeholder: Lines per Function Point (varies by language)
        adjustedSize = (unadjustedFP || unadustedFP) * fpToSloc;
      }
      
      // Apply SCED % and RCPX % if provided
      if (sced) {
        // Apply schedule compression/expansion factor
        const schedFactor = 1 + (sced / 100);
        this.A *= schedFactor;
      }
      
      if (rcpx) {
        // Apply requirements complexity factor
        const rcpxFactor = 1 + (rcpx / 100);
        adjustedSize *= rcpxFactor;
      }
      
      // Base effort calculation: PM = A * Size^E * EM
      const effort = this.A * Math.pow(adjustedSize / 1000, exponent) * effortMultiplier;
      
      // Schedule calculation
      const schedule = 3.67 * Math.pow(effort, 0.28 + 0.2 * (exponent - 0.91));
      
      // Calculate team size
      const teamSize = effort / schedule;
      
      // Calculate cost (assuming average salary)
      const avgSalary = 80000; // Example: $80k per person-year
      const cost = (effort / 12) * avgSalary;
      
      // Monte Carlo risk analysis if requested
      let riskAnalysisResults = null;
      if (riskAnalysis) {
        riskAnalysisResults = this._performMonteCarloAnalysis(
          adjustedSize, exponent, effortMultiplier
        );
      }
      
      return {
        effort,
        schedule,
        teamSize,
        cost,
        riskAnalysis: riskAnalysisResults
      };
    } catch (error) {
      console.error('Error in COCOMO calculation:', error);
      throw error;
    }
  }
  
  /**
   * Calculate Scale Factor from scale drivers
   */
  _calculateScaleFactor(scaleDrivers) {
    let scaleFactor = 0;
    
    // Sum the scale drivers
    if (scaleDrivers.precedentedness) {
      scaleFactor += constants.PREC[scaleDrivers.precedentedness] || constants.PREC['Nominal'];
    }
    if (scaleDrivers.developmentFlexibility) {
      scaleFactor += constants.FLEX[scaleDrivers.developmentFlexibility] || constants.FLEX['Nominal'];
    }
    if (scaleDrivers.architectureResolution) {
      scaleFactor += constants.RESL[scaleDrivers.architectureResolution] || constants.RESL['Nominal'];
    }
    if (scaleDrivers.teamCohesion) {
      scaleFactor += constants.TEAM[scaleDrivers.teamCohesion] || constants.TEAM['Nominal'];
    }
    if (scaleDrivers.processMaturiy) {
      scaleFactor += constants.PMAT[scaleDrivers.processMaturiy] || constants.PMAT['Nominal'];
    }
    
    // If no scale factors provided, use default value
    if (scaleFactor === 0) {
      // Sum of all nominal values
      scaleFactor = constants.PREC['Nominal'] + 
                   constants.FLEX['Nominal'] + 
                   constants.RESL['Nominal'] + 
                   constants.TEAM['Nominal'] + 
                   constants.PMAT['Nominal'];
    }
    
    return scaleFactor;
  }
  
  /**
   * Calculate Effort Multiplier from cost drivers
   */
  _calculateEffortMultiplier(costDrivers) {
    let EM = 1.0;
    
    // Product factors
    if (costDrivers.reliability) {
      EM *= constants.RELY[costDrivers.reliability] || constants.RELY['Nominal'];
    }
    if (costDrivers.databaseSize) {
      EM *= constants.DATA[costDrivers.databaseSize] || constants.DATA['Nominal'];
    }
    if (costDrivers.documentation) {
      EM *= constants.DOCU[costDrivers.documentation] || constants.DOCU['Nominal'];
    }
    if (costDrivers.complexity) {
      EM *= constants.CPLX[costDrivers.complexity] || constants.CPLX['Nominal'];
    }
    if (costDrivers.reusability) {
      EM *= constants.RUSE[costDrivers.reusability] || constants.RUSE['Nominal'];
    }
    
    // Platform factors
    if (costDrivers.executionTimeConstraint) {
      EM *= constants.TIME[costDrivers.executionTimeConstraint] || constants.TIME['Nominal'];
    }
    if (costDrivers.storageConstraint) {
      EM *= constants.STOR[costDrivers.storageConstraint] || constants.STOR['Nominal'];
    }
    if (costDrivers.platformVolatility) {
      EM *= constants.PVOL[costDrivers.platformVolatility] || constants.PVOL['Nominal'];
    }
    
    // Personnel factors
    if (costDrivers.analystCapability) {
      EM *= constants.ACAP[costDrivers.analystCapability] || constants.ACAP['Nominal'];
    }
    if (costDrivers.programmerCapability) {
      EM *= constants.PCAP[costDrivers.programmerCapability] || constants.PCAP['Nominal'];
    }
    if (costDrivers.applicationExperience) {
      EM *= constants.APEX[costDrivers.applicationExperience] || constants.APEX['Nominal'];
    }
    if (costDrivers.platformExperience) {
      EM *= constants.PLEX[costDrivers.platformExperience] || constants.PLEX['Nominal'];
    }
    if (costDrivers.languageExperience) {
      EM *= constants.LTEX[costDrivers.languageExperience] || constants.LTEX['Nominal'];
    }
    
    // Project factors
    if (costDrivers.toolUse) {
      EM *= constants.TOOL[costDrivers.toolUse] || constants.TOOL['Nominal'];
    }
    if (costDrivers.multisiteDevelopment) {
      EM *= constants.SITE[costDrivers.multisiteDevelopment] || constants.SITE['Nominal'];
    }
    if (costDrivers.schedule) {
      EM *= constants.SCED[costDrivers.schedule] || constants.SCED['Nominal'];
    }
    
    return EM;
  }
  
  /**
   * Perform Monte Carlo risk analysis
   */
  _performMonteCarloAnalysis(size, exponent, effortMultiplier, iterations = 1000) {
    const efforts = [];
    const schedules = [];
    
    // Random variation percentages for parameters
    const sizeVariation = 0.10;  // 10% variation in size
    const emVariation = 0.15;    // 15% variation in effort multiplier
    
    for (let i = 0; i < iterations; i++) {
      // Generate random variations
      const randomSize = size * (1 + (Math.random() * 2 - 1) * sizeVariation);
      const randomEM = effortMultiplier * (1 + (Math.random() * 2 - 1) * emVariation);
      
      // Calculate with variations
      const effort = this.A * Math.pow(randomSize / 1000, exponent) * randomEM;
      efforts.push(effort);
      
      // Calculate schedule
      const schedule = 3.67 * Math.pow(effort, 0.28 + 0.2 * (exponent - 0.91));
      schedules.push(schedule);
    }
    
    // Sort results for percentiles
    efforts.sort((a, b) => a - b);
    schedules.sort((a, b) => a - b);
    
    return {
      effort: {
        min: Math.min(...efforts),
        max: Math.max(...efforts),
        mean: efforts.reduce((sum, val) => sum + val, 0) / iterations,
        median: efforts[Math.floor(iterations / 2)],
        percentile95: efforts[Math.floor(iterations * 0.95)]
      },
      schedule: {
        min: Math.min(...schedules),
        max: Math.max(...schedules),
        mean: schedules.reduce((sum, val) => sum + val, 0) / iterations,
        median: schedules[Math.floor(iterations / 2)],
        percentile95: schedules[Math.floor(iterations * 0.95)]
      }
    };
  }
}

module.exports = CocomoCalculator;