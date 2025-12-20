import { useState } from 'react';
import {
  esES,
  GridToolbar,
  DataGrid as UIDataGrid,
  gridClasses,
} from '@mui/x-data-grid';

const DataGrid = ({ rows, columns, loading }) => {
  const [pageSize, setPageSize] = useState(10);
  const [editRowsModel, setEditRowsModel] = useState({}); // Inicializa editRowsModel como un objeto vacío

  return (
    <div style={{ width: '100%' }}>
      <UIDataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        autoHeight
        editMode="cell"
        editRowsModel={editRowsModel} // Usa el objeto editRowsModel
        onEditRowsModelChange={(newModel) => setEditRowsModel(newModel)} // Actualiza editRowsModel
        loading={loading}
        rowsPerPageOptions={[10, 15, 20]}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        components={{ Toolbar: GridToolbar }}
        getRowHeight={() => 'auto'}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }}
      />
    </div>
  );
};

export default DataGrid;
