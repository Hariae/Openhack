import React, {Component} from "react";
import Header from "../Header/Header";
import axios from "axios";
import { rooturl } from "../../config";
import { Redirect } from 'react-router';

class HackathonPaymentReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamRegistrationData: [],
            individualPaymentData: []
        };
    }
    componentDidMount() {
        axios.get(rooturl+'hackathon-payment-report?id='+this.props.match.params.id)
        .then(response => {
            console.log("hackathon payment report", response.data);
            // this.state.teamRegistrationData.push(response.data);
            // for(var i=0;i<response.data.length;i++) {
            //     for(var j=0;j<response.data[i].length;j++) {
            //         console.log();
            //     }
            // }
            this.setState({
                teamRegistrationData : this.state.teamRegistrationData.concat(response.data) 
            });
        });
    }
    handleChange = (event)=>{
        const index = event.target.id;
        console.log(index);
        axios.get(rooturl+'hackathon-payment-report/team?team_id=' +index+"&hackathon_id="+this.props.match.params.id)
        .then(async (response) => {
            this.state.individualPaymentData = response.data;
            this.setState({
                individualPaymentData: response.data
            })
        });
        // this.setState({
        //     individualPaymentData : this.state.individualPaymentData.concat(arr) 
        // });
       
        // console.log(arr);
        console.log(this.state.individualPaymentData);
    }
    modalClose = (event)=> {
        this.setState({
            individualPaymentData: []
        })
    }
    
    render() {
        let details = null;
        var redirectVar = null;
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
          }
        if(this.state.teamRegistrationData!=undefined) {
        details = this.state.teamRegistrationData.map((teamRegistrationData, index) => {
            return(
                    <tr key = {index}>
                        <th scope="row">{teamRegistrationData[0]}</th>
                        {(teamRegistrationData[2] == "false") ? <td> Not paid </td> : <td> Paid </td> }
                        <td>
                        <button className="btn btn-lg hack-view-btn" id={teamRegistrationData[1]} onClick={this.handleChange} class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                        View Details
                        </button>
                            {/* <button className="btn btn-lg col-lg-6 btn-success">View Details</button> */}
                            </td>
                        </tr>
            )
        });
    }
    let individualPayment = null;
      console.log(this.state.individualPaymentData);
      if(this.state.individualPaymentData.length<1) {
        individualPayment = <div>Loading...</div>
      }
      else {
        individualPayment = this.state.individualPaymentData.map(individualPaymentData => {
            return(
                    <tr>
                        <th scope="row">{individualPaymentData[1]}</th>
                        {/* <td>{individualPaymentData[3]}</td> */}
                        {(individualPaymentData[2] === "false") ? <td> Not paid </td> : <td> Paid </td> }
                        {/* <td>{individualPaymentData[2]}</td> */}
                        {(individualPaymentData[4] === "null") ? <td> - </td> : <td> {individualPaymentData[4]} </td> }
                        <td>{individualPaymentData[3]}</td>
                        </tr>
            )
        });
    }
      
        
        let modal = 
        <div class="modal" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">
          
            <div class="modal-header">
              <h4 class="modal-title">Individual Payment Details</h4>
              <button type="button" class="close" data-dismiss="modal" onClick = {this.modalClose}>&times;</button>
            </div>
            <div class="modal-body">
            <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Member Name</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Amount Paid</th>
                                <th scope="col">Date of Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                        {individualPayment}
                        </tbody>
                    </table>
            {/* <div class="modal-body"> */}
            {/* <input onChange = {this.messageChangeHandler} value={this.state.message} type="text" className="form-control input-lg" id="message" placeholder="Ask message to owner"/> */}
            </div>
          </div>
        </div>
      </div>
      
        return (
            <div>
                {redirectVar}
            <Header />
            <div className="container">
                <div> Hackathon Payment Report</div>
                <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Team Name</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details}
                            {modal}
                        </tbody>
                    </table>
            </div>
          </div>
        );
    }
}
export default HackathonPaymentReport;