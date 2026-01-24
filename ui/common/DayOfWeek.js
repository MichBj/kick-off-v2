import React from 'react';
import { Button } from 'antd';
import { Controller } from 'react-hook-form';

const days = [
  { key: 0, label: 'L' },
  { key: 1, label: 'M' },
  { key: 2, label: 'X' },
  { key: 3, label: 'J' },
  { key: 4, label: 'V' },
  { key: 5, label: 'S' },
  { key: 6, label: 'D' },
];

const DayOfWeek = ({
  disabled = false,
  value,
  id,
  label,
  control,
  size = 'middle',
  fullWidth = true,
  onBlur,
  onChange,
  errors,
  readOnly = false,
}) => {
  const containerStyle = {
    marginBottom: errors?.message ? 24 : 0,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
  };

  const groupStyle = {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}

      <Controller
        name={id}
        control={control}
        render={({ field }) => {
          const currentNumber =
            typeof field.value === 'number'
              ? field.value
              : typeof value === 'number'
              ? value
              : 0;

          const isSelected = (bit) => ((currentNumber >> bit) & 1) === 1;

          const toggleDay = (bit) => {
            if (readOnly || disabled) return;
            const newNumber = isSelected(bit)
              ? currentNumber & ~(1 << bit)
              : currentNumber | (1 << bit);
            if (onChange) onChange(newNumber);
            field.onChange(newNumber);
          };

          return (
            <div style={groupStyle}>
              {days.map((d) => (
                <Button
                  key={d.key}
                  type={isSelected(d.key) ? 'primary' : 'default'}
                  onClick={() => toggleDay(d.key)}
                  disabled={disabled}
                  size={size}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          );
        }}
      />

      {errors?.message && (
        <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 6 }}>
          {errors.message}
        </div>
      )}
    </div>
  );
};

export default DayOfWeek;
