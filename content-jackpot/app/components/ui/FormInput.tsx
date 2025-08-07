'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'url' | 'number' | 'date' | 'datetime-local' | 'textarea';
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  tooltip,
  error,
  value,
  onChange,
  className = '',
  min,
  max,
  step,
  rows = 3,
}: FormInputProps) {
  const inputProps = {
    id: name,
    name,
    placeholder,
    value,
    onChange,
    className: `input w-full ${error ? 'border-red-500' : ''} ${className}`,
    min,
    max,
    step,
  };

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
      
      {type === 'textarea' ? (
        <textarea
          {...inputProps}
          rows={rows}
        />
      ) : (
        <input
          {...inputProps}
          type={type}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
