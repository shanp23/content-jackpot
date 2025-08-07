'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export default function FormSelect({
  label,
  name,
  options,
  placeholder,
  required = false,
  tooltip,
  error,
  value,
  onChange,
  className = '',
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        {tooltip && (
          <div className="tooltip" title={tooltip}>
            <HelpCircle className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`input w-full ${error ? 'border-red-500' : ''} ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
