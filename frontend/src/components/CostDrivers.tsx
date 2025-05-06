import React from 'react';
import Dropdown from './Dropdown';
import { CostDrivers as CostDriversType, DropdownOption } from '../models/types';

interface CostDriversProps {
  drivers: Record<string, string[]>;
  onChange: (name: string, value: string) => void;
  values?: CostDriversType;
}

const CostDrivers: React.FC<CostDriversProps> = ({ drivers, onChange, values = {} }) => {
  // Map driver keys to user-friendly names
  const driverLabels: Record<string, string> = {
    // Product Factors
    'reliability': 'Required Software Reliability',
    'databaseSize': 'Database Size',
    'complexity': 'Product Complexity',
    'reusability': 'Developed for Reusibility',
    'documentation': 'Documentation Match to Lifecycle',
    
    // Platform Factors
    'executionTimeConstraint': 'Execution Time Constraint',
    'storageConstraint': 'Storage Constraint',
    'platformVolatility': 'Platform Volatility',
    
    // Personnel Factors
    'analystCapability': 'Analyst Capability',
    'programmerCapability': 'Programmer Capability',
    'applicationExperience': 'Application Experience',
    'platformExperience': 'Platform Experience',
    'languageExperience': 'Language and Tooiset Experience',
    
    // Project Factors
    'toolUse': 'Use of Software Tools',
    'multisiteDevelopment': 'Multisite Development',
    'schedule': 'Required Development Schedule'
  };
  
  // Group drivers by category for the layout
  const driverGroups: Record<string, string[]> = {
    'Product Factors': [
      'reliability', 'databaseSize', 'complexity', 
      'reusability', 'documentation'
    ],
    'Platform Factors': [
      'executionTimeConstraint', 'storageConstraint', 'platformVolatility'
    ],
    'Personnel Factors': [
      'analystCapability', 'programmerCapability', 
      'applicationExperience', 'platformExperience', 'languageExperience'
    ],
    'Project Factors': [
      'toolUse', 'multisiteDevelopment', 'schedule'
    ]
  };
  
  return (
    <div className="cost-drivers-section">
      {Object.entries(driverGroups).map(([groupName, driverIds]) => (
        <div key={groupName} className="driver-group">
          <h4>{groupName}</h4>
          <div className="drivers-grid">
            {driverIds.map(driverId => {
              if (!drivers[driverId]) return null;
              
              // Convert options to DropdownOption format
              const dropdownOptions: DropdownOption[] = drivers[driverId].map(option => ({
                value: option,
                label: option
              }));
              
              // Get current value or default to Nominal
              const currentValue = values[driverId as keyof CostDriversType] || 'Nominal';
              
              return (
                <div key={driverId} className="driver-select">
                  <Dropdown
                    label={driverLabels[driverId] || driverId}
                    options={dropdownOptions}
                    value={currentValue}
                    onChange={(value) => onChange(driverId, value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CostDrivers;