import React from 'react';
import { DropdownProps } from '../models/types';

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  label,
  id 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="dropdown">
      {label && <label htmlFor={id}>{label}</label>}
      <select 
        id={id} 
        value={value} 
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;