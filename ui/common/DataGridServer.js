import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { page as pageHandler } from '@lib/page';
import { has, isEmpty, isEqual, pickBy } from 'lodash';
import { filterOperator } from '@lib/datagrid';
import {
  esES,
  //GridToolbar,
  DataGrid as UIDataGrid,
  getGridStringOperators,
  getGridDateOperators,
  getGridNumericColumnOperators,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  //GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectDefaultFilter, add } from '@redux/reducers/filterSlice';
import { useDispatch } from 'react-redux';

const FILTER = {
  active: [true, false],
  count: true,
};

const OPERATOR_HANDLERS = {
  string: getGridStringOperators,
  number: getGridNumericColumnOperators,
  date: getGridDateOperators,
  dateTime: getGridDateOperators,
};

const getOperators = (type) => {
  if (!type) return getGridStringOperators();
  const handler = OPERATOR_HANDLERS[type];
  if (handler) return handler();
};

const parseColumns = (columns) => {
  if (!columns) return [];
  return columns
    .filter((item) => !(has('filter') && !item.filterable))
    .map((item) => {
      const operators = getOperators(item.type);
      if (!operators) return item;
      return {
        ...item,
        filterOperators: operators.filter(({ value }) => {
          return !['isEmpty', 'isNotEmpty'].includes(value);
        }),
      };
    });
};

const DataGridServer = ({
  where = {},
  orderBy,
  service,
  columns,
  parseHandler,
  sortHandler,
  filterHandler,
  isExport = false,
  roles,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const historyFilter = useSelector(selectDefaultFilter);
  const [dirty, setDirty] = useState(false);
  const [pageChecked, setPageChecked] = useState(false);
  const [defaultWhere] = useState(where);
  const [rowCount, setRowCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnList] = useState(parseColumns(columns));
  const [filter, setFilter] = useState(
    pickBy({
      ...FILTER,
      take: pageSize,
      skip: page * pageSize,
      filter: defaultWhere,
      orderby: orderBy,
      ...(historyFilter?.route === router.route
        ? historyFilter?.data || {}
        : {}),
    }),
  );
  const [lastFilter, setLastFilter] = useState({});
  const [filterModel, setFilterModel] = useState(
    historyFilter?.filterModel || {},
  );
  const [sortModel, setSortModel] = useState(historyFilter?.sortModel || []);
  const { enqueueSnackbar } = useSnackbar();

  const sortBy = useCallback(() => {
    if (isEmpty(sortModel)) return;
    return sortModel.map((item) => {
      const sort = sortHandler ? sortHandler(item.field, item.sort) : null;
      if (sort) return sort;
      return { [item.field]: item.sort };
    });
  }, [sortModel, sortHandler]);

  const filterBy = useCallback(() => {
    if (isEmpty(filterModel?.items)) return;
    return filterModel.items.map((item) => {
      const operator = filterOperator(item.operatorValue);
      if (!['isEmpty', 'isNotEmpty'].includes(operator?.code) && !item.value)
        return {};
      const filter = filterHandler
        ? filterHandler(item.columnField, item.value, operator)
        : null;
      if (filter) return filter;
      return operator.handler({
        field: item.columnField,
        operator,
        value: item.value,
      });
    })[0];
  }, [filterModel, filterHandler]);

  const parseHistoryFilter = useCallback(() => {
    if (dirty) return {};
    if (historyFilter?.route !== router.route) return {};
    return historyFilter?.data || {};
  }, [dirty, historyFilter, router]);

  useEffect(() => {
    if (!pageChecked && historyFilter?.route === router.route) {
      let _page = (historyFilter?.data?.skip || 0) / pageSize;
      if (_page === 1) _page = 1;
      setPageChecked(true);
      setPage(_page);
      return;
    }
    const sort = sortBy();
    const filters = filterBy();
    const params = pickBy({
      ...FILTER,
      take: pageSize,
      skip: page * pageSize,
      orderby: orderBy,
      ...parseHistoryFilter(),
    });
    if (!isEmpty(sort)) params.orderby = sort;
    if (!isEmpty(filters)) params.filter = { ...filters, ...defaultWhere };
    else if (!isEmpty(defaultWhere)) params.filter = defaultWhere;
    const updateFilter = () => {
      if (!isEqual(historyFilter?.data, params)) {
        dispatch(
          add({ route: router.route, data: params, filterModel, sortModel }),
        );
      }
    };
    if (!isEqual(filter, params)) {
      setFilter(params);
      updateFilter();
    }
    if (!dirty) setDirty(true);
  }, [
    page,
    pageSize,
    sortBy,
    filterBy,
    defaultWhere,
    dirty,
    dispatch,
    historyFilter,
    pageChecked,
    parseHistoryFilter,
    router,
    filterModel,
    sortModel,
    orderBy,
    filter,
  ]);

  useEffect(() => {
    if (loading || isEqual(filter, lastFilter)) return;
    setLoading(true);
    pageHandler.loader(
      enqueueSnackbar,
      async () => {
        const response = await service.getAll(filter);
        const data = parseHandler ? parseHandler(response.data) : response.data;
        setData(data);
        setRowCount(response.count);
        setLastFilter(filter);
      },
      () => setLoading(false),
      () => setData([]),
    );
  }, [enqueueSnackbar, filter, service, lastFilter, parseHandler, loading]);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  };

  return (
    <UIDataGrid
      rows={data}
      columns={columnList}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      pagination
      autoHeight
      sortModel={sortModel}
      sortingMode="server"
      onSortModelChange={(model) => setSortModel(model)}
      paginationMode="server"
      rowCount={rowCount}
      filterMode="server"
      onFilterModelChange={(model) => setFilterModel(model)}
      loading={loading}
      page={page}
      rowsPerPageOptions={[10, 15, 20]}
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      onPageChange={(newPage) => setPage(newPage)}
      components={{ Toolbar: CustomToolbar }}
    />
  );
};

export default DataGridServer;
