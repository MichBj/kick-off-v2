import { default as UIPaper } from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  measures: { padding: 15, marginBottom: 10 },
}));

const Paper = ({ children }) => {
  const classes = useStyles();

  return (
    <UIPaper variant="outlined" elevation={1} className={classes.measures}>
      {children}
    </UIPaper>
  );
};

export default Paper;
