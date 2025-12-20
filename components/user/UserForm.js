import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Title from '@ui/common/Title';
import Paper from '@ui/common/Paper';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import Switch from '@ui/common/Switch';
import { useState, useEffect, useCallback } from 'react';
import { deburr } from 'lodash';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useForm, useWatch, useFormState } from 'react-hook-form';
import { resolver } from '@validations/user.resolver';
import { userService } from '@services/user.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';
import { page } from '@lib/page';
import { ldapOuService } from '@services/ldapOu.service';
import { parameterService } from '@services/parameter.service';
import { ldapGroupService } from '@services/ldapGroup.service';
import { roleService } from '@services/role.service';
import { validateDni } from '@helper/dni';
import { trim } from 'lodash';

const defaultValues = (record) => {
  return {
    dni: record.Person?.dni || '',
    firstName: record.Person?.firstName || '',
    lastName: record.Person?.lastName || '',
    name: record.Person?.name || '',
    displayName: record.Person?.name || '',
    username: record.username?.split('@')[0] || '',
    email: record.username || '',
    personalEmail: record.Person?.email || '',
    mobile: record.Person?.mobile || '',
    ldapOUId: record.ldapOUId,
    accountTypeId: record.accountTypeId,
    campusId: record.campusId,
    ldapGroups:
      record.ldapGroups
        ?.filter((item) => item.active)
        .map((item) => item.ldapGroupId) || [],
    roles:
      record.roles?.filter((item) => item.active).map((item) => item.roleId) ||
      [],
    schedules:
      record.schedules
        ?.filter((item) => item.active)
        .map((item) => item.scheduleId) || [],
  };
};

const UserForm = ({ record }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState({});
  const [person, setPerson] = useState(record.Person || {});
  const [personFound, setPersonFound] = useState(!!record.id);
  const [isDni, setIsDni] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset, control, setValue } = useForm({
    resolver,
    defaultValues: defaultValues(record),
  });
  const { errors, isDirty, dirtyFields } = useFormState({
    control,
  });

  const firstName = useWatch({ control, name: 'firstName', defaultValue: '' });
  const lastName = useWatch({ control, name: 'lastName', defaultValue: '' });
  const username = useWatch({ control, name: 'username', defaultValue: '' });
  const dni = useWatch({ control, name: 'dni', defaultValue: '' });

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => {
        setValue('checkDni', true, { shouldDirty: true });
        setLoading(true);
        setInstitution(await userService.getInstitution());
      },
      () => setLoading(false),
    );
  }, [enqueueSnackbar, setValue]);

  useEffect(() => {
    if (!institution.id) return;
    setName();
    setUsername();
  }, [person, institution, setName, setUsername]);

  const findPerson = (event) => {
    if (loading) return;
    const dni = event?.target?.value;
    if (!dni) return;
    page.loader(
      enqueueSnackbar,
      async () => {
        if (isDni && !validateDni(dni)) throw 'Cédula no válida';
        setLoading(true);
        setPersonFound(false);
        //await userService.getPersonByDniOnLDap(dni);
        const person = await userService.getUniquePersonByDni(dni);
        setPersonFound(true);
        if (person.id) {
          setValue('firstName', person.firstName || '', { shouldDirty: true });
          setValue('lastName', person.lastName || '', { shouldDirty: true });
          setValue('name', person.name || '', { shouldDirty: true });
          setPerson(person);
        }
      },
      () => setLoading(false),
      () => setValue('dni', '', { shouldDirty: true }),
    );
  };

  const onBlurUsername = () => {
    setEmail();
  };

  const setEmail = useCallback(
    (_username) => {
      const email = `${_username || username}${institution.Ldap.domain}`;
      setValue('email', email, { shouldDirty: true });
    },
    [institution, setValue, username],
  );

  const setUsername = useCallback(() => {
    const _firstName = firstName || person?.firstName || '';
    const _lastName = lastName || person?.lastName || '';
    if (!(_firstName && _lastName)) return;
    let [name, secondName] = _firstName?.split(' ') || [];
    let [surname, secondSurName] = _lastName?.split(' ') || [];
    const first = name?.slice(0, 1) || '';
    const second = secondName?.slice(0, 1) || '';
    const third = secondSurName?.slice(0, 1) || '';
    let username = `${first}${second}.${surname}${third}`;
    username = deburr(username).toLowerCase();
    setValue('username', username, { shouldDirty: true });
    setEmail(username);
  }, [firstName, lastName, person, setEmail, setValue]);

  const setName = useCallback(() => {
    const first = firstName?.toUpperCase() || person?.firstName || '';
    const last = lastName?.toUpperCase() || person?.lastName || '';
    if (!(first && last)) return;
    const name = trim(`${first} ${last}`);
    setValue('name', name);
    setValue('displayName', name, { shouldDirty: true });
  }, [firstName, lastName, person, setValue]);

  const onChangeName = () => {
    setName();
    setUsername();
  };

  const onChangeCheckDni = (event) => {
    setIsDni(event.target.checked);
    if (!event.target.checked) return;
    if (!dni) return;
    if (!validateDni(dni)) {
      setValue('dni', '', { shouldDirty: true });
      snackbar.error(enqueueSnackbar, 'Cédula no válida');
    }
  };

  const onSubmit = async (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: userService,
      router,
      dirtyFields,
      enqueueSnackbar,
      reset,
      setLoading,
      defaultHandler: defaultValues,
    });
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper>
          <Grid item container spacing={1} xs={12}>
            <Grid item container xs={12} sm={8} md={8} lg={10} xl={10}>
              <Title title="Datos del Sistema" />
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={4}
              md={4}
              lg={2}
              xl={2}
              justifyContent="flex-end"
            >
              {!record.id && (
                <Switch
                  id="checkDni"
                  control={control}
                  label="Validar cédula"
                  checked={isDni}
                  justifyContent="flex-end"
                  onChange={onChangeCheckDni}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="dni"
                label="Cédula/Pasaporte/Código"
                disabled={loading || !!record.id}
                errors={errors.dni}
                onBlur={findPerson}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="firstName"
                label="Nombres"
                disabled={loading || !!person.id || !personFound}
                errors={errors.firstName}
                onBlur={onChangeName}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="lastName"
                label="Apellidos"
                disabled={loading || !!person.id || !personFound}
                errors={errors.lastName}
                onBlur={onChangeName}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="name"
                label="Nombre completo"
                disabled={true}
                errors={errors.name}
                shrink={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="username"
                label="Nombre de usuario"
                disabled={loading || !!person.id || !personFound}
                errors={errors.username}
                onBlur={onBlurUsername}
                shrink={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="personalEmail"
                label="Correo personal"
                disabled={loading || !personFound}
                errors={errors.personalEmail}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="mobile"
                label="Celular"
                disabled={loading || !personFound}
                errors={errors.mobile}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <Select
                control={control}
                id="campusId"
                label="Campus"
                records={institution?.campus || []}
                disabled={loading || !personFound}
                errors={errors.campusId}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <Select
                control={control}
                id="roles"
                label="Roles"
                url="/base/config/roles"
                disabled={loading || !personFound}
                errors={errors.roles}
                service={roleService}
                multiple={true}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Title title={`Active Directory: ${institution.name || ''}`} />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="displayName"
                label="Nombre para mostrar"
                disabled={loading || !personFound}
                errors={errors.displayName}
                shrink={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                control={control}
                id="email"
                label="Correo institucional"
                disabled={true}
                errors={errors.email}
                shrink={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <Select
                control={control}
                id="ldapOUId"
                label="Unidad Organizativa"
                displayLabel="displayName"
                disabled={loading || !personFound}
                errors={errors.ldapOUId}
                service={ldapOuService}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <Select
                control={control}
                id="accountTypeId"
                label="Tipo de cuenta"
                disabled={loading || !personFound}
                errors={errors.accountTypeId}
                dataHandler={async () =>
                  await parameterService.getByKey('lsta')
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Select
                control={control}
                id="ldapGroups"
                label="Grupos"
                disabled={loading || !personFound}
                errors={errors.ldapGroups}
                service={ldapGroupService}
                multiple={true}
              />
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={1} justifyContent="flex-end">
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <Button
              type="submit"
              size="medium"
              fullWidth
              variant="contained"
              color="primary"
              align="center"
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default UserForm;
