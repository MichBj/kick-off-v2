import { Switch as AntSwitch, Row, Col } from 'antd';
import { Controller } from 'react-hook-form';
import { useState } from 'react';

const Switch = ({
  id,
  control,
  label,
  color = 'primary',
  justifyContent = 'flex-start',
  checked,
  onBlur,
  onChange,
}) => {
  const [state, setState] = useState(checked);

  const justifyContentMap = {
    'flex-start': 'start',
    'flex-end': 'end',
    'center': 'center',
    'space-between': 'space-between',
  };

  return (
    <Row
      align="middle"
      justify={justifyContentMap[justifyContent] || 'start'}
      style={{ height: '100%' }}
    >
      <Col>
        <Controller
          name={id}
          control={control}
          render={({ field }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AntSwitch
                id={id}
                checked={state}
                onChange={(checked) => {
                  const event = { target: { checked } };
                  if (onChange) onChange(event);
                  setState(checked);
                  field.onChange(event);
                }}
                onBlur={(event) => {
                  if (onBlur) onBlur(event);
                  field.onBlur(event);
                }}
              />
              {label && <span>{label}</span>}
            </div>
          )}
        />
      </Col>
    </Row>
  );
};

export default Switch;
