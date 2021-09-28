import React from 'react';
import './App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Decimal from 'decimal.js';
export class BudgetDataBase extends React.Component {
  constructor(props){
    super(props)
    this.state = { 
      data:
      {
        'Master':{
          'Sub':{
            'July 2021':{
              'Budgeted': Decimal(0.00),
              'Category Balance': Decimal(-10.00),
              'Outflows': Decimal(10.00),
              }
            },
          'Sub1':{
            'July 2021':{
              'Budgeted': Decimal(0.00),
              'Category Balance': Decimal(-23.45),
              'Outflows': Decimal(23.45),
              }
            }
          },
      },
    month:'July 2021',
    };
    this.handleBudgetChange=this.handleBudgetChange.bind(this);
    this.onBlur=this.onBlur.bind(this);
  }
getMonth(thisMonth, difference) {
  const date = new Date(thisMonth);
  date.setMonth( (date.getMonth() + difference)%12 );
  return (date.toLocaleString('default', { month: 'short' }));
}
handleBudgetChange(event) {
if (event.keyCode!=13 & event.keyCode!=27) { return; }
const id = event.target.id.split(':');
const master_category = id[0];
const sub_category = id[1];
const month = id[2];
console.log([master_category,sub_category,month]);
const value = Decimal(event.target.value);
const outflows = this.state.data[master_category][sub_category][month]['Outflows'];
const new_data = Object.assign({},this.state.data);
if (event.keyCode==13){ // enter
  new_data[master_category][sub_category][month]['Category Balance'] = value.minus(outflows);
  new_data[master_category][sub_category][month]['Budgeted'] = value;
  event.target.value = value;
  this.setState({data:new_data});
  event.target.value=this.state.data[master_category][sub_category][month]['Budgeted'].toFixed(2);
}
else if (event.keyCode==27) // escape
{
  event.target.value=this.state.data[master_category][sub_category][month]['Budgeted'].toFixed(2);
}
}
onBlur(event) {
  event.target.value=this.state.data[master_category][sub_category][month]['Budgeted'].toFixed(2);
}
  render() {
const data = this.state.data;
const final=[];
var total_budgeted = new Decimal(0.00);
var total_outflows = new Decimal(0.00);
var total_available = new Decimal(0.00);
const master_categories = Object.keys(data);
console.log(master_categories);
const month = this.state.month;
for (let i = 0; i < master_categories.length; i++)
{
  let master_category = master_categories[i];
  console.log(master_category);
  const sub_categories = Object.keys(data[master_category]);
  console.log(sub_categories);
  final.push(<tr><td colSpan="3">{master_category}</td></tr>)
  for (let j = 0; j < sub_categories.length; j++)
  {
    let sub_category = sub_categories[j];
    total_budgeted = total_budgeted.plus(data[master_category][sub_category][month]['Budgeted']);
    total_outflows = total_outflows.plus(data[master_category][sub_category][month]['Outflows']);
    total_available = total_available.plus(data[master_category][sub_category][month]['Category Balance']);
    const key = master_category+':'+sub_category+':'+month;
    console.log(key);
    final.push(
  <tr key={key} bgcolor={j%2==0 ? "#ddd" : '#eee'} >
    <td>{sub_category}</td>
    <td><TextField 
        id={key} 
        variant="outlined" 
        defaultValue={data[master_category][sub_category][month]['Budgeted'].toFixed(2)}
        onKeyDown={this.handleBudgetChange} 
        onBlur={this.onBlur} 
        inputProps={{ inputMode: 'numeric', pattern:"[-]?[0-9]*.[0-9]{2}" }}/>
    </td>
    <td>-{data[master_category][sub_category][month]['Outflows'].toFixed(2)}</td>
    <td>{data[master_category][sub_category][month]['Category Balance'].toFixed(2)}</td>
    </tr>);
  }
}
const not_budgeted_last_month = new Decimal(0.00);
const overspent_last_month = new Decimal(0.00);
const income_this_month = new Decimal(500.00);
const available_to_budget = not_budgeted_last_month.plus(income_this_month).minus(overspent_last_month).minus(total_budgeted);
  return (
<table>    
<tbody>
<tr><td rowSpan="5">{this.state.month}</td><td colSpan="3">{not_budgeted_last_month.toFixed(2)} Not Budgeted in {this.getMonth(this.state.month, -1)}</td></tr>
<tr><td colSpan="3">{overspent_last_month.neg().toFixed(2)} Overspent in {this.getMonth(this.state.month, -1)}</td></tr>
<tr><td colSpan="3">{income_this_month.toFixed(2)} Income for {this.state.month}</td></tr>
<tr><td colSpan="3">{total_budgeted.neg().toFixed(2)} Budgeted in {this.state.month}</td></tr>
<tr><td colSpan="3">{available_to_budget.toFixed(2)} Available to Budget</td></tr>
<tr><td></td><th>Budgeted</th><th>Outflows</th><th>Balance</th></tr>
<tr>
  <td></td>
  <td>${total_budgeted.toFixed(2)}</td>
  <td>${total_outflows.neg().toFixed(2)}</td>
  <td>${total_available.toFixed(2)}</td>
</tr>
{final}
</tbody></table>
  );
}
}


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}