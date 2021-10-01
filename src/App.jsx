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

export class BudgetDataBase extends React.Component {
  constructor(props){
    super(props)
    this.state = { 
      data:
      {
        'Master':{
          'Sub':{
            'June 2021':{
              'Budgeted': Decimal(3.00),
              'Balance': Decimal(-7.00),
              'Outflows': Decimal(10.00),
              }
            },
          'Sub1':{
            'June 2021':{
              'Budgeted': Decimal(0.00),
              'Balance': Decimal(-23.45),
              'Outflows': Decimal(23.45),
              }
            }
          },
          'Master 2':{'Sub 2':{'May 2021':{
            'Budgeted': Decimal(0.00),
            'Balance': Decimal(-10.00),
            'Outflows': Decimal(-10.00)
          }}}
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
  if (month==this.getEarliestBudgetedMonth()) { return this.getIncome(month).minus(total_budgeted);}
  else {
    return(this.getAvailableToBudget(this.getMonthLong(month,-1)).plus(this.getIncome(month)).plus(this.getOverspentLastMonth(month)).minus(total_budgeted));
  }
}
getLastMonthsBalance(data,master_category,sub_category,month) {
  return (data[master_category][sub_category][this.getMonthLong(month,-1)]) ? data[master_category][sub_category][this.getMonthLong(month,-1)]['Balance'] : Decimal(0);
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
  let sub_total_dict = {};
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
      sub_total_dict[master_category] = sub_total_dict[master_category] ? sub_total_dict[master_category] : {};
      for (let j = 0; j < sub_categories.length; j++)
      {
        let sub_category = sub_categories[j];
        data[master_category][sub_category][month] = this.getDefault(data,master_category,sub_category,month);
        console.log(data);
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
    console.log(sub_total_dict);
    // let nav_footer = this.getNavFooter();
    // final.push(nav_footer);
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

getMonthBudgetRender(months, sub_total_dict, master_categories,data) {
  const view = [];
  for (let i = 0; i < master_categories.length; i++)
  {
    let master_category = master_categories[i];
    for (let m=0; m<months.length; m++) {
      let month = months[m];
      console.log([month,master_category]);
      console.log(sub_total_dict);
      const sub_categories = Object.keys(data[master_category]);
      view.push(
      <>
      {m==0 ?
      <><Grid item xs={1.5}>
      {master_category}
      </Grid>
      <Grid item xs={.5}>
      <BasicPopover parent={master_category} addButton={this.addSubCategory}/>
      </Grid></> : null }
      <Grid item xs={m==0 ? 3 : 0} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>{sub_total_dict[master_category][month]['Budgeted'].toFixed(2)}</Item>
      </Grid>      
      <Grid item xs={m==0 ? 3 : 0} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>{sub_total_dict[master_category][month]['Outflows'].neg().toFixed(2)}</Item>
      </Grid>      
      <Grid item xs={m==0 ? 3 : 0} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>{sub_total_dict[master_category][month]['Balance'].toFixed(2)}</Item>
      </Grid>
      </>
      );
      for (let j = 0; j < sub_categories.length; j++)
      {
        let sub_category = sub_categories[j];
        const key = master_category+':'+sub_category+':'+month;
        view.push(
        <>
        {m==0 ?
        <>
        <Grid item xs={2}>
        {sub_category}
        </Grid>
        </> : null }
        <Grid item xs={3}  lg={2} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
          <Item>
          <TextField 
              id={key} 
              variant="outlined" 
              defaultValue={data[master_category][sub_category][month]['Budgeted'].toFixed(2)}
              onKeyDown={this.handleBudgetChange} 
              onBlur={this.onBlur} 
              inputProps={{ inputMode: 'numeric', pattern:"[-]?[0-9]*.[0-9]{2}" }}
              size="small"
            />
          </Item>
        </Grid>      
        <Grid item xs={m==0 ? 3 : 0} lg={2} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>        
          <Item>
          {data[master_category][sub_category][month]['Outflows'].neg().toFixed(2)}
          </Item>
        </Grid>      
        <Grid item xs={m==0 ? 3 : 0} lg={2} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
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
      //   sub_category_render.push(
      // <Grid item bgcolor={j%2==0 ? "#ddd" : '#eee'} >
      //   {sub_category_box}
      //   <Item><TextField 
      //       id={key} 
      //       variant="outlined" 
      //       defaultValue={data[master_category][sub_category][month]['Budgeted'].toFixed(2)}
      //       onKeyDown={this.handleBudgetChange} 
      //       onBlur={this.onBlur} 
      //       inputProps={{ inputMode: 'numeric', pattern:"[-]?[0-9]*.[0-9]{2}" }}/>
      //   </Item>
      //   <Item>{data[master_category][sub_category][month]['Outflows'].neg().toFixed(2)}</Item>
      //   <Item>{data[master_category][sub_category][month]['Balance'].toFixed(2)}</Item>
      //   </Grid>);
      //     const master_category_box = m==0 ? <><Item>{master_category}<BasicPopover parent={master_category} addButton={this.addSubCategory}/></Item></> : null;
      // month_render.push([<Grid item>
      // {master_category_box}
      // <Item>{master_category_budgeted.toFixed(2)}</Item>
      // <Item>{master_category_outflows.neg().toFixed(2)}</Item>
      // <Item>{master_category_available.toFixed(2)}</Item>
      // </Grid>].concat(sub_category_render));

getNavFooter() {
  return(
    <>
    <Grid item xs={11}>
      <Item>
        <Link component="button" onClick={() => this.changeMonth(this.getMonthLong(this.state.month,-1))}>
        {'<<'}
        </Link>
      {this.state.month}
        <Link component="button" onClick={() => this.changeMonth(this.getMonthLong(this.state.month,1))}>
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
    let total_budgeted = sub_total_dict[month]['Budgeted'];
    let total_outflows = sub_total_dict[month]['Outflows'];
    let total_available = sub_total_dict[month]['Balance'];
    const not_budgeted_last_month = month==this.getEarliestBudgetedMonth() ? Decimal(0) : this.getAvailableToBudget(this.getMonthLong(month,-1));
    const overspent_last_month = this.getOverspentLastMonth(month);
    const income_this_month = this.getIncome(month);
    const available_to_budget = not_budgeted_last_month.plus(income_this_month).plus(overspent_last_month).minus(total_budgeted);
    let not_budgeted_string = not_budgeted_last_month.isPositive() ? 'Not Budgeted' : 'Overbudgeted';
    render.push(
    <>
    <Grid item xs={1} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg:'inline'} }}>
      <Item>
        <br /><br />
        {month.split(' ')[0].slice(0,3)}<br />{month.split(' ')[1]}
        <br /><br />
      </Item>
    </Grid>
    <Grid item xs={m==0 ? 8 : 0} lg={2} sx={{ display: {xs: m==0 ? 'inline' : 'none', lg: 'inline'} }}>
      <Item>
        {not_budgeted_last_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {not_budgeted_string} in {this.getMonth(month, -1)}
        <br />
        {overspent_last_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Overspent in {this.getMonth(month, -1)}
        <br />
        {income_this_month.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Income for {this.getMonth(month, 0)}
        <br />
        {total_budgeted.neg().toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Budgeted in {this.getMonth(month, 0)}
        <br />
        {available_to_budget.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Available to Budget
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
  const last_month = this.getLastBudgetedMonth();
  let temp_month = month.slice();
  while (temp_month!=last_month) {
    temp_month = this.getMonthLong(temp_month,1);
    console.log([master_category,sub_category,temp_month]);
    new_data[master_category][sub_category][temp_month]['Balance']=new_data[master_category][sub_category][temp_month]['Balance'].plus(Decimal.max(0,new_data[master_category][sub_category][this.getMonthLong(temp_month,-1)]['Balance']));
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