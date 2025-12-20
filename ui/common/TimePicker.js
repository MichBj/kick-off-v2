import TextField from '@material-ui/core/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/es';
import { Controller } from 'react-hook-form';

const TimePickerBasic = ({ label, name, control, errors, refs }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <TimePicker
            {...field}
            name={name}
            label={label}
            inputFormat="hh:mm a"
            value={field.value}
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
                fullWidth
                helperText={errors?.message}
                error={!!errors}
              />
            )}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default TimePickerBasic;
