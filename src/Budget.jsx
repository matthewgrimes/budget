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
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))
class MonthDate {
  constructor(string){
    let month = string.split(' ')[0];
    let year = string.split(' ')[1];
    this.state = {
      month: month,
      year: year
    }
  }
  getString(){
    return(this.state.month+' '+this.state.year);
  }
  getMonthNumber(month){
    const month_dict = {'January':1,'February':2,'March':3,'April':4,'May':5,
    'June':6,'July':7,'August':8,'September':9,'October':10,'November':11,'December':12};
    return(month_dict[month]);
  }
  getMonthName(month_index){
    const month_list = ['January','February','March','April','May',
    'June','July','August','September','October','November','December'];
    return(month_list[(month_index-1)%12]);
  }
  decreaseMonth(){
    let new_month = this.getMonthNumber(this.state.month);
    let new_year = parseInt(this.state.year);
    new_month -= 1;
    if (new_month<1) {
      new_year -= 1;
      new_month += 12;
    }
    new_month = this.getMonthName(new_month);
    return new MonthDate(new_month+' '+new_year);
  }
  increaseMonth(){
    let new_month = this.getMonthNumber(this.state.month);
    let new_year = parseInt(this.state.year);
    new_month += 1;
    if (new_month>12) {
      new_year += 1;
      new_month -= 12;
    }
    new_month = this.getMonthName(new_month);
    return new MonthDate(new_month+' '+new_year);
  }
  equalTo(otherMonth) {
    return otherMonth.state.month===this.state.month & otherMonth.state.year===this.state.year;
  }
  greaterThan(otherMonth){
    let this_month_index = this.getMonthNumber(this.state.month);
    let other_month_index = this.getMonthNumber(otherMonth.state.month);
    if (this.state.year>otherMonth.state.year) {
      return true;
    }
    else if (this.state.year<otherMonth.state.year) {
      return false;
    }
    else if (this_month_index > other_month_index) {
      return true;
    }
    return false;
  }  
}
export class BudgetDataBase extends React.Component {
  constructor(props){
    super(props)
    this.state = { 
      data: props.data,
      income: props.income,
      month:'May 2021',
    };
    this.handleBudgetChange=this.handleBudgetChange.bind(this);
    this.onBlur=this.onBlur.bind(this);
    this.changeMonth=this.changeMonth.bind(this);
    this.addMasterCategory=this.addMasterCategory.bind(this);
    this.addSubCategory=this.addSubCategory.bind(this);
    this.removeSubCategory=this.removeSubCategory.bind(this);
    this.removeMasterCategory=this.removeMasterCategory.bind(this);
  }
changeMonth(newMonth) {
  this.setState({month:newMonth});
}
getEarliestBudgetedMonth() {
  var earliest_month = null;
  const data = this.state.data;
  let budgeted_months = [];
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
        budgeted_months = budgeted_months.concat(months);
        }
      }
  }
  let unique_budgeted_months = [...new Set(budgeted_months)];
  unique_budgeted_months.sort(function(x, y) {
    let a = new MonthDate(x);
    let b = new MonthDate(y);
    if ( b.greaterThan(a) ) { return -1; }
    if ( a.greaterThan(b) ) { return 1; }
    return 0;
  });
  return(unique_budgeted_months[0]);  
}
getLastBudgetedMonth() {
  const data = this.state.data;
  let budgeted_months = [];
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
        budgeted_months = budgeted_months.concat(months);
        }
      }
  }
  let unique_budgeted_months = [...new Set(budgeted_months)];
  unique_budgeted_months.sort(function(x, y) {
    let a = new MonthDate(x);
    let b = new MonthDate(y);
    if ( b.greaterThan(a) ) { return 1; }
    if ( a.greaterThan(b) ) { return -1; }
    return 0;
  });
  return(unique_budgeted_months[0]);  
}
getIncome(month) {
  return this.state.income[month] ? this.state.income[month] : Decimal(0);
}
getOverspentLastMonth(month){
  let this_month = new MonthDate(month);
  return(this.getOverspent(this_month.decreaseMonth().getString()));
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
          master_category_overspent = master_category_overspent.plus(Decimal.min(0,data[master_category][sub_category][month]['Balance']));
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
  let this_month = new MonthDate(month);
  let earliest_month = new MonthDate(this.getEarliestBudgetedMonth());
  if (earliest_month.equalTo(this_month) ) { return this.getIncome(month).minus(total_budgeted);}
  else {
    return(this.getAvailableToBudget(this_month.decreaseMonth().getString()).plus(this.getIncome(month)).plus(this.getOverspentLastMonth(month)).minus(total_budgeted));
  }
}
getLastMonthsBalance(data,master_category,sub_category,month) {
  let this_month = new MonthDate(month);
  let prior_month = this_month.decreaseMonth().getString();
  return (data[master_category][sub_category][prior_month]) ? data[master_category][sub_category][prior_month]['Balance'] : Decimal(0);
}
getDefault(data,master_category,sub_category,month){
  return data[master_category][sub_category][month] ? data[master_category][sub_category][month] : {
              'Budgeted': Decimal(0.00),
              'Balance': Decimal.max(Decimal(0.00),this.getLastMonthsBalance(data,master_category,sub_category,month)),
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
  const num_months = 3; // amount requested -- won't necessarily get 3
  const months = [];
  var this_month = new MonthDate(this.state.month);
  let sub_total_dict = {};
  for (let i=0; i<num_months; i++) {
    months.push(this_month.getString());
    this_month = this_month.increaseMonth();
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
      sub_total_dict[master_category] = sub_total_dict[master_category] ? sub_total_dict[master_category] : {};
      for (let j = 0; j < sub_categories.length; j++)
      {
        let sub_category = sub_categories[j];
        data[master_category][sub_category][month] = this.getDefault(data,master_category,sub_category,month);
        master_category_budgeted = master_category_budgeted.plus(data[master_category][sub_category][month]['Budgeted']);
        master_category_outflows = master_category_outflows.plus(data[master_category][sub_category][month]['Outflows']);
        master_category_available = master_category_available.plus(data[master_category][sub_category][month]['Balance']);
      }
      sub_total_dict[master_category][month] = {
        'Budgeted':master_category_budgeted, 
        'Outflows':master_category_outflows,
        'Balance':master_category_available
        };
      total_budgeted = total_budgeted.plus(master_category_budgeted);
      total_outflows = total_outflows.plus(master_category_outflows);
      total_available = total_available.plus(master_category_available);
    }
    sub_total_dict[month] = {'Budgeted':total_budgeted, 'Outflows':total_outflows,'Balance':total_available};
    }
    return(this.buildView(data,sub_total_dict,months));
  }
buildView(data,sub_total_dict,months) {
  const view = [];
  const master_categories = Object.keys(data);
  view.push(this.getMonthHeader(
    months,
    sub_total_dict
  ));
  view.push(this.getMonthBudgetRender(
  months,
  sub_total_dict,
  master_categories,
  data
  ));

  view.push(this.getNavFooter());
  return(<Box><Grid container spacing={2} columns={11}>{view}</Grid></Box>);
}
removeSubCategory(parent_category,category_to_remove) {
  let data = this.state.data;
  delete data[parent_category][category_to_remove];
  this.setState({data:data});
}
removeMasterCategory(category_to_remove) {
  let data = this.state.data;
  delete data[category_to_remove];
  this.setState({data:data});
}
getMonthBudgetRender(months, sub_total_dict, master_categories,data) {
  const view = [];
  for (let i = 0; i < master_categories.length; i++)
  {        
    let master_category = master_categories[i];
    const sub_categories = Object.keys(data[master_category]);
    for (let m=0; m<months.length; m++) {
      let month = months[m];
      view.push(
      <>
      {m==0 ?
      <><Grid item xs={1.5}>
      <Link component="button" onClick={() => this.removeMasterCategory(master_category)}>{master_category}</Link>
      </Grid>
      <Grid item xs={.5}>
      <BasicPopover parent={master_category} addButton={this.addSubCategory}/>
      </Grid></> : null }
      <Grid item xs={m==0 ? 3 : 0} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>{sub_total_dict[master_category][month]['Budgeted'].toFixed(2)}</Item>
      </Grid>      
      <Grid item xs={m==0 ? 3 : 0} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>{sub_total_dict[master_category][month]['Outflows'].neg().toFixed(2)}</Item>
      </Grid>      
      <Grid item xs={m==0 ? 3 : 0} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>{sub_total_dict[master_category][month]['Balance'].toFixed(2)}</Item>
      </Grid>
      </>
      );
    }
    for (let j = 0; j < sub_categories.length; j++)
    {
      let sub_category = sub_categories[j];
      for (let m=0; m<months.length; m++) {
        let month = months[m];
        const key = master_category+':'+sub_category+':'+month;
        view.push(
        <>
        {m==0 ?
        <>
        <Grid item xs={2}>
        <Link component="button" onClick={() => this.removeSubCategory(master_category,sub_category)}>{sub_category}</Link>
        </Grid>
        </> : null }
        <Grid item xs={3}  lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
          <Item>
          <TextField 
              id={key} 
              variant="standard"
              InputProps={{style: {fontSize: 14}}}
              style={{margin: 0, padding: 0}}
              defaultValue={data[master_category][sub_category][month]['Budgeted'].toFixed(2)!=0? data[master_category][sub_category][month]['Budgeted'].toFixed(2) : null}
              onKeyDown={this.handleBudgetChange} 
              onBlur={this.onBlur} 
              inputProps={{  pattern:"[-]?[0-9]*.[0-9]{2}" }}
              size="small"
            />
          </Item>
        </Grid>      
        <Grid item xs={3} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>        
          <Item>
          {data[master_category][sub_category][month]['Outflows'].neg().toFixed(2)}
          </Item>
        </Grid>      
        <Grid item xs={3} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
          <Item>
          {data[master_category][sub_category][month]['Balance'].toFixed(2)}
          </Item>
        </Grid>
        </>
        );
      }
    }
    
  }
  return(view);
}

getNavFooter() {
  let this_month = new MonthDate(this.state.month);
  return(
    <>
    <Grid item xs={11}>
      <Item>
        <Link component="button" onClick={() => this.changeMonth(this_month.decreaseMonth().getString())}>
        {'<<'}
        </Link>
      {this.state.month}
        <Link component="button" onClick={() => this.changeMonth(this_month.increaseMonth().getString())}>
        {'>>'}
        </Link>
      </Item>
    </Grid>
    </>
  );
}

getMonthHeader(months,sub_total_dict) {
  const render = []
  render.push(<><Grid item xs={2}></Grid></>);
  for (let m=0; m<months.length; m++){
    let month = months[m];
    let this_month = new MonthDate(month);
    let total_budgeted = sub_total_dict[month]['Budgeted'];
    let total_outflows = sub_total_dict[month]['Outflows'];
    let total_available = sub_total_dict[month]['Balance'];
    const not_budgeted_last_month = month==this.getEarliestBudgetedMonth() ? Decimal(0) : this.getAvailableToBudget(this_month.decreaseMonth().getString());
    const overspent_last_month = this.getOverspentLastMonth(month);
    const income_this_month = this.getIncome(month);
    const available_to_budget = not_budgeted_last_month.plus(income_this_month).plus(overspent_last_month).minus(total_budgeted);
    let not_budgeted_string = not_budgeted_last_month.isPositive() ? 'Not Budgeted' : 'Overbudgeted';
    render.push(
    <>
    <Grid item xs={1} lg={.5} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg:'inline'} }}>
      <Item>
        <br /><br />
        {month.split(' ')[0].slice(0,3)}<br />{month.split(' ')[1]}
        <br /><br />
      </Item>
    </Grid>
    <Grid item xs={m==0 ? 8 : 0} lg={2.5} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>
        <Grid item >
        {not_budgeted_last_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {not_budgeted_string} in {this_month.decreaseMonth().getString().split(' ')[0]}
        <br />
        {overspent_last_month.toFixed(2)=="0.00"?'-':null}{overspent_last_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Overspent in {this_month.decreaseMonth().getString().split(' ')[0]}
        <br />
        +{income_this_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Income for {this_month.getString().split(' ')[0]}
        <br />
        {total_budgeted.toFixed(2)=="0.00"?'-':null}{total_budgeted.neg().toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Budgeted in {this_month.getString().split(' ')[0]}
        </Grid>
        <hr />
        ={available_to_budget.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Available to Budget
        
      </Item>
    </Grid>
    </>
    );
  }
  for (let m=0; m<months.length; m++){
    let month = months[m];
    let total_budgeted = sub_total_dict[month]['Budgeted'];
    let total_outflows = sub_total_dict[month]['Outflows'];
    let total_available = sub_total_dict[month]['Balance'];
    render.push(<>
    {m==0 ? <Grid item xs={2}><BasicPopover addButton={this.addMasterCategory}/></Grid> : null}
    <Grid item xs={3} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>Budgeted<br />${total_budgeted.toFixed(2)}</Item>
    </Grid>
    <Grid item xs={3} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>Outflows<br />${total_outflows.neg().toFixed(2)}</Item>
    </Grid>
    <Grid item xs={3} lg={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>Balance<br />${total_available.toFixed(2)}</Item>
    </Grid>
    </>
    );
  }
  return(render);
}

handleBudgetChange(event) {
if (event.keyCode!=13 & event.keyCode!=27) { return; }
const id = event.target.id.split(':');
const master_category = id[0];
const sub_category = id[1];
const month = id[2];
const value = Decimal(event.target.value);
const outflows = this.state.data[master_category][sub_category][month]['Outflows'];
const new_data = Object.assign({},this.state.data);
if (event.keyCode==13){ // enter
  new_data[master_category][sub_category][month]['Balance'] = value.minus(outflows);
  const last_month = new MonthDate(this.getLastBudgetedMonth());
  let temp_month = new MonthDate(month);
  while (!temp_month.equalTo(last_month)) {
    temp_month = temp_month.increaseMonth();
    new_data[master_category][sub_category][temp_month.getString()]['Balance']=new_data[master_category][sub_category][temp_month.getString()]['Balance'].plus(Decimal.max(0,new_data[master_category][sub_category][temp_month.decreaseMonth().getString()]['Balance']));
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
//
  return (
    <div style={{float:'right'}}>
      <Button aria-describedby={id} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}} variant="contained" onClick={handleClick}>+</Button>
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
          value={form_value}
          onChange={({target}) => setFormValue(target.value)}
          />
          <Button aria-describedby={id} variant="contained" onClick={() => props.addButton(form_value,props.parent)}>+</Button>
      </Popover>
    </div>
  );
}