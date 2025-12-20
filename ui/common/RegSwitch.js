import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useState } from 'react';
import { default as UISwitch } from '@material-ui/core/Switch';

// eslint-disable-next-line react/display-name
const Switch = React.forwardRef(
  ({ onChange, onBlur, id, name, label, value = false }, ref) => {
    const [state, setState] = useState(value);

    const handleChange = (event) => {
      setState(event.target.checked);
      onChange(event);
    };

    return (
      <FormGroup ref={ref} row>
        <FormControlLabel
          control={
            <UISwitch
              id={id}
              onBlur={onBlur}
              checked={state}
              onChange={handleChange}
              name={name}
              color="primary"
            />
          }
          label={label}
        />
      </FormGroup>
    );
  },
);

export default Switch;
