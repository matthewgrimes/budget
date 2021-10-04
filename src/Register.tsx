import React from 'react';
import Decimal from 'decimal.js';

import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';


export function Register(props) {
  const columns: GridColDef[] = [
    {field: "Account", headerName: "Account", width: 150, editable: true},
    {field: "Date", headerName: "Date", editable: true, width: 150},
    {field: "Payee", headerName: "Payee", width: 150, editable: true},
    {field: "Category", headerName: "Category", width: 250, editable: true, type: 'singleSelect',
  valueOptions: props.categories},
    {field: "Memo", headerName: "Memo", width: 150, editable: true},
    {field: "Outflow", headerName: "Outflow", type:'number', width: 150, editable: true},
    {field: "Inflow", headerName: "Inflow", type:'number', width: 150, editable: true},
    {field: "Cleared", headerName: "Cleared", type:'boolean', width: 150, editable: true},
  ];
  return(<div style={{ height: 300, width: '100%'}}>
  <DataGrid 
    checkboxSelection 
    rows={props.data} 
    columns={columns}
    onCellEditCommit={(params,event) => props.update(params)}
  />
  </div>);
}
