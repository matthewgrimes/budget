import React from 'react'
import {BudgetDataBase} from './Budget'
import {Register} from './Register'
import Decimal from 'decimal.js'
export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
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
      ],
      view: 'register',
    };
    this.updateRegister = this.updateRegister.bind(this);
  }
  updateRegister(params) {
    let id = params.id;
    let field = params.field;
    let value = params.value;
    console.log([id,field,value]);
    let register = this.state.register;
    let budget = this.state.budget;
    if (field == 'Category'| field == 'Date'| field == 'Inflow'| field == 'Outflow') {
      if (field == 'Outflow') {
        let master_category = register[id]['Category'].split(':')[0];
        let sub_category = register[id]['Category'].split(':')[1];
        let date = register[id]['Date'].split(' ')[0]+' '+register[id]['Date'].split(' ')[2];
        let old_value = new Decimal(register[id]['Outflow']);
        budget[master_category][sub_category][date] = budget[master_category][sub_category][date] ? budget[master_category][sub_category][date] : {'Budgeted':Decimal(0),'Outflows':Decimal(0),'Balance':Decimal(0)};
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].minus(old_value);
        budget[master_category][sub_category][date]['Outflows']=budget[master_category][sub_category][date]['Outflows'].plus(Decimal(value));
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].plus(old_value);
        budget[master_category][sub_category][date]['Balance']=budget[master_category][sub_category][date]['Balance'].minus(Decimal(value));
      }
    }
    register[id][field]=value;
    this.setState({register:register});
    this.setState({budget:budget});
  }
  render() {
    if (this.state.view === 'register') {
      return(<><Register data={this.state.register} update={this.updateRegister}/><BudgetDataBase data={this.state.budget}/></>);
    }
    else if (this.state.view === 'budget') {
      return(<BudgetDataBase data={this.state.budget}/>);
    }
  }
}