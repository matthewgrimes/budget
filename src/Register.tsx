import React from 'react';
import Decimal from 'decimal.js';

import { DataGrid, GridRowsProp, GridColDef, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import useFetch from 'react-fetch-hook';


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

export function InvestmentRegister(props) {
  const apiRef = useGridApiRef();
  let [price,setPrice] = React.useState({});
  function handleDeleteClick(id) {
    props.removeTransaction(id);
  }
  function handleClick() {
    props.addTransaction();
  }
  function getCostBasis(params) {
        return Decimal(params.getValue(params.id,'Price')).div(
          Decimal(params.getValue(params.id, 'Amount'))).toFixed(2);
  }
  function getCurrentPrice(params) {
      var symbol=params.getValue(params.id,'Symbol').toLowerCase();
      if (symbol==='') { return ''; }
      let new_price = price;
      if (!(symbol in Object.keys(new_price))) {
        console.log('Missing symbol: '+symbol);
        // new_price[symbol] = { 'isLoading': false, 'data': Decimal(10) };
        new_price[symbol] = {};
        const {isLoading, error, data} =  useFetch("https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols="+symbol, {
          "method": "GET",
          "headers": {
            "x-rapidapi-host": "yh-finance.p.rapidapi.com",
            "x-rapidapi-key": "c9f5374e53mshd4a31d8c8a7f0b5p10c451jsn9f04210200cc"
          }
        })
        new_price[symbol]['isLoading'] = isLoading;
        new_price[symbol]['data'] = data;
        setPrice(new_price);
      }
      if (price[symbol]['isLoading']) { return ('...') }
      return price[symbol]['data']['quoteResponse']['result'][0]['regularMarketPrice']; 
  }
  function getGainLoss(params) {
    var symbol=params.getValue(params.id,'Symbol').toLowerCase();
    if (symbol==='') { return ''; }
    if (price[symbol]['isLoading']) { return('...'); }
    let previous_close = price[symbol]['data']['quoteResponse']['result'][0]['regularMarketPrice'];
    let cost_basis = params.getValue(params.id,'Cost Basis');
    let amount_purchased = params.getValue(params.id,'Amount');
    return( Decimal(previous_close).minus(Decimal(cost_basis)).mul(Decimal(amount_purchased)).toFixed(2) );
  }
  function getGainLossPercent(params) {
    var symbol=params.getValue(params.id,'Symbol').toLowerCase();
    if (symbol==='') { return ''; }
    if (price[symbol]['isLoading']) { return('...'); }
    let previous_close = price[symbol]['data']['quoteResponse']['result'][0]['regularMarketPrice'];
    let cost_basis = params.getValue(params.id,'Cost Basis');
    return( Decimal(previous_close).minus(Decimal(cost_basis)).div(Decimal(cost_basis)).mul(Decimal(100)).toFixed(2) );
  }  
  let columns = [
    {field: "Account", headerName: "Account", width: 150, editable: true},
    {field: "Date", headerName: "Date", editable: true, width: 125},
    {field: "Symbol", headerName: "Symbol", width: 125, editable: true},
    {field: "Amount", headerName: "Amount", width: 150, editable: true, type: 'number'},
    {field: "Price", headerName: "Price", width: 150, editable: true, type: 'number'},
    {field: "Cost Basis", headerName: "Cost Basis", width: 150, valueGetter: getCostBasis},
    {field: "Current Price", 
    headerName: "Current Price", 
    valueGetter: getCurrentPrice,
    width: 175,
    },
    {field: "Gain/Loss", headerName: "Gain/Loss", valueGetter: getGainLoss, width:150},
    {field: "Gain/Loss %", headerName: "\%Gain/Loss", valueGetter: getGainLossPercent, width:175},
  ]
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