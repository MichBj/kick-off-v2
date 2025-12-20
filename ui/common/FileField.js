import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useMemo, useCallback } from 'react';
import ViewerPDF from '@ui/common/ViewerPDF';
import { Controller } from 'react-hook-form';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
    padding: '0.2em',
  },
  preview: {
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 'calc(100% - 16px)',
  },
  actions: {
    justifyContent: 'justify',
  },
  paperError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
  },
}));

const FileField = ({
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
  const [fileName, setFileName] = useState(null);

  const toBase64 = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  const checkSize = useCallback(
    (size) => {
      if (!(size > 1000000)) errorHandler.clear(id);
      else {
        errorHandler.set(id, {
          type: 'onChange',
          message: 'El archivo no puede pesar más de 1 MegaByte (MB)',
        });
      }
    },
    [errorHandler, id],
  );

  const onChangeFile = useCallback(
    async (field, event) => {
      const file = event.target.files[0];
      checkSize(file.size);
      setFileName(file.name);
      const parsed = await toBase64(file);
      field.onChange({ target: { value: parsed } });
    },
    [checkSize, toBase64],
  );

  const fileNameMemo = useMemo(() => fileName, [fileName]);

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
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                className={classes.actions}
              >
                <input
                  accept={type}
                  style={{ display: 'none' }}
                  id={id}
                  type="file"
                  onChange={(event) => {
                    if (onChange) onChange(event);
                    onChangeFile(field, event);
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
                      SUBIR EVIDENCIA
                    </Button>
                  )}
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                className={classes.preview}
              >
                {fileNameMemo != null ? (
                  fileNameMemo
                ) : field.value === '' || field.value === null ? (
                  'Subir Archivo'
                ) : (
                  <>
                    <ViewerPDF url={field.value} />
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Grid className={classes.errorText}>{errors?.message}</Grid>
        </Grid>
      )}
    />
  );
};

export default FileField;
