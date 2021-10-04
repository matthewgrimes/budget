import React from 'react'
import {BudgetDataBase} from './Budget'
import {Register} from './Register'
import Decimal from 'decimal.js'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      income: {},
      budget: {
        'Master':{
          'Sub':{
            'June 2021':{
              'Budgeted': Decimal(3.00),
              'Balance': Decimal(-7.00),
              'Outflows': Decimal(10.00),
              },
            'May 2021':{
              'Budgeted': Decimal(0.00),
              'Balance': Decimal(-7.00),
              'Outflows': Decimal(7.00),
              }
            },
          'Sub1':{
            'June 2021':{
              'Budgeted': Decimal(0.00),
              'Balance': Decimal(-23.45),
              'Outflows': Decimal(23.45),
              },
            'May 2021':{
              'Budgeted': Decimal(0.00),
              'Balance': Decimal(-10.00),
              'Outflows': Decimal(10.00),
              }
            }
          },
          'Master 2':{'Sub 2':{'May 2021':{
            'Budgeted': Decimal(0.00),
            'Balance': Decimal(-10.00),
            'Outflows': Decimal(10.00)
          }}}
      },
      register : [
        {
          'id':0,
        "Account":'account',
        "Date":'May 5, 2021',
        "Payee":'payee',
        "Category":'Master:Sub',
        "Memo":'',
        "Outflow": Decimal(7.00),
        "Inflow":null,
        "Cleared":false,
        },
        {
        'id':1,
        "Account":'account',
        "Date":'May 6, 2021',
        "Payee":'payee',
        "Category":'Master:Sub1',
        "Memo":'',
        "Outflow": Decimal(10.00),
        "Inflow":null,
        "Cleared":false,
        },
        {
        'id':2,
        "Account":'account',
        "Date":'May 6, 2021',
        "Payee":'payee',
        "Category":'Master 2:Sub 2',
        "Memo":'',
        "Outflow": Decimal(10.00),
        "Inflow":null,
        "Cleared":false,
        },
        {
        'id':3,
        "Account":'account',
        "Date":'June 16, 2021',
        "Payee":'payee',
        "Category":'Master:Sub',
        "Memo":'',
        "Outflow": Decimal(10.00),
        "Inflow":null,
        "Cleared":false,
        },
        {
        'id':4,
        "Account":'account',
        "Date":'June 16, 2021',
        "Payee":'payee',
        "Category":'Master:Sub1',
        "Memo":'',
        "Outflow": Decimal(23.45),
        "Inflow":null,
        "Cleared":false,
        },        
      ],
      view: 'register',
    };
    this.updateRegister = this.updateRegister.bind(this);
    this.changeState = this.changeState.bind(this);
    this.updateIncome();
  }
  updateIncome() {
    const income = this.state.income;
    const register = this.state.register;
    for (let id=0; id<this.state.register.length; id++) {
      let date = register[id]['Date'].split(' ')[0]+' '+register[id]['Date'].split(' ')[2];
      income[date] = income[date] ? income[date] : Decimal(0);
      income[date] = income[date].plus(register[id]['Inflow'] ? register[id]['Inflow'] : Decimal(0))
    }
    this.setState({income:income});
  }
  updateRegister(params) {
    let id = params.id;
    let field = params.field;
    let value = params.value;
    console.log([id,field,value]);
    let register = this.state.register;
    let budget = this.state.budget;
    let income = this.state.income;
    if (field == 'Category'| field == 'Date'| field == 'Inflow'| field == 'Outflow') {
      let master_category = register[id]['Category'].split(':')[0];
      let sub_category = register[id]['Category'].split(':')[1];
      let date = register[id]['Date'].split(' ')[0]+' '+register[id]['Date'].split(' ')[2];
      budget[master_category][sub_category][date] = budget[master_category][sub_category][date] ? budget[master_category][sub_category][date] : {'Budgeted':Decimal(0),'Outflows':Decimal(0),'Balance':Decimal(0)};
      if (field == 'Outflow') {

        let old_value = new Decimal(register[id]['Outflow'] ? register[id]['Outflow'] : 0);

        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].minus(old_value);
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].plus(Decimal(value));
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].plus(old_value);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].minus(Decimal(value));
      }
      else if (field == 'Inflow') {
        let old_value = new Decimal(register[id]['Inflow'] ? register[id]['Inflow'] : 0);
        console.log(budget[master_category][sub_category][date]);
        console.log(budget[master_category][sub_category][date]['Outflows']);
        console.log(old_value);

        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].plus(old_value);
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].minus(Decimal(value));
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].minus(old_value);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].plus(Decimal(value));

        income[date]=income[date].minus(old_value);
        income[date]=income[date].plus(Decimal(value));        
        
      }
      else if (field == 'Category') {
        let new_master_category = value.split(':')[0];
        let new_sub_category = value.split(':')[1];
        let inflows = new Decimal(register[id]['Inflow'] ? register[id]['Inflow'] : 0);
        let outflows = new Decimal(register[id]['Outflow'] ? register[id]['Outflow'] : 0);
        budget[new_master_category][new_sub_category][date] = budget[new_master_category][new_sub_category][date] ? budget[new_master_category][new_sub_category][date] : {'Budgeted':Decimal(0),'Outflows':Decimal(0),'Balance':Decimal(0)};

        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].minus(outflows);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].plus(outflows);
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].plus(inflows);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].minus(inflows);

        budget[new_master_category][new_sub_category][date]['Outflows']=budget[new_master_category][new_sub_category][date]['Outflows'].plus(outflows);
        budget[new_master_category][new_sub_category][date]['Balance']=budget[new_master_category][new_sub_category][date]['Balance'].minus(outflows);
        budget[new_master_category][new_sub_category][date]['Outflows']=budget[new_master_category][new_sub_category][date]['Outflows'].minus(inflows);
        budget[new_master_category][new_sub_category][date]['Balance']=budget[new_master_category][new_sub_category][date]['Balance'].plus(inflows);
      }
      else if (field == 'Date') {
        let new_date = value.split(' ')[0]+' '+value.split(' ')[2];
        let inflows = new Decimal(register[id]['Inflow'] ? register[id]['Inflow'] : 0);
        let outflows = new Decimal(register[id]['Outflow'] ? register[id]['Outflow'] : 0);
        income[new_date] = income[new_date] ? income[new_date] : Decimal(0);
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].minus(outflows);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].plus(outflows);
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].plus(inflows);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].minus(inflows);

        budget[master_category][sub_category][new_date]['Outflows']=budget[master_category][sub_category][new_date]['Outflows'].plus(outflows);
        budget[master_category][sub_category][new_date]['Balance']=budget[master_category][sub_category][new_date]['Balance'].minus(outflows);
        budget[master_category][sub_category][new_date]['Outflows']=budget[master_category][sub_category][new_date]['Outflows'].minus(inflows);
        budget[master_category][sub_category][new_date]['Balance']=budget[master_category][sub_category][new_date]['Balance'].plus(inflows);        

        income[date]=income[date].minus(inflows);
        income[new_date]=income[new_date].plus(Decimal(inflows));            
      }
    }
    register[id][field]=value;
    this.setState({register:register});
    this.setState({budget:budget});
    this.setState({income:income});
  }
  getBudgetCategories() {
    const categories = [];
    const master_categories = Object.keys(this.state.budget);
    for (let i = 0; i < master_categories.length; i++)
    {
      var master_category_overspent = new Decimal(0.00);
      let master_category = master_categories[i];
      const sub_categories = Object.keys(this.state.budget[master_category]);
      for (let j = 0; j < sub_categories.length; j++)
      {
        let sub_category = sub_categories[j];
        if (sub_category) {
          categories.push(master_category+':'+sub_category);
        }
      }
    }
    return categories;
  }
  changeState(new_state) {
    this.setState({view:new_state.toLowerCase()});
  }
  render() {
    console.log(this.state.income);
    if (this.state.view === 'register') {
      return(<><LeftMenu accounts={['account']} menuNav={this.changeState}/><Register data={this.state.register} update={this.updateRegister} categories={this.getBudgetCategories()}/></>);
    }
    else if (this.state.view === 'budget') {
      return(<><LeftMenu accounts={['account']} menuNav={this.changeState}/><BudgetDataBase data={this.state.budget} income={this.state.income}/></>);
    }
  }
}

function LeftMenu(props) {
  const [state, setState] = React.useState({
    open: false
  });
  const account_list = Array(props.accounts);
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key={'close'}>
        <MenuOpenIcon />
        </ListItem>
        {['Register','Budget'].map((text, index) => (
          <ListItem button key={text} onClick={() => props.menuNav(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {account_list.map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={{float: 'left'}}>
        <React.Fragment key='left'>
          <Button onClick={toggleDrawer('left', true)}><MenuIcon /></Button>
          <Drawer
            anchor='left'
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
        </React.Fragment>
    </div>
  );
}