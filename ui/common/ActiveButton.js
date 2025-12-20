import Button from '@material-ui/core/Button';
import Spinner from '@ui/common/Spinner';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useState } from 'react';
import { useEffect } from 'react';

const useStyles = makeStyles(() => ({
  container: {
    width: 100,
  },
}));

const defineColor = (state) => {
  return state ? 'primary' : 'default';
};

const defineLabel = (state) => {
  if (state) {
    if (isMobile) return <DeleteIcon />;
    return 'Activado';
  }
  if (isMobile) return <RestoreFromTrashIcon />;
  return 'Desactivado';
};

const ActiveButton = ({
  rowId,
  active,
  service,
  access,
  apiHandler,
  fullWidth = true,
}) => {
  const classes = useStyles();
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState();
  const [label, setLabel] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const change = async () => {
    setLoading(true);
    try {
      if (apiHandler) {
        await apiHandler(rowId, !state);
      } else {
        if (state) await service.deactivate(rowId);
        else await service.activate(rowId);
      }
      setState(!state);
      if (state) snackbar.error(enqueueSnackbar, 'Desactivado');
      else snackbar.success(enqueueSnackbar, 'Activado');
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setState(active);
  }, [active]);

  useEffect(() => {
    setColor(defineColor(state));
    setLabel(defineLabel(state));
  }, [state]);

  if (!rowId) return <></>;

  const divStyles = () => {
    if (!isMobile) return classes.container;
  };

  return (
    <div className={divStyles()}>
      <Button
        size="small"
        variant="contained"
        fullWidth={fullWidth}
        color={color}
        disabled={
          loading ||
          (access && ((!access?.write && !state) || (!access?.remove && state)))
        }
        onClick={change}
      >
        {loading && <Spinner />}
        {label}
      </Button>
    </div>
  );
};

export default ActiveButton;
