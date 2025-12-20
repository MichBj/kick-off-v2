import { Grid } from '@material-ui/core';

const Container = ({ children }) => {
  return (
    <Grid item container justifyContent="space-between" xs={12} spacing={1}>
      {children}
    </Grid>
  );
};

export default Container;
