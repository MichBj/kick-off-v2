import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Spinner from '@ui/common/Spinner';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { personService } from '@services/person.service';
import Image from 'next/image';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 9,
  },
  panel: {
    marginTop: 3,
    marginBottom: 5,
  },
  preview: {
    justifyContent: 'center',
  },
  image: {
    borderRadius: '50%',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -130,
  },
  actions: {
    justifyContent: 'center',
    marginTop: -20,
  },
  paper: {
    borderColor: 'white',
  },
  paperError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
  },
}));

const PLACEHOLDER = `/assets/images/profile.png`;

const ProfilePhoto = ({ person }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [record] = useState(person);
  const [preview, setPreview] = useState(person?.photo || PLACEHOLDER);
  const { enqueueSnackbar } = useSnackbar();

  const toBase64 = async (image) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const checkSize = (size) => {
    if (size > 2000000)
      snackbar.error(
        enqueueSnackbar,
        'La imagen no puede pesar mas de 1 MegaByte (MB)',
      );
  };

  const parsePhoto = async (event) => {
    const file = event.target.files[0];
    checkSize(file.size);
    return await toBase64(file);
  };

  const onChangeImage = async (event) => {
    if (!person) {
      snackbar.error(
        enqueueSnackbar,
        'No fue posible identificar su registro personal en el sistema ',
      );
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const photo = await parsePhoto(event);
      const result = await personService.updatePhoto(record.id, photo);
      setPreview(result.photo || PLACEHOLDER);
      snackbar.success(enqueueSnackbar, 'Foto modificada');
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid className={classes.container}>
      <Grid container className={classes.panel}>
        <Grid item container className={classes.preview}>
          <Image
            src={preview}
            width={130}
            height={130}
            alt="profile"
            className={classes.image}
          />
        </Grid>
        <Grid item container className={classes.loading}>
          {loading && <Spinner size={50} thickness={4} />}
        </Grid>
        <Grid item container className={classes.actions}>
          <input
            accept="image/jpeg, image/jpg"
            style={{ display: 'none' }}
            id="photo"
            type="file"
            onChange={(event) => {
              onChangeImage(event);
            }}
          />
          <label htmlFor="photo">
            <Button
              color="primary"
              size="small"
              variant="contained"
              component="span"
              className={classes.button}
            >
              CAMBIAR
            </Button>
          </label>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePhoto;
