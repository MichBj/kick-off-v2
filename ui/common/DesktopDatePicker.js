import TextField from '@material-ui/core/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import isWeekend from 'date-fns/isWeekend';
import 'dayjs/locale/es';
import { Controller } from 'react-hook-form';

const DesktopDatePickerBasic = ({
  label,
  name,
  control,
  disabled,
  errors,
  readOnly,
  refs,
  isWeekends = true,
  defaultValue, // Nueva prop para el valor predeterminado
}) => {
  const disableWeekend = (date) => {
    if (isWeekends && isWeekend(date)) {
      return true;
    }
    return false;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DesktopDatePicker
            {...field}
            name={name}
            label={label}
            disabled={disabled}
            value={field.value || defaultValue || null} // Usar el valor del campo, defaultValue o null
            shouldDisableDate={disableWeekend}
            onChange={(newValue) => {
              if (refs) {
                refs(newValue);
              }
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

export default DesktopDatePickerBasic;
