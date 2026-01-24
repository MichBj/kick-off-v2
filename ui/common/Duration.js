import React from 'react';
import { InputNumber, Space } from 'antd';
import { Controller } from 'react-hook-form';

export const secondsToHMS = (secs) => {
  const s = Number(secs) || 0;
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { hours, minutes, seconds };
};

export const hmsToSeconds = ({ hours = 0, minutes = 0, seconds = 0 }) => {
  const h = Number(hours) || 0;
  const m = Number(minutes) || 0;
  const s = Number(seconds) || 0;
  return h * 3600 + m * 60 + s;
};

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 500,
};

const containerStyle = (hasError) => ({
  marginBottom: hasError ? 24 : 0,
});

const Duration = ({
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
  const groupStyle = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    width: fullWidth ? '100%' : 'auto',
  };

  const inputStyle = { width: 80 };

  return (
    <div style={containerStyle(Boolean(errors?.message))}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}

      <Controller
        name={id}
        control={control}
        render={({ field }) => {
          const current =
            typeof field.value === 'number'
              ? field.value
              : typeof value === 'number'
              ? value
              : 0;

          const { hours, minutes, seconds } = secondsToHMS(current);

          const setPart = (part, v) => {
            if (readOnly || disabled) return;
            const newVals = { hours, minutes, seconds, [part]: Number(v) || 0 };
            const total = hmsToSeconds(newVals);
            if (onChange) onChange(total);
            field.onChange(total);
          };

          return (
            <div style={groupStyle}>
              <Space align="center">
                <InputNumber
                  id={`${id}_hours`}
                  value={hours}
                  min={0}
                  style={inputStyle}
                  onChange={(v) => setPart('hours', v)}
                  disabled={disabled}
                  readOnly={readOnly}
                  size={size}
                />
                <span>h</span>

                <InputNumber
                  id={`${id}_minutes`}
                  value={minutes}
                  min={0}
                  max={59}
                  style={inputStyle}
                  onChange={(v) => setPart('minutes', v)}
                  disabled={disabled}
                  readOnly={readOnly}
                  size={size}
                />
                <span>m</span>

                <InputNumber
                  id={`${id}_seconds`}
                  value={seconds}
                  min={0}
                  max={59}
                  style={inputStyle}
                  onChange={(v) => setPart('seconds', v)}
                  disabled={disabled}
                  readOnly={readOnly}
                  size={size}
                />
                <span>s</span>
              </Space>
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

export default Duration;
