import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { dates } from '@lib/dates';

const useStyles = makeStyles(() => ({
  alert: {
    paddingTop: 5,
  },
}));

const UserProfileInfo = ({ user }) => {
  const classes = useStyles();
  const createdDate = dates.toString(user?.createdDate);
  const lastPasswordDate = dates.toString(user?.lastPasswordDate);
  const dueDays = dates.dueDaysUntil(user?.lastPasswordDate, 180);

  const activeColor = () => (user?.active ? 'success' : 'error');
  const activeLabel = () => (user?.active ? 'activada' : 'desactivada');

  const passwordChangeSeverity = () => {
    if (dueDays <= 1) return 'error';
    if (dueDays <= 5) return 'warning';
    return 'info';
  };

  const showDueDays = () => {
    return !['66050', '66048'].includes(user?.AccountType?.value);
  };

  return (
    <Grid container>
      {!!user?.lastPasswordDate && showDueDays() && (
        <Grid item xs={12} className={classes.alert}>
          <Alert severity={passwordChangeSeverity()}>
            Le quedan <strong>{dueDays}</strong>{' '}
            {dueDays === 1 ? 'día' : 'días'} para cambiar su contraseña
          </Alert>
        </Grid>
      )}
      {!showDueDays() && (
        <Grid item xs={12} className={classes.alert}>
          <Alert severity="info">Su contraseña nunca expira</Alert>
        </Grid>
      )}
      <Grid item xs={12} className={classes.alert}>
        <Alert severity={activeColor()}>
          Su cuenta se encuentra {activeLabel()}
        </Alert>
      </Grid>
      <Grid item xs={12} className={classes.alert}>
        <Alert severity="info">
          La cuenta ha sido creada en la fecha: {createdDate}
        </Alert>
      </Grid>
      <Grid item xs={12} className={classes.alert}>
        <Alert severity="info">
          Su última actualización de contraseña se llevó a cabo el:{' '}
          {lastPasswordDate}
        </Alert>
      </Grid>
    </Grid>
  );
};

export default UserProfileInfo;
