const CocomoCalculator = require('../models/cocomo_calculator');

const calculator = new CocomoCalculator();

/**
 * Controller handling COCOMO II calculations
 */
const cocomoController = {
  /**
   * Calculate effort using the basic COCOMO II model
   */
  calculateBasic: (req, res) => {
    try {
      const { softwareSize, mode, reliability = 1, complexity = 1 } = req.body;
      
      // Validate inputs
      if (!softwareSize || !mode) {
        return res.status(400).json({
          success: false,
          error: 'Software size and mode are required'
        });
      }
      
      // Basic calculation with simplified parameters
      const result = calculator.calculateEffort({
        size: softwareSize,
        mode,
        costDrivers: {
          reliability,
          complexity
        },
        useDetailedModel: false
      });
      
      res.json({
        success: true,
        prediction: result.effort,
        schedule: result.schedule,
        teamSize: result.teamSize
      });
    } catch (error) {
      console.error('Error calculating basic COCOMO:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error calculating effort'
      });
    }
  },
  
  /**
   * Calculate effort using the detailed COCOMO II.2000 model
   */
  calculateDetailed: (req, res) => {
    try {
      const {
        size,
        sizingMethod,
        unadjustedFP,
        sced,
        rcpx,
        scaleDrivers,
        costDrivers,
        riskAnalysis
      } = req.body;
      
      // Validate inputs
      if (!size) {
        return res.status(400).json({
          success: false,
          error: 'Software size is required'
        });
      }
      
      // Detailed calculation with all parameters
      const result = calculator.calculateEffort({
        size,
        sizingMethod,
        unadjustedFP,
        sced,
        rcpx,
        scaleDrivers,
        costDrivers,
        riskAnalysis,
        useDetailedModel: true
      });
      
      res.json({
        success: true,
        result
      });
    } catch (error) {
      console.error('Error calculating detailed COCOMO:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error calculating effort'
      });
    }
  },
  
  /**
   * Get available scale drivers and cost drivers with their values
   */
  getDrivers: (req, res) => {
    try {
      const constants = require('../models/cocomo_constants');
      
      res.json({
        success: true,
        scaleDrivers: {
          precedentedness: Object.keys(constants.PREC),
          developmentFlexibility: Object.keys(constants.FLEX),
          architectureResolution: Object.keys(constants.RESL),
          teamCohesion: Object.keys(constants.TEAM),
          processMaturiy: Object.keys(constants.PMAT)
        },
        costDrivers: {
          // Product factors
          reliability: Object.keys(constants.RELY).filter(key => constants.RELY[key] !== null),
          databaseSize: Object.keys(constants.DATA).filter(key => constants.DATA[key] !== null),
          documentation: Object.keys(constants.DOCU).filter(key => constants.DOCU[key] !== null),
          complexity: Object.keys(constants.CPLX).filter(key => constants.CPLX[key] !== null),
          reusability: Object.keys(constants.RUSE).filter(key => constants.RUSE[key] !== null),
          
          // Platform factors
          executionTimeConstraint: Object.keys(constants.TIME).filter(key => constants.TIME[key] !== null),
          storageConstraint: Object.keys(constants.STOR).filter(key => constants.STOR[key] !== null),
          platformVolatility: Object.keys(constants.PVOL).filter(key => constants.PVOL[key] !== null)
        }
      });
    } catch (error) {
      console.error('Error getting COCOMO drivers:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error retrieving COCOMO drivers'
      });
    }
  }
};

module.exports = cocomoController;