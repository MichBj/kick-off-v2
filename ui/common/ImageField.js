import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Image from 'next/image';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 9,
  },
  label: {
    marginTop: -10,
    marginLeft: 10,
    fontSize: 12,
  },
  labelText: {
    color: '#616161',
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5,
  },
  labelTextError: {
    color: 'red',
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5,
  },
  panel: {
    marginTop: 3,
    marginBottom: 5,
  },
  preview: {
    position: 'relative',
    height: 200,
    width: 200,
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 'calc(100% - 16px)',
  },
  actions: {
    justifyContent: 'center',
    marginTop: -20,
  },
  paperError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
  },
}));

const PLACEHOLDER = `/assets/images/image_placeholder.png`;

const ImageField = ({
  id,
  label,
  control,
  disabled,
  onBlur,
  onChange,
  errors,
  errorHandler,
  type,
}) => {
  const classes = useStyles();

  const toBase64 = async (image) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const checkSize = (size) => {
    if (!(size > 1000000)) errorHandler.clear(id);
    else {
      errorHandler.set(id, {
        type: 'onChange',
        message: 'La imagen no puede pesar mas de 1 MegaByte (MB)',
      });
    }
  };

  const onChangeImage = async (field, event) => {
    const file = event.target.files[0];
    if (!file) return;
    checkSize(file.size);

    const parsed = await toBase64(file);
    field.onChange({ target: { value: parsed } });
  };

  return (
    <Controller
      name={id}
      control={control}
      render={({ field }) => (
        <Grid className={classes.container}>
          <Paper
            variant="outlined"
            className={errors ? classes.paperError : ''}
          >
            <Grid container className={classes.label}>
              <div
                className={errors ? classes.labelTextError : classes.labelText}
              >
                {label}
              </div>
            </Grid>
            <Grid container className={classes.panel}>
              <Grid item container className={classes.preview}>
                <Image
                  src={field.value || PLACEHOLDER}
                  layout={'fill'}
                  objectFit={'contain'}
                  alt="image"
                />
              </Grid>
              <Grid item container className={classes.actions}>
                <input
                  accept={type}
                  style={{ display: 'none' }}
                  id={id}
                  type="file"
                  onChange={(event) => {
                    if (onChange) onChange(event);
                    onChangeImage(field, event);
                  }}
                  onBlur={(event) => {
                    if (onBlur) onBlur(event);
                  }}
                />
                <label htmlFor={id}>
                  {!disabled && (
                    <Button
                      color="primary"
                      size="small"
                      variant="contained"
                      component="span"
                      className={classes.button}
                    >
                      CARGAR
                    </Button>
                  )}
                </label>
              </Grid>
            </Grid>
          </Paper>
          <Grid className={classes.errorText}>{errors?.message}</Grid>
        </Grid>
      )}
    />
  );
};

export default ImageField;
