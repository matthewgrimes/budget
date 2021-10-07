import React from 'react';
import Decimal from 'decimal.js';

import { DataGrid, GridRowsProp, GridColDef, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';


export function Register(props) {
  const apiRef = useGridApiRef();
  const columns = props.columns;
  function handleDeleteClick(id) {
    props.removeTransaction(id);
  }
  function handleClick() {
    props.addTransaction();
  }
  return(<div style={{ height: '600px', width: '100%'}}>
  <DataGrid 
    rows={props.data} 
    columns={columns}
    onCellEditCommit={(params,event) => props.update(params)}
  />
  <GridToolbarContainer>
    <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
      Add transaction
    </Button>
  </GridToolbarContainer>
  </div>);
}
