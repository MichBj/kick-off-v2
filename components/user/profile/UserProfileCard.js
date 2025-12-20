import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const UserProfileCard = ({ user }) => {
  return (
    <Grid container direction="row" spacing={1}>
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        spacing={1}
      >
        <Grid item>
          <Typography variant="subtitle1" component="div">
            <b> {user?.Person?.name}</b>
          </Typography>
          <Typography variant="body2">
            <strong>{user?.email}</strong>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfileCard;
