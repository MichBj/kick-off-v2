import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Controller } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& > * + *': {
      marginTop: theme.spacing(3),
      minWidth: 100,
    },
  },
}));

const Select = ({
  id,
  data,
  label,
  defaultValue,
  margin = 'dense',
  errors,
  size = 'small',
  disabled = false,
  control,
}) => {
  const [value, setValue] = useState(defaultValue);
  const classes = useStyles();
  return (
    <div className={classes.formControl}>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Autocomplete
            id="controllable-states-demo"
            value={value}
            disabled={disabled}
            onChange={(event, newValue) => {
              setValue(newValue);
              field.onChange([newValue]);
            }}
            options={data}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name || ' '}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                size={size}
                margin={margin}
                variant="outlined"
                helperText={errors}
                error={!!errors}
              />
            )}
          />
        )}
      />
    </div>
  );
};
export default Select;
