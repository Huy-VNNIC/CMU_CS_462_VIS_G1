import React from 'react';
import { InputFieldProps } from '../models/types';

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  readOnly = false,
  step
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        step={step}
      />
    </div>
  );
};

export default InputField;