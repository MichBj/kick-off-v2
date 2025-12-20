import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    'z-index': 1,
    position: 'fixed',
    width: '200%',
    marginLeft: '-10%',
    height: '300vh',
    marginTop: '-150vh',
    background: 'black',
    opacity: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonProgress: {
    color: 'white',
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -28,
  },
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress
        size={60}
        thickness={7}
        className={classes.buttonProgress}
      />
    </div>
  );
};

export default Loading;
