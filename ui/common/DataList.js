import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import CardList from '@ui/common/CardList';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InfiniteScroll from 'react-infinite-scroller';
import { Autocomplete } from '@material-ui/lab';
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { page as pageHandler } from '@lib/page';
import { isEmpty, isEqual, size, pickBy, lowerCase } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { filterOperator } from '@lib/datagrid';
import { OPERATORS } from '@lib/datagrid';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectDefaultFilter, add } from '@redux/reducers/filterSlice';
import { useDispatch } from 'react-redux';
import Loading from './Loading';

const FILTER = { active: [true, false], count: true };
const SORT = [
  { code: 'asc', name: 'Ascendente' },
  { code: 'desc', name: 'Descendente' },
];

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '90%',
    maxWidth: 400,
    height: 440,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 2, 0),
  },
  filterButton: {
    marginBottom: 10,
  },
  clearButton: {
    marginBottom: 10,
  },
  applyButton: {
    marginTop: 10,
  },
  filterDetail: {},
}));

const DataList = ({
  where = {},
  service,
  searchable,
  url,
  title,
  description,
  access,
  active,
  step = 50,
  orderBy,
  filterHandler,
  sortHandler,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const historyFilter = useSelector(selectDefaultFilter);
  const dispatch = useDispatch();
  const [defaultWhere] = useState(where);
  const [modalStyle] = useState(getModalStyle);
  const [data, setData] = useState([]);
  const [rowsLoaded, setRowsLoaded] = useState(0);
  const [filter, setFilter] = useState({
    ...FILTER,
    filter: defaultWhere,
    ...(historyFilter?.route === router.route ? historyFilter?.data || {} : {}),
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterModel, setFilterModel] = useState(
    historyFilter?.filterModel || {},
  );
  const [sortModel, setSortModel] = useState(historyFilter?.sortModel || []);
  const [operators, setOperators] = useState(OPERATORS);
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!start) return;
    load();
  }, [load, start]);

  const load = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    pageHandler.loader(
      enqueueSnackbar,
      async () => {
        const response = await service.getAll(
          pickBy({
            ...filter,
            take: step,
            skip: rowsLoaded,
            orderby: orderBy,
          }),
        );
        let newData = response.data;
        const _size = size(newData);
        setData([...data, ...newData]);
        setRowsLoaded(rowsLoaded + _size);
        if (rowsLoaded + _size >= response.count) setHasMore(false);
      },
      () => setLoading(false),
      () => setHasMore(false),
    );
  }, [
    data,
    enqueueSnackbar,
    filter,
    hasMore,
    loading,
    rowsLoaded,
    service,
    step,
    orderBy,
  ]);

  const toggleModal = () => {
    setOpen(!open);
  };

  const onCloseModal = () => {
    doApply();
    setOpen(false);
  };

  const onCancelModal = () => {
    clearFilters();
    setOpen(false);
  };

  const doApply = () => {
    const params = { ...filter };
    const sort = sortBy();
    if (!isEmpty(sort)) params.orderby = sort;
    else delete params.orderby;
    const filters = filterBy();
    if (!isEmpty(filters)) params.filter = { ...filters, ...defaultWhere };
    else params.filter = {};
    setFilter(params);
    dispatch(
      add({ route: router.route, data: params, filterModel, sortModel }),
    );
    resetData();
    toggleModal();
  };

  const resetData = () => {
    setData([]);
    setRowsLoaded(0);
    setHasMore(true);
  };

  const sortModelSize = useCallback(() => {
    return size(pickBy(sortModel, (value) => !isEmpty(value)));
  }, [sortModel]);

  const filterModelSize = useCallback(() => {
    return size(pickBy(filterModel, (value) => !isEmpty(value)));
  }, [filterModel]);

  const sortBy = useCallback(() => {
    if (sortModelSize() < 2) return {};
    const item = sortModel;
    const sort = sortHandler ? sortHandler(item.field, item.sort) : null;
    if (sort) return sort;
    return { [item.field]: item.sort };
  }, [sortModel, sortHandler, sortModelSize]);

  const filterBy = useCallback(() => {
    if (filterModelSize() < 3) return {};
    const item = filterModel;
    if (!item.value) return {};
    const operator = filterOperator(item.operator);
    const filter = filterHandler
      ? filterHandler(item.columnField.code, item.value, operator)
      : null;
    if (filter) return filter;
    return operator.handler({
      field: item.columnField.code,
      operator,
      value: item.value,
    });
  }, [filterModel, filterHandler, filterModelSize]);

  const clearFilters = () => {
    resetModels();
    resetData();
    setFilter({ ...FILTER, filter: defaultWhere });
    dispatch(
      add({
        route: router.route,
        data: { ...FILTER, filter: defaultWhere },
        filterModel,
        sortModel,
      }),
    );
  };

  const resetModels = () => {
    setFilterModel({});
    setSortModel({});
  };

  const disableApply = () => {
    const filters = pickBy(filterModel, (value) => !isEmpty(value));
    const sorts = pickBy(sortModel, (value) => !isEmpty(value));
    const emptyFilters = isEmpty(filters);
    const emptySorts = isEmpty(sorts);
    if (emptyFilters && emptySorts) return true;
    const sizeFilters = size(filters);
    const sizeSorts = size(sorts);
    return (
      (sizeFilters === 3 && sizeSorts === 1) ||
      (sizeFilters < 3 && sizeSorts < 2) ||
      (sizeFilters > 0 && sizeFilters < 3 && sizeSorts === 2)
    );
  };

  return (
    <>
      <Grid item container justifyContent="flex-start" xs={12}>
        <Button
          variant="contained"
          size="small"
          style={{ width: 100 }}
          onClick={toggleModal}
          color="primary"
          className={classes.filterButton}
        >
          Filtros
        </Button>
        {!isEqual(filter, { ...FILTER, filter: defaultWhere }) && (
          <Button
            variant="contained"
            size="small"
            style={{ width: 120 }}
            onClick={clearFilters}
            color="default"
            className={classes.clearButton}
          >
            LIMPIAR FILTROS
          </Button>
        )}
      </Grid>
      <Grid>
        {filterModelSize() === 3 && filter.filter && (
          <div>
            <strong>
              {
                searchable.find(
                  (item) => item.code === filterModel.columnField?.code,
                )?.name
              }{' '}
            </strong>
            {lowerCase(
              OPERATORS.find((item) => item.code === filterModel.operator)
                ?.name,
            )}{' '}
            <strong>&quot;{filterModel.value}&quot;</strong>
          </div>
        )}
        {sortModelSize() === 2 && filter.orderby && (
          <div>
            Ordenar por{' '}
            <strong>
              {searchable.find((item) => item.code === sortModel.field)?.name}{' '}
            </strong>
            de forma{' '}
            <strong>
              {lowerCase(
                SORT.find((item) => item.code === sortModel.sort)?.name,
              )}{' '}
            </strong>
          </div>
        )}
      </Grid>
      <InfiniteScroll
        pageStart={0}
        style={{ width: '100%' }}
        loadMore={() => {
          setStart(true);
          load();
        }}
        hasMore={hasMore}
      >
        <CardList
          rows={data}
          url={url}
          title={title}
          description={description}
          access={access}
          active={active}
        />
      </InfiniteScroll>
      {loading && <Loading />}
      <Modal
        open={open}
        onClose={onCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h3 id="simple-modal-title">FILTROS</h3>
          <Grid item container xs={12}>
            <Grid item container xs={12}>
              <Autocomplete
                onChange={(_, value) => {
                  const _operators = OPERATORS.filter((item) =>
                    item.types.includes(value.type),
                  );
                  setFilterModel({
                    ...filterModel,
                    columnField: value,
                    operator: _operators[0].code,
                  });
                  setOperators(_operators);
                }}
                disableClearable={true}
                options={searchable}
                fullWidth={true}
                disabled={loading}
                defaultValue={
                  searchable.find(
                    (item) => item.code === filterModel.columnField?.code,
                  ) || null
                }
                getOptionSelected={(option, value) =>
                  option.field === value?.field
                }
                getOptionLabel={(option) => option?.name || null}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Campo"
                    size="small"
                    margin="dense"
                    fullWidth={true}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item container xs={12}>
              <Autocomplete
                onChange={(_, value) => {
                  setFilterModel({ ...filterModel, operator: value?.code });
                }}
                disableClearable={true}
                options={operators}
                fullWidth={true}
                disabled={loading}
                getOptionSelected={(option, value) =>
                  option.field === value?.field
                }
                defaultValue={
                  OPERATORS.find(
                    (item) => item.code === filterModel.operator,
                  ) || null
                }
                getOptionLabel={(option) => option?.name || null}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operador"
                    size="small"
                    margin="dense"
                    fullWidth={true}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item container xs={12}>
              <TextField
                id="time"
                label="Valor"
                variant="outlined"
                size="small"
                type={filterModel?.columnField?.type || 'string'}
                margin="dense"
                defaultValue={filterModel.value || ''}
                onChange={(event) => {
                  setFilterModel({
                    ...filterModel,
                    value: event.target?.value,
                  });
                }}
                InputLabelProps={{
                  shrink:
                    filterModel?.columnField?.type === 'date' ||
                    !isEmpty(filterModel?.value),
                }}
                fullWidth={true}
              />
            </Grid>
          </Grid>
          <h3 id="simple-modal-title">ORDEN</h3>
          <Grid item container xs={12}>
            <Grid item container xs={12}>
              <Autocomplete
                onChange={(_, value) => {
                  setSortModel({ ...sortModel, field: value?.code });
                }}
                options={searchable}
                disableClearable={true}
                fullWidth={true}
                disabled={loading}
                getOptionSelected={(option, value) =>
                  option.code === value?.code
                }
                defaultValue={
                  searchable.find((item) => item.code === sortModel.field) ||
                  null
                }
                getOptionLabel={(option) => option?.name || ''}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Campo"
                    size="small"
                    margin="dense"
                    fullWidth={true}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item container xs={12}>
              <Autocomplete
                onChange={(_, value) => {
                  setSortModel({ ...sortModel, sort: value?.code });
                }}
                options={SORT}
                disableClearable={true}
                fullWidth={true}
                disabled={loading}
                getOptionSelected={(option, value) =>
                  option.code === value?.code
                }
                defaultValue={
                  SORT.find((item) => item.code === sortModel.sort) || null
                }
                getOptionLabel={(option) => option?.name || ''}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Orden"
                    size="small"
                    margin="dense"
                    fullWidth={true}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            spacing={1}
            className={classes.applyButton}
          >
            <Grid item container xs={6}>
              <Button
                variant="contained"
                size="medium"
                fullWidth={true}
                onClick={doApply}
                disabled={disableApply()}
                color="primary"
              >
                Aplicar
              </Button>
            </Grid>
            <Grid item container xs={6}>
              <Button
                variant="contained"
                size="medium"
                fullWidth={true}
                onClick={onCancelModal}
                color="default"
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </>
  );
};

export default DataList;
