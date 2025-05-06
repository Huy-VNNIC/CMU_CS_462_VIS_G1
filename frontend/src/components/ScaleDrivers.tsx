import React from 'react';
import Dropdown from './Dropdown';
import { ScaleDrivers as ScaleDriversType, DropdownOption } from '../models/types';

interface ScaleDriversProps {
  drivers: Record<string, string[]>;
  onChange: (name: string, value: string) => void;
  values?: ScaleDriversType;
}

const ScaleDrivers: React.FC<ScaleDriversProps> = ({ drivers, onChange, values = {} }) => {
  // Map driver keys to user-friendly labels
  const driverLabels: Record<string, string> = {
    'precedentedness': 'Precedentedness',
    'developmentFlexibility': 'Development Flexibility',
    'architectureResolution': 'Architecture / Risk Resolution',
    'teamCohesion': 'Team Cohesion',
    'processMaturiy': 'Process Maturity'
  };
  
  return (
    <div className="scale-drivers-section">
      <div className="drivers-grid">
        {Object.entries(drivers).map(([driverId, options]) => {
          // Convert options to DropdownOption format
          const dropdownOptions: DropdownOption[] = options.map(option => ({
            value: option,
            label: option
          }));
          
          // Get current value or default to Nominal
          const currentValue = values[driverId as keyof ScaleDriversType] || 'Nominal';
          
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
  );
};

export default ScaleDrivers;