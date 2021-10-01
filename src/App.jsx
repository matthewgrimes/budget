import React from 'react';
import './App.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import Decimal from 'decimal.js';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
          'Master 2':{'Sub 2':{'May 2021':{
            'Budgeted': Decimal(0.00),
            'Category Balance': Decimal(-10.00),
            'Outflows': Decimal(-10.00)
          }}},
          'Master 3':{}
      },
    month:'May 2021',
    };
    this.handleBudgetChange=this.handleBudgetChange.bind(this);
    this.onBlur=this.onBlur.bind(this);
    this.changeMonth=this.changeMonth.bind(this);
    this.addMasterCategory=this.addMasterCategory.bind(this);
    this.addSubCategory=this.addSubCategory.bind(this);
  }
changeMonth(newMonth) {
  this.setState({month:newMonth});
}
getEarliestBudgetedMonth() {
  var earliest_month = null;
  const data = this.state.data;
  const master_categories = Object.keys(data);
  for (let i = 0; i < master_categories.length; i++)
  {
    var master_category_overspent = new Decimal(0.00);
    let master_category = master_categories[i];
    const sub_categories = Object.keys(data[master_category]);
    for (let j = 0; j < sub_categories.length; j++)
    {
      let sub_category = sub_categories[j];
      if (sub_category) {
        let months = Object.keys(data[master_category][sub_category]);
        if (!months) { continue; }
        for (let k=0; k<months.length; k++) {
          let month = months[k];
          let a = new Date(month);
          let b = new Date(earliest_month);
          if (!earliest_month | a<b) {
            earliest_month = month;
          }
        }
      }
     }
  }
  return(earliest_month);  
}
getLastBudgetedMonth() {
  var earliest_month = null;
  const data = this.state.data;
  const master_categories = Object.keys(data);
  for (let i = 0; i < master_categories.length; i++)
  {
    var master_category_overspent = new Decimal(0.00);
    let master_category = master_categories[i];
    const sub_categories = Object.keys(data[master_category]);
    for (let j = 0; j < sub_categories.length; j++)
    {
      let sub_category = sub_categories[j];
      if (sub_category) {
        let months = Object.keys(data[master_category][sub_category]);
        if (!months) { continue; }
        for (let k=0; k<months.length; k++) {
          let month = months[k];
          let a = new Date(month);
          let b = new Date(earliest_month);
          if (!earliest_month | a>b) {
            earliest_month = month;
          }
        }
      }
     }
  }
  return(earliest_month);  
}
getMonth(thisMonth, difference) {
  const date = new Date(thisMonth);
  date.setMonth( (date.getMonth() + difference) );
  return (date.toLocaleString('default', { month: 'short' }));
}
getMonthLong(thisMonth, difference) {
  const date = new Date(thisMonth);
  date.setMonth( (date.getMonth() + difference) );
  return (date.toLocaleString('default', { month: 'long' })+' '+date.getFullYear());
}
getIncome(month) {
  return Decimal(500.00);
}
getOverspentLastMonth(month){
  return(this.getOverspent(this.getMonthLong(month,-1)));
}
getOverspent(month){
  const data = this.state.data;
  var total_overspent = new Decimal(0.00);
  const master_categories = Object.keys(data);
  for (let i = 0; i < master_categories.length; i++)
  {
    var master_category_overspent = new Decimal(0.00);
    let master_category = master_categories[i];
    const sub_categories = Object.keys(data[master_category]);
    for (let j = 0; j < sub_categories.length; j++)
    {
      let sub_category = sub_categories[j];
      if (sub_category) { 
        if (data[master_category][sub_category][month]) {
          master_category_overspent = master_category_overspent.plus(Decimal.min(0,data[master_category][sub_category][month]['Category Balance']));
        }
      }
    }
      total_overspent = total_overspent.plus(master_category_overspent);
  }
  return(total_overspent);
}
getAvailableToBudget(month){
  const data = this.state.data;
  var total_budgeted = new Decimal(0.00);
  const master_categories = Object.keys(data);
  var month_had_budget_item = false;
  for (let i = 0; i < master_categories.length; i++)
  {
    var master_category_budgeted = new Decimal(0.00);
    let master_category = master_categories[i];
    const sub_categories = Object.keys(data[master_category]);
    for (let j = 0; j < sub_categories.length; j++)
    {
      let sub_category = sub_categories[j];
      if (data[master_category][sub_category][month]) { 
        month_had_budget_item = true; 
        master_category_budgeted = master_category_budgeted.plus(data[master_category][sub_category][month]['Budgeted']);
      }
    }
      total_budgeted = total_budgeted.plus(master_category_budgeted);
  }
  if (month==this.getEarliestBudgetedMonth()) { return this.getIncome(month).minus(total_budgeted);}
  else {
    return(this.getAvailableToBudget(this.getMonthLong(month,-1)).plus(this.getIncome(month)).plus(this.getOverspentLastMonth(month)).minus(total_budgeted));
  }
}
getLastMonthsBalance(data,master_category,sub_category,month) {
  return (data[master_category][sub_category][this.getMonthLong(month,-1)]) ? data[master_category][sub_category][this.getMonthLong(month,-1)]['Category Balance'] : Decimal(0);
}
getDefault(data,master_category,sub_category,month){
  return data[master_category][sub_category][month] ? data[master_category][sub_category][month] : {
              'Budgeted': Decimal(0.00),
              'Category Balance': Decimal.max(Decimal(0.00),this.getLastMonthsBalance(data,master_category,sub_category,month)),
              'Outflows': Decimal(0.00),
              }
}
addMasterCategory(value,parent) {
  if (value=="") { return; }
  const data = this.state.data;
  data[value] = {};
  this.setState({data:data});
}
addSubCategory(value,parent) {
  if (value=="") { return; }
  const data = this.state.data;
  data[parent][value]={};
  this.setState({data:data});
}
  render() {
const data = this.state.data;
const final = [];
const num_months = 3;
const months = [];
for (let i=0; i<num_months; i++) {
  months.push(this.getMonthLong(this.state.month,i));
}
for (let m=0; m<months.length; m++) {
  const month = months[m];
  const month_render=[];
  var total_budgeted = new Decimal(0.00);
  var total_outflows = new Decimal(0.00);
  var total_available = new Decimal(0.00);
  const master_categories = Object.keys(data);
  for (let i = 0; i < master_categories.length; i++)
  {
    var master_category_budgeted = new Decimal(0.00);
    var master_category_outflows = new Decimal(0.00);
    var master_category_available = new Decimal(0.00);
    let master_category = master_categories[i];
    const sub_categories = Object.keys(data[master_category]);
    const sub_category_render = [];
    for (let j = 0; j < sub_categories.length; j++)
    {
      let sub_category = sub_categories[j];
      data[master_category][sub_category][month] = this.getDefault(data,master_category,sub_category,month);
      master_category_budgeted = master_category_budgeted.plus(data[master_category][sub_category][month]['Budgeted']);
      master_category_outflows = master_category_outflows.plus(data[master_category][sub_category][month]['Outflows']);
      master_category_available = master_category_available.plus(data[master_category][sub_category][month]['Category Balance']);
      const key = master_category+':'+sub_category+':'+month;
      sub_category_render.push(
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
      <td>{data[master_category][sub_category][month]['Outflows'].neg().toFixed(2)}</td>
      <td>{data[master_category][sub_category][month]['Category Balance'].toFixed(2)}</td>
      </tr>);
    }
    total_budgeted = total_budgeted.plus(master_category_budgeted);
    total_outflows = total_outflows.plus(master_category_outflows);
    total_available = total_available.plus(master_category_available);
    month_render.push([<tr>
    <td>{master_category}<BasicPopover parent={master_category} addButton={this.addSubCategory}/></td>
    <td>{master_category_budgeted.toFixed(2)}</td>
    <td>{master_category_outflows.neg().toFixed(2)}</td>
    <td>{master_category_available.toFixed(2)}</td>
    </tr>].concat(sub_category_render));
  }
  
  let header = this.getMonthHeader(month,total_budgeted,total_outflows,total_available);
  
  final.push (
    <table style={{float: 'left'}}>    
    <tbody>
    {header}
    {month_render}
    </tbody></table>
  );
  }
  let nav_footer = this.getNavFooter();
  final.push(nav_footer);
  return(final);
}

getNavFooter() {
  return(<><Link component="button" onClick={() => this.changeMonth(this.getMonthLong(this.state.month,-1))}>{'<<'}</Link>{this.state.month}
  <Link component="button" onClick={() => this.changeMonth(this.getMonthLong(this.state.month,1))}>{'>>'}</Link></>);
}

getMonthHeader(month,total_budgeted,total_outflows,total_available) {
  const not_budgeted_last_month = month==this.getEarliestBudgetedMonth() ? Decimal(0) : this.getAvailableToBudget(this.getMonthLong(month,-1));
  const overspent_last_month = this.getOverspentLastMonth(month);
  const income_this_month = this.getIncome(month);
  const available_to_budget = not_budgeted_last_month.plus(income_this_month).plus(overspent_last_month).minus(total_budgeted);
  let not_budgeted_string = not_budgeted_last_month.isPositive() ? 'Not Budgeted' : 'Overbudgeted';
  return(<><tr><td rowSpan="5">{month}</td><td colSpan="3">{not_budgeted_last_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {not_budgeted_string} in {this.getMonth(month, -1)}</td></tr>
<tr><td colSpan="3">{overspent_last_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Overspent in {this.getMonth(month, -1)}</td></tr>
<tr><td colSpan="3">{income_this_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Income for {this.getMonth(month, 0)}</td></tr>
<tr><td colSpan="3">{total_budgeted.neg().toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Budgeted in {this.getMonth(month, 0)}</td></tr>
<tr><td colSpan="3">{available_to_budget.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Available to Budget</td></tr>
<tr><td></td><th>Budgeted</th><th>Outflows</th><th>Balance</th></tr>
<tr>
  <td><BasicPopover addButton={this.addMasterCategory}/></td>
  <td>${total_budgeted.toFixed(2)}</td>
  <td>${total_outflows.neg().toFixed(2)}</td>
  <td>${total_available.toFixed(2)}</td>
</tr></>);
}

handleBudgetChange(event) {
  console.log(this.getLastBudgetedMonth());
if (event.keyCode!=13 & event.keyCode!=27) { return; }
const id = event.target.id.split(':');
const master_category = id[0];
const sub_category = id[1];
const month = id[2];
const value = Decimal(event.target.value);
const outflows = this.state.data[master_category][sub_category][month]['Outflows'];
const new_data = Object.assign({},this.state.data);
if (event.keyCode==13){ // enter
  new_data[master_category][sub_category][month]['Category Balance'] = value.minus(outflows);
  const last_month = this.getLastBudgetedMonth();
  let temp_month = month.slice();
  while (temp_month!=last_month) {
    temp_month = this.getMonthLong(temp_month,1);
    new_data[master_category][sub_category][temp_month]['Category Balance']=new_data[master_category][sub_category][temp_month]['Category Balance'].plus(Decimal.max(0,new_data[master_category][sub_category][this.getMonthLong(temp_month,-1)]['Category Balance']));
  }
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
  const id = event.target.id.split(':');
  const master_category = id[0];
  const sub_category = id[1];
  const month = id[2];
  event.target.value=this.state.data[master_category][sub_category][month]['Budgeted'].toFixed(2);
}
}




export default function BasicPopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [form_value,setFormValue] = React.useState("");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>+</Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <TextField 
          id={id} 
          variant="outlined" 
          // onKeyDown={} 
          // onBlur={} 
          value={form_value}
          onChange={({target}) => setFormValue(target.value)}
          />
          <Button aria-describedby={id} variant="contained" onClick={() => props.addButton(form_value,props.parent)}>+</Button>
      </Popover>
    </div>
  );
}