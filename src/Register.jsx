import React from 'react';
import Decimal from 'decimal.js';

export class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [
        {
        "Account":'account',
        "Date":'May 5, 2021',
        "Payee":'payee',
        "Master Category":'Master',
        "Sub Category":'Sub',
        "Memo":'',
        "Outflow": Decimal(13.76),
        "Inflow":null,
        "Cleared":false,
        }
      ]
    };
  }
}