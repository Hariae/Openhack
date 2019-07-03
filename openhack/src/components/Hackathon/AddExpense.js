import React, {Component} from "react";
import Header from "../Header/Header";
import axios from "axios";
import { rooturl } from "../../config";
import DatePicker from 'react-datepicker';
import { Redirect } from 'react-router';


class AddExpense extends Component {
    constructor(props){
        super(props);
         this.state = {
            title: "",
            description: "",
            // time: new Date(),
            amount: "",
            date_spent: new Date(),
            expenseHistory: [],
            expenseSubmitted: false,
            expenseHistoryView: false,
            allFilled: false,
            onSubmit: false
        }
    }
    handleChangeHandler = (event)=>{
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }
    handleDateChange = (date) => {
        this.setState({
            date_spent: date
        })
    }

    submitExpense = () => {
        // this.setState({
        //     redirectToCreateOrganization: true
        // })
        var data = {
            hackathon_id: this.props.match.params.id,
            title: this.state.title,
            description: this.state.description,
            amount: this.state.amount,
            time_stamp: this.state.date_spent.toLocaleDateString()
        }
        if(/^\s*$/.test(this.state.title)==false && /^\s*$/.test(this.state.description)==false &&
        /^\s*$/.test(this.state.amount)==false && /^\s*$/.test(this.state.time_stamp)==false) {
            axios.post(rooturl+'expense/add', data, {
                headers: {"Access-Control-Allow-Origin": "*"}
            })
            .then(response => {
                if(response.status==200) {
                    this.setState({
                        expenseSubmitted: true
                    })
                }
            })
    }
    else {
        this.setState({
            onSubmit: true,
            allFilled: false
        })
    }
    //     if(this.state.allFilled==true) {
    //     axios.post(rooturl+'expense/add', data, {
    //         headers: {"Access-Control-Allow-Origin": "*"}
    //     })
    //     .then(response => {
    //         if(response.status==200) {
    //             this.setState({
    //                 expenseSubmitted: true
    //             })
    //         }
    //     })
    // }
    }

    ExpenseHistory = () => {
        this.setState({
            expenseHistoryView: true,
            expenseSubmitted: false,
        })
         axios.get(rooturl+'expense?id='+this.props.match.params.id)
        .then(response => {
            this.setState({
                expenseHistoryView: true,
                expenseSubmitted: false,
                expenseHistory: this.state.expenseHistory.concat(response.data)
            })
            // this.state.expenseHistory = 
        })
    }
    modalClose = (event)=> {
        this.setState({
            expenseHistory: [],
            expenseSubmitted: false,
            expenseHistoryView: false
        })
    }

    render() {
        let modal, individualExpenses = null;
        var redirectVar = null, validations = null;
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
          }
          if(this.state.allFilled==false && this.state.onSubmit==true) {
            validations = (<div class="alert alert-danger">
            <a href="#" data-dismiss="alert" aria-label="close">
              &times;
            </a>
            <strong>All details are mandatory.</strong>
          </div>);
          }
        
      if(this.state.expenseHistory.length<1) {
        individualExpenses = <div>Loading...</div>
      }
      else {
        individualExpenses = this.state.expenseHistory.map(individualExpenses => {
            return(
                    <tr>
                        <th scope="row">{individualExpenses.title}</th>
                        <td>{individualExpenses.description}</td>
                        <td>{individualExpenses.amount}</td>
                        <td>{individualExpenses.time_stamp}</td>
                    </tr>
            )
        });
    }
    
    if(this.state.expenseSubmitted==false && this.state.expenseHistoryView==true) {
        modal = 
        <div class="modal" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">
          
            <div class="modal-header">
              <h4 class="modal-title">Individual Expense Details</h4>
              <button type="button" class="close" data-dismiss="modal" onClick = {this.modalClose}>&times;</button>
            </div>
            <div class="modal-body">
            <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Amount Spent</th>
                                <th scope="col">Time Stamp</th>
                            </tr>
                        </thead>
                        <tbody>
                        {individualExpenses}
                        </tbody>
                    </table>
            </div>
          </div>
        </div>
      </div>
      }
      else if(this.state.expenseSubmitted==true && this.state.expenseHistoryView==false) {
        modal = 
        <div class="modal" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" onClick = {this.modalClose}>&times;</button>
            </div>
            <div class="modal-body">
                <p>New Expense Submitted!</p>
            </div>
          </div>
        </div>
      </div>
    }
    else modal = 
    <div class="modal" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" onClick = {this.modalClose}>&times;</button>
        </div>
        <div class="modal-body">
        {(this.state.expenseHistoryView == true) ? 
            <p>Expense report is currently retrieving! Please wait</p> : <p>Issue in submitting the expenses! Please submit again</p>
                    }
        </div>
      </div>
    </div>
  </div>;

        return(
            <div className="container profile-content">
            {redirectVar}
                      <Header />
                        <div className="row">
                            <div className="col-8">
                                <div className="headline-text text-color-white">
                                    <h4><strong>Add Hackathon Expense</strong></h4>
                                    <button className="btn btn-lg profile-save-btn" onClick = {this.ExpenseHistory} data-toggle="modal" data-target="#myModal">Expense History</button>
                                    {modal}
                                </div>
                                <div className="profile-form-content">
                                    <div className="form-group">
                                        <input type="text" value = {this.state.title} name="title" id="title" className="form-control form-control-lg" placeholder="Title" onChange= {this.handleChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" value = {this.state.description} name="description" id="description" className="form-control form-control-lg" placeholder="Description" onChange= {this.handleChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                <DatePicker name="date_spent" id="date_spent" className="form-control form-control-lg" placeholder="Date Spent" selected={this.state.date_spent} onChange={this.handleDateChange}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" value = {this.state.amount} name="amount" id="amount" className="form-control form-control-lg" placeholder="Amount" onChange= {this.handleChangeHandler}  />
                                    </div>
                                    {validations}
                                    <div className="form-group">
                                        <button className="btn btn-lg profile-save-btn" onClick = {this.submitExpense} data-toggle="modal" data-target="#myModal">Submit Expense</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        );
    }
    


}
export default AddExpense;