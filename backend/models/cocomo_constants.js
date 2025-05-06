/**
 * Constants for COCOMO II model
 */
module.exports = {
  // Scale Factors - Precedentedness (PREC)
  PREC: {
    'Very Low': 6.20,
    'Low': 4.96,
    'Nominal': 3.72,
    'High': 2.48,
    'Very High': 1.24,
    'Extra High': 0.00
  },
  
  // Scale Factors - Development Flexibility (FLEX)
  FLEX: {
    'Very Low': 5.07,
    'Low': 4.05,
    'Nominal': 3.04,
    'High': 2.03,
    'Very High': 1.01,
    'Extra High': 0.00
  },
  
  // Scale Factors - Architecture / Risk Resolution (RESL)
  RESL: {
    'Very Low': 7.07,
    'Low': 5.65,
    'Nominal': 4.24,
    'High': 2.83,
    'Very High': 1.41,
    'Extra High': 0.00
  },
  
  // Scale Factors - Team Cohesion (TEAM)
  TEAM: {
    'Very Low': 5.48,
    'Low': 4.38,
    'Nominal': 3.29,
    'High': 2.19,
    'Very High': 1.10,
    'Extra High': 0.00
  },
  
  // Scale Factors - Process Maturity (PMAT)
  PMAT: {
    'Very Low': 7.80,
    'Low': 6.24,
    'Nominal': 4.68,
    'High': 3.12,
    'Very High': 1.56,
    'Extra High': 0.00
  },
  
  // Cost Drivers - Product Factors
  RELY: {
    'Very Low': 0.82,
    'Low': 0.92,
    'Nominal': 1.00,
    'High': 1.10,
    'Very High': 1.26,
    'Extra High': null
  },
  
  DATA: {
    'Very Low': null,
    'Low': 0.90,
    'Nominal': 1.00,
    'High': 1.14,
    'Very High': 1.28,
    'Extra High': null
  },
  
  DOCU: {
    'Very Low': 0.81,
    'Low': 0.91,
    'Nominal': 1.00,
    'High': 1.11,
    'Very High': 1.23,
    'Extra High': null
  },
  
  CPLX: {
    'Very Low': 0.73,
    'Low': 0.87,
    'Nominal': 1.00,
    'High': 1.17,
    'Very High': 1.34,
    'Extra High': 1.74
  },
  
  RUSE: {
    'Very Low': null,
    'Low': 0.95,
    'Nominal': 1.00,
    'High': 1.07,
    'Very High': 1.15,
    'Extra High': 1.24
  },
  
  // Cost Drivers - Platform Factors
  TIME: {
    'Very Low': null,
    'Low': null,
    'Nominal': 1.00,
    'High': 1.11,
    'Very High': 1.29,
    'Extra High': 1.63
  },
  
  STOR: {
    'Very Low': null,
    'Low': null,
    'Nominal': 1.00,
    'High': 1.05,
    'Very High': 1.17,
    'Extra High': 1.46
  },
  
  PVOL: {
    'Very Low': null,
    'Low': 0.87,
    'Nominal': 1.00,
    'High': 1.15,
    'Very High': 1.30,
    'Extra High': null
  },
  
  // Cost Drivers - Personnel Factors
  ACAP: {
    'Very Low': 1.42,
    'Low': 1.19,
    'Nominal': 1.00,
    'High': 0.85,
    'Very High': 0.71,
    'Extra High': null
  },
  
  PCAP: {
    'Very Low': 1.34,
    'Low': 1.15,
    'Nominal': 1.00,
    'High': 0.88,
    'Very High': 0.76,
    'Extra High': null
  },
  
  APEX: {
    'Very Low': 1.22,
    'Low': 1.10,
    'Nominal': 1.00,
    'High': 0.88,
    'Very High': 0.81,
    'Extra High': null
  },
  
  PLEX: {
    'Very Low': 1.19,
    'Low': 1.09,
    'Nominal': 1.00,
    'High': 0.91,
    'Very High': 0.85,
    'Extra High': null
  },
  
  LTEX: {
    'Very Low': 1.20,
    'Low': 1.09,
    'Nominal': 1.00,
    'High': 0.91,
    'Very High': 0.84,
    'Extra High': null
  },
  
  // Cost Drivers - Project Factors
  TOOL: {
    'Very Low': 1.17,
    'Low': 1.09,
    'Nominal': 1.00,
    'High': 0.90,
    'Very High': 0.78,
    'Extra High': null
  },
  
  SITE: {
    'Very Low': 1.22,
    'Low': 1.09,
    'Nominal': 1.00,
    'High': 0.93,
    'Very High': 0.86,
    'Extra High': 0.80
  },
  
  SCED: {
    'Very Low': 1.43,
    'Low': 1.14,
    'Nominal': 1.00,
    'High': 1.00,
    'Very High': 1.00,
    'Extra High': null
  }
};