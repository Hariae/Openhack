import React, {Component} from "react";
import Header from "../Header/Header";
import axios from "axios";
import { rooturl } from "../../config";
import { Redirect } from 'react-router';

class HackathonEarningReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
           paidAmount: 0,
           unpaidAmount: 0,
           sponsorsAmount: 0,
           expenses: 0,
           profit: 0
        };
    }
    async componentDidMount() {
        // this.props.match.params.
        await axios.get(rooturl+'hackathon-earning-report?id='+this.props.match.params.id)
        .then(async (response) => {
            console.log(response.data);
            this.setState({
                paidAmount: response.data[0],
                unpaidAmount: parseInt(response.data[1])*parseInt(response.data[3]),
                sponsorsAmount: parseInt(response.data[2])*1000,
                profit: parseInt(response.data[0]) + parseInt(response.data[2])*1000
            })
        });
        await axios.get(rooturl+'expense?id='+this.props.match.params.id)
        .then(response => {
            var exp = 0;
            for(var i=0;i<response.data.length;i++) {
                exp = exp + parseInt(response.data[i].amount); 
            }
            this.setState({
                expenses: exp,
                profit: this.state.profit - exp
            })
        })
    }
    render() {
        var details = null;
        var redirectVar = null;
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
          }
        return(
            <div>
                {redirectVar}
            <Header />
            <div className="container">
                <div>Hackathon Earning Report</div>
                <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Revenue Source</th>
                                <th scope="col">total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">Total revenue from paid registration fees</th>
                            <th scope="row">{this.state.paidAmount}</th>
                        </tr>
                        <tr>
                            <th scope="row">Total unpaid registration fees</th>
                            <th scope="row">{this.state.unpaidAmount}</th>
                        </tr>
                        <tr>
                            <th scope="row">Total revenue from sponsors</th>
                            <th scope="row">{this.state.sponsorsAmount}</th>
                        </tr>
                        <tr>
                            <th scope="row">Total expenses</th>
                            <th scope="row">{this.state.expenses}</th>
                        </tr>
                        <tr>
                            <th scope="row">Profit</th>
                            <th scope="row">{this.state.profit}</th>
                        </tr>
                        </tbody>
                    </table>
            </div>
          </div>
        );
    }

}
export default HackathonEarningReport;
