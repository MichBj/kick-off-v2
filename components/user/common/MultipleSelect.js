import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& > * + *': {
      marginTop: theme.spacing(3),
      minWidth: 100,
    },
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const MultipleSelect = ({
  id,
  data,
  label,
  defaultValue = [],
  size = 'small',
  margin = 'dense',
  errors,
  disabled = false,
  control,
}) => {
  const fixedOptions = [];
  const [value, setValue] = useState([...defaultValue]);
  const classes = useStyles();

  return (
    <div className={classes.formControl}>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            disabled={disabled}
            id="fixed-tags-demo"
            value={value}
            onChange={(event, newValue) => {
              setValue([
                ...fixedOptions,
                ...newValue.filter(
                  (option) => fixedOptions.indexOf(option) === -1,
                ),
              ]);
              field.onChange([
                ...fixedOptions,
                ...newValue.filter(
                  (option) => fixedOptions.indexOf(option) === -1,
                ),
              ]);
            }}
            options={data}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  key={option.name}
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
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

export default MultipleSelect;
