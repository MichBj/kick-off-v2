import { Spin } from 'antd';

const Spinner = ({ size, thickness, color }) => {
  const sizeMap = {
    small: 'small',
    default: 'default',
    large: 'large',
  };

  // Si size es un número, usar 'small' para valores <= 20, 'default' para 20-40, 'large' para > 40
  const getSize = () => {
    if (typeof size === 'number') {
      if (size <= 20) return 'small';
      if (size <= 40) return 'default';
      return 'large';
    }
    return sizeMap[size] || 'small';
  };

  return (
    <Spin
      size={getSize()}
      style={{ color: color === 'primary' ? '#1890ff' : color || 'white' }}
    />
  );
};

export default Spinner;
