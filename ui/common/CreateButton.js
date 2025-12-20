import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  container: {
    width: 150,
  },
}));

const CreateButton = ({ url, children, fullWidth = true, selector }) => {
  const classes = useStyles();
  const router = useRouter();
  const access = useSelector(selector);
  if (!access.create) return <></>;

  return (
    <div className={classes.container}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => router.push(url)}
        fullWidth={fullWidth}
      >
        {children || 'CREAR'}
      </Button>
    </div>
  );
};

export default CreateButton;
