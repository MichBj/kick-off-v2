import Grid from '@material-ui/core/Grid';
import Card from '@ui/common/Card';
import { isEmpty } from 'lodash';
import PageSpinner from './PageSpinner';
import { Alert } from '@material-ui/lab';

const CardList = ({
  rows,
  url,
  parseUrl,
  title = 'name',
  description,
  pusheable,
  access,
  loading,
  parser,
  active,
}) => {
  if (parser) rows = parser(rows);

  const defineUrl = (row) => {
    if (parseUrl) return parseUrl(row);
    return `${url}/${row.id}`;
  };

  const defineTitle = (row) => {
    if (typeof title === 'string') return row[title];
    if (typeof title === 'function') return title(row);
    return title;
  };

  const defineDescription = (row) => {
    if (typeof description === 'string') return row[description];
    if (typeof description === 'function') return description(row);
    if (typeof description === 'object') return description.custom;
    return description;
  };

  return (
    <Grid item container justifyContent="flex-start" xs={12}>
      {rows.map((row) => (
        <Grid item key={row.id} xs={12} sm={6} md={3} lg={3} xl={3}>
          <Card
            url={defineUrl(row)}
            title={defineTitle(row)}
            description={defineDescription(row)}
            pusheable={(pusheable || access?.write) && url}
            active={row.active || active}
          />
        </Grid>
      ))}
      {isEmpty(rows) && (
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <Alert severity="info">Sin registros</Alert>
        </Grid>
      )}
      {loading && <PageSpinner />}
    </Grid>
  );
};

export default CardList;
