import React from 'react';
import TextField from '@material-ui/core/TextField';

const FileButton = ({ label, name, onChange, errors, accept }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Convertir el archivo a base64 y pasar el resultado al onChange
          const base64Data = Buffer.from(reader.result).toString('base64');
          const fileInfo = {
            name: file.name,
            base64Data: base64Data,
          };
          onChange(fileInfo);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error al leer el archivo:', error);
      }
    }
  };

  return (
    <TextField
      type="file"
      id={name}
      label={label}
      onChange={(event) => {
        handleFileChange(event);
      }}
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      fullWidth
      margin="dense"
      helperText={errors?.message}
      error={!!errors}
      inputProps={{ accept: accept }}
    />
  );
};

export default FileButton;
