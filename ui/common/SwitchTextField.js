import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const SwitchTextField = ({
  disabled = false,
  id,
  label,
  control,
  switchId,
  variant = 'outlined',
  size = 'small',
  margin = 'dense',
  suffix = '',
  watchValue,
  errors,
}) => {
  const [state, setState] = useState(false);

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={8} sm={10} md={10} lg={9} xl={10}>
          {state && (
            <Controller
              name={id}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id={id}
                  disabled={disabled}
                  label={label}
                  variant={variant}
                  defaultValue={`${watchValue}${suffix}`}
                  fullWidth
                  size={size}
                  margin={margin}
                  helperText={errors}
                  error={!!errors}
                />
              )}
            />
          )}
          {!state && (
            <Controller
              render={() => (
                <TextField
                  id={id}
                  value={`${watchValue}${suffix}` || ''}
                  disabled={true}
                  label={label}
                  variant={variant}
                  fullWidth
                  size={size}
                  margin={margin}
                />
              )}
              name={id}
              control={control}
            />
          )}
        </Grid>
        <Grid
          item
          container
          xs={4}
          sm={2}
          md={2}
          lg={3}
          xl={2}
          direction="column"
          justifyContent="center"
        >
          <Controller
            name={switchId}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Switch
                disabled={disabled}
                checked={state}
                onChange={(event) => {
                  field.onChange(event);
                  setState(event.target.checked);
                }}
                name="checked"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
};
export default SwitchTextField;
