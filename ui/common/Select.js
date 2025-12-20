import React, { useCallback } from 'react';
import { Select as AntSelect, Spin, Tag, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { isEmpty } from 'lodash';

const { Option } = AntSelect;

const parseError = (label, error) => {
  const message = error.message || error.name || JSON.stringify(error);
  return `Ocurrio un error al cargar el campo ${label}: ${message}`;
};

const Select = ({
  id,
  where = {},
  records,
  label,
  displayLabel,
  labelHandler,
  margin = 'dense',
  size = 'small',
  variant = 'outlined',
  fullWidth = true,
  disabled = false,
  errors,
  control,
  service,
  dataHandler,
  filterBy,
  multiple = false,
  exclude,
  reload = true,
  url,
  onChange,
  onBlur,
  getter,
  reloadFlag = 0,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [mouseOver, setMouseOver] = useState(false);
  const [focused, setFocused] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const selected = control._formValues[id];

  const filterData = useCallback(
    (data) => {
      return data
        .filter((item) => {
          if (item.id === selected) return true;
          if (exclude && item.id === exclude) return;
          if (item.hasOwnProperty('active') && !item.active) return;
          if (filterBy) return filterBy(item);
          return true;
        })
        .sort((a, b) => {
          // Define the order of the special words
          const specialWordsOrder = [
            'NINGUNA',
            'NINGUNO',
            'NO APLICA',
            'NO REGISTRA',
          ];
          const aName = defineName(a).toUpperCase();
          const bName = defineName(b).toUpperCase();
          if (
            specialWordsOrder.includes(aName) &&
            specialWordsOrder.includes(bName)
          ) {
            return (
              specialWordsOrder.indexOf(aName) -
              specialWordsOrder.indexOf(bName)
            );
          }
          if (specialWordsOrder.includes(aName)) return 1;
          if (specialWordsOrder.includes(bName)) return -1;
          return 0;
        });
    },
    [exclude, filterBy, selected],
  );

  const getData = useCallback(async () => {
    if (!isEmpty(records)) return records;
    if (dataHandler) return await dataHandler();
    if (service) {
      return await service.getAll({ active: [true, false], filter: where });
    }
    return [];
  }, [dataHandler, records, service]);

  const load = useCallback(async () => {
    setLoading(true);
    setSuccess(true);
    try {
      const data = await getData();
      setData(filterData(data));
    } catch (error) {
      snackbar.error(enqueueSnackbar, parseError(label, error));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filterData, getData, label, reloadFlag]);

  useEffect(() => {
    load();
  }, [records, load]);

  useEffect(() => {
    if (multiple) setValue(data.filter((item) => selected.includes(item.id)));
    else setValue(data.find((item) => item.id === selected));
  }, [data, selected, multiple]);

  const onChangeAutocomplete = (newValue, field) => {
    setValue(newValue);
    if (multiple) field.onChange(newValue.map((item) => item.id));
    else field.onChange(newValue?.id);
    if (onChange) onChange(newValue);
    if (getter) getter(newValue);
  };

  const onBlurAutocomplete = (event) => {
    if (onBlur) onBlur(event);
  };

  const defineName = (option) => {
    const _default = () => option.name || '';
    if (displayLabel) return option[displayLabel] || _default();
    if (labelHandler) return labelHandler(option);
    return _default();
  };

  const renderTagsForSelect = (props) => {
    const { label, value, closable, onClose } = props;
    const option = data.find((item) => item.id === value);
    if (!option) return null;

    const tagLabel = url ? (
      <a
        href={`${url}/${option.id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#393838', fontWeight: 'bold' }}
      >
        {defineName(option)}
      </a>
    ) : (
      <span style={{ color: '#393838', fontWeight: 'bold' }}>
        {defineName(option)}
      </span>
    );

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {tagLabel}
      </Tag>
    );
  };

  return (
    <div style={{ marginBottom: errors?.message ? 24 : 8 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            marginBottom: 4,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <div style={{ position: 'relative' }}>
            <AntSelect
              id={id}
              mode={multiple ? 'multiple' : undefined}
              value={multiple ? field.value || [] : field.value}
              onChange={(newValue) => {
                const selectedOption = multiple
                  ? data.filter((item) => newValue.includes(item.id))
                  : data.find((item) => item.id === newValue);
                onChangeAutocomplete(selectedOption, field);
              }}
              onMouseEnter={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
              onFocus={() => setFocused(true)}
              onBlur={(event) => {
                setFocused(false);
                onBlurAutocomplete(event);
              }}
              disabled={disabled || loading || !success}
              loading={loading}
              size={size}
              style={{ width: fullWidth ? '100%' : 'auto' }}
              status={errors || !success ? 'error' : ''}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              tagRender={multiple ? renderTagsForSelect : undefined}
              suffixIcon={
                loading ? (
                  <Spin size="small" />
                ) : reload && (mouseOver || focused) ? (
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      load();
                    }}
                  />
                ) : undefined
              }
            >
              {data.map((option) => (
                <Option key={option.id} value={option.id}>
                  {defineName(option)}
                </Option>
              ))}
            </AntSelect>
          </div>
        )}
      />
      {errors?.message && (
        <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>
          {errors.message}
        </div>
      )}
    </div>
  );
};

export default Select;
