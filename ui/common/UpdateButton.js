import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  container: {
    width: 100,
  },
}));

const CreateButton = ({ url, children, state = 'draft' }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.container}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => router.push(url)}
        fullWidth={true}
        disabled={state != 'draft' ? true : false}
      >
        {children || 'MODIFICAR'}
      </Button>
    </div>
  );
};

export default CreateButton;
