'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FormCheckboxProps {
  label: string;
  name: string;
  tooltip?: string;
  error?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function FormCheckbox({
  label,
  name,
  tooltip,
  error,
  checked,
  onChange,
  className = '',
}: FormCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className={`w-4 h-4 text-blue-600 bg-[#1a1a1a] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2 ${className}`}
        />
        <div className="flex items-center">
          <label htmlFor={name} className="text-sm font-medium text-white cursor-pointer">
            {label}
          </label>
          {tooltip && (
            <div className="tooltip ml-2" title={tooltip}>
              <HelpCircle className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
