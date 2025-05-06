import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  min,
  max,
  step
}) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default InputGroup;