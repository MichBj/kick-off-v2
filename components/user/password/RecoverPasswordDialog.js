import Stack from '@mui/material/Stack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const RecoverPasswordDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Recuperación de contraseña
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Se ha generado un enlace de recuperación y se ha enviado a su correo
            electrónico registrado, por favor acceda al enlace y siga los pasos
            indicados para recuperar su contraseña
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button
              size="medium"
              variant="contained"
              color="default"
              onClick={props.onClose}
              fullWidth
            >
              Cerrar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecoverPasswordDialog;
