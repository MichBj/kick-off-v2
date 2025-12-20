import { Input } from 'antd';
import { Controller } from 'react-hook-form';

const { TextArea, Password } = Input;

const TextField = ({
  disabled = false,
  value,
  id,
  label,
  control,
  type,
  multiline,
  rows,
  variant = 'outlined',
  size = 'middle',
  fullWidth = true,
  margin = 'dense',
  onBlur,
  onChange,
  errors,
  shrink,
  uppercase = false,
  readOnly = false,
}) => {
  const inputStyle = {
    textTransform: uppercase ? 'uppercase' : 'none',
    width: fullWidth ? '100%' : 'auto',
    marginBottom: margin === 'dense' ? 8 : margin === 'normal' ? 16 : 0,
  };

  const containerStyle = {
    marginBottom: errors?.message ? 24 : 0,
  };

  const InputComponent = type === 'password' ? Password : multiline ? TextArea : Input;

  return (
    <div style={containerStyle}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            marginBottom: 4,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <InputComponent
            id={id}
            value={field.value || value}
            name={field.name}
            ref={field.ref}
            onChange={(event) => {
              if (onChange) onChange(event);
              field.onChange(event);
            }}
            onBlur={(event) => {
              if (onBlur) onBlur(event);
              field.onBlur(event);
            }}
            disabled={disabled}
            readOnly={readOnly}
            type={type !== 'password' ? type : undefined}
            rows={rows}
            size={size}
            style={inputStyle}
            status={errors ? 'error' : ''}
          />
        )}
      />
      {errors?.message && (
        <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>
          {errors.message}
        </div>
      )}
    </div>
  );
};

export default TextField;
