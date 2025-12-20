import TextField from '@material-ui/core/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import isWeekend from 'date-fns/isWeekend';
import 'dayjs/locale/es';
import { Controller } from 'react-hook-form';

const BasicDateTimePicker = ({
  label,
  name,
  control,
  disabled,
  errors,
  readOnly,
  refs,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateTimePicker
            {...field}
            inputFormat="DD/MM/YYYY HH:mm:ss"
            name={name}
            label={label}
            disabled={disabled}
            value={field.value}
            shouldDisableDate={isWeekend}
            onChange={(newValue) => {
              refs != undefined ? refs(newValue) : null;
              field.onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                margin="dense"
                disabled={disabled}
                fullWidth
                helperText={errors?.message}
                error={!!errors}
              />
            )}
            readOnly={readOnly}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default BasicDateTimePicker;
