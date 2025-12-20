import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { Card as UICard } from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    height: '100%',
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
  },
  indicator: {
    maxWidth: 'auto',
    borderLeft: '10px solid #BDCA32',
    margin: 3,
    minHeight: 100,
    height: '95%',
  },
}));

const Card = ({ menu }) => {
  const router = useRouter();
  const classes = useStyles();

  const push = () => {
    if (!menu?.Page?.url) return;
    router.push(menu.Page.url);
  };

  return (
    <UICard
      className={classes.indicator}
      onClick={() => push()}
      style={{ cursor: 'pointer' }}
    >
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar
            variant="rounded"
            aria-label="recipe"
            className={classes.icon}
          >
            <Icon className={classes.listIcon}>{menu.icon}</Icon>
          </Avatar>
        }
        title={
          <Typography variant="subtitle2">
            <b>{menu.name}</b>
          </Typography>
        }
        subheader={menu.description}
      />
    </UICard>
  );
};

export default Card;
