import Button from '@material-ui/core/Button';

const SubmitButton = ({ onClick, disabled }) => {
  return (
    <Button
      style={{ marginTop: 10 }}
      type="submit"
      size="medium"
      fullWidth
      variant="contained"
      color="primary"
      align="center"
      onClick={onClick}
      disabled={disabled}
    >
      Guardar
    </Button>
  );
};

export default SubmitButton;
