import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { page as pageHandler } from '@lib/page';
import { has, isEmpty, isEqual, pickBy } from 'lodash';
import { filterOperator } from '@lib/datagrid';
import { Table, Input, Button, Space } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectDefaultFilter, add } from '@redux/reducers/filterSlice';
import { useDispatch } from 'react-redux';

const FILTER = {
  active: [true, false],
  count: true,
};

const parseColumns = (columns) => {
  if (!columns) return [];
  return columns.filter((item) => !item.hide);
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
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnList] = useState(parseColumns(columns));
  const [searchFilters, setSearchFilters] = useState(
    historyFilter?.searchFilters || {},
  );
  const searchInput = useRef(null);
  const [filter, setFilter] = useState(
    pickBy({
      ...FILTER,
      take: pageSize,
      skip: (page - 1) * pageSize,
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
      let _page = (historyFilter?.data?.skip || 0) / pageSize + 1;
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
      skip: (page - 1) * pageSize,
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

  // Función para manejar la búsqueda/filtrado
  const handleSearch = (field, value, confirm) => {
    confirm && confirm();
    setSearchFilters((prev) => ({ ...prev, [field]: value }));

    // Construir el filtro de búsqueda
    const searchFilter = filterHandler
      ? filterHandler(field, value, { code: 'contains' })
      : { [field]: { contains: value, mode: 'insensitive' } };

    setFilterModel((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []).filter((item) => item.columnField !== field),
        { columnField: field, operatorValue: 'contains', value },
      ],
    }));
    setPage(1);
  };

  // Función para limpiar filtro
  const handleReset = (field, clearFilters) => {
    clearFilters && clearFilters();
    setSearchFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
    setFilterModel((prev) => ({
      ...prev,
      items: (prev.items || []).filter((item) => item.columnField !== field),
    }));
    setPage(1);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchFilters({});
    setFilterModel({ items: [] });
    setPage(1);
  };

  // Función para generar props de búsqueda en columnas
  const getColumnSearchProps = (column) => {
    if (column.filterable === false) return {};

    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 12, minWidth: 220 }}>
          <Input
            ref={searchInput}
            placeholder={`Buscar ${column.headerName || column.field}`}
            value={selectedKeys[0] || searchFilters[column.field] || ''}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(column.field, selectedKeys[0], confirm)
            }
            style={{ marginBottom: 8, display: 'block', borderRadius: 6 }}
            allowClear
          />
          <Space>
            <Button
              onClick={() =>
                handleSearch(column.field, selectedKeys[0], confirm)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
                background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                borderColor: '#1677ff',
                color: '#ffffff',
                borderRadius: 6,
                fontWeight: 500,
              }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => handleReset(column.field, clearFilters)}
              size="small"
              style={{ width: 90, borderRadius: 6 }}
            >
              Limpiar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: searchFilters[column.field] ? '#1677ff' : undefined,
            fontSize: 14,
          }}
        />
      ),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    };
  };

  const tableColumns = columnList.map((column) => ({
    key: column.field,
    dataIndex: column.field,
    title: column.headerName || column.field,
    align: column.align,
    width: column.width,
    sorter: !!column.sortable,
    ...getColumnSearchProps(column),
    render: (value, record) =>
      column.renderCell
        ? column.renderCell({ row: record, value, id: record.id })
        : value,
  }));

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.keys(searchFilters).length > 0;

  // Mostrar los filtros activos como tags
  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;

    const activeFiltersList = Object.entries(searchFilters).map(
      ([field, value]) => {
        const column = columnList.find((c) => c.field === field);
        return {
          field,
          label: column?.headerName || field,
          value,
        };
      },
    );

    return (
      <div
        style={{
          marginBottom: 12,
          padding: '8px 12px',
          background: '#f0f5ff',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span style={{ color: '#1677ff', fontWeight: 500, marginRight: 4 }}>
          <FilterOutlined /> Filtros activos:
        </span>
        {activeFiltersList.map((filter) => (
          <span
            key={filter.field}
            style={{
              background: '#ffffff',
              border: '1px solid #1677ff',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <strong>{filter.label}:</strong> {filter.value}
            <CloseCircleOutlined
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
              onClick={() => handleReset(filter.field)}
            />
          </span>
        ))}
        <Button
          size="small"
          onClick={clearAllFilters}
          style={{
            marginLeft: 'auto',
            borderRadius: 4,
            fontSize: 12,
          }}
          icon={<CloseCircleOutlined />}
        >
          Limpiar todos
        </Button>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {renderActiveFilters()}
      <Table
        rowKey="id"
        dataSource={data}
        columns={tableColumns}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total: rowCount,
          showSizeChanger: true,
          pageSizeOptions: [10, 15, 20],
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage);
            if (nextPageSize) setPageSize(nextPageSize);
          },
        }}
        onChange={(pagination, _filters, sorter) => {
          if (sorter?.field && sorter?.order) {
            setSortModel([
              {
                field: sorter.field,
                sort: sorter.order === 'ascend' ? 'asc' : 'desc',
              },
            ]);
          } else {
            setSortModel([]);
          }
        }}
        size="middle"
        scroll={{ x: '100%' }}
        style={{ width: '100%' }}
        tableLayout="fixed"
      />
    </div>
  );
};

export default DataGridServer;
