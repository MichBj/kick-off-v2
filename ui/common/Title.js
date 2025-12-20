import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const Title = ({ children, title }) => {
  let sizes = { xs: 12, sm: 12, lg: 12 };

  if (children) {
    sizes.xs = 8;
    sizes.sm = 10;
    sizes.lg = 10;
  }

  return (
    <Grid item container direction="row" xs={12}>
      <Grid item container xs={sizes.xs} sm={sizes.sm} lg={sizes.lg}>
        <Typography variant="h6" component="div">
          {title || 'LISTA'}
        </Typography>
      </Grid>
      <Grid item container xs={4} sm={2} lg={2} justifyContent="flex-end">
        {children}
      </Grid>
    </Grid>
  );
};

export default Title;
