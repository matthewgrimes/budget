import React from 'react';
import Decimal from 'decimal.js';

import { DataGrid, GridRowsProp, GridColDef, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';


export function Register(props) {
  const apiRef = useGridApiRef();
  const columns = [
    {field: "Account", headerName: "Account", width: 150, editable: true},
    {field: "Date", headerName: "Date", editable: true, width: 150},
    {field: "Payee", headerName: "Payee", width: 150, editable: true},
    {field: "Category", headerName: "Category", width: 250, editable: true, type: 'singleSelect',
  valueOptions: props.categories},
    {field: "Memo", headerName: "Memo", width: 150, editable: true},
    {field: "Outflow", headerName: "Outflow", type:'number', width: 150, editable: true},
    {field: "Inflow", headerName: "Inflow", type:'number', width: 150, editable: true},
    {field: "Cleared", headerName: "Cleared", type:'boolean', width: 150, editable: true},
    {field:' Delete', headerName: 'Delete', type:'actions', width: 150,
      getActions: ({id}) => {
        return([<><Button onClick={handleDeleteClick(id)}><DeleteIcon /></Button>
        </>])
      }
    }
  ,[handleDeleteClick]];
  function handleDeleteClick(id) {
    props.removeTransaction(id);
  }
  function handleClick() {
    console.log('add new transaction');
    console.log(props);
    props.addTransaction();
  }
  console.log(props.data);
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
