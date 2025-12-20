import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  spinner: {
    color: theme.palette.primary.main,
  },
}));

const PageSpinner = ({ size, thickness }) => {
  const classes = useStyles();
  return (
    <Grid container justifyContent="center">
      <CircularProgress
        size={size || 50}
        thickness={thickness || 5}
        className={classes.spinner}
      />
    </Grid>
  );
};

export default PageSpinner;
