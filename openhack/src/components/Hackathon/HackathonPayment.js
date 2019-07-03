import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import {rooturl} from '../../config';
import { Redirect } from 'react-router';
import ReactLoading from 'react-loading';

class HackathonPayment extends Component{
    
    constructor(props){
        super(props);
        console.log(props);

        this.state = {
            hackathonData : "",
            redirectToSubmission : false,
            isDiscountApplicable : false,
            loader : false
        }
    }

    componentDidMount(){
        axios.get(rooturl + 'hackathon?id=' + this.props.match.params.id)
            .then(response =>{
                if(response.status == 200){
                    console.log(response.data);
                    this.setState({
                        hackathonData : response.data
                    });
                }
            });

        axios.get(rooturl + 'user?email=' + localStorage.getItem('email'))
            .then(getUserResponse=>{
                console.log('userData', getUserResponse.data);
                axios.get(rooturl + 'hackathon/get-sponsors?hackathon_id=' + this.props.match.params.id + '&organization_id=' + getUserResponse.data.organization_id)
                .then(response =>{
                    console.log('sponsors ', response.data);
                    if(response.data.length > 0){
                        this.setState({
                            isDiscountApplicable : true
                        });
                    }
                });
            });
        
        // axios.get(rooturl + 'hackathon/get-sponsors?hackthon_id=' + this.props.match.params.id)
        //     .then(response =>{
        //         console.log('sponsors ', response.data);
        //     });
    }

    processPayment = () =>{
        console.log('Inside process payment');
        var totalAmount = 0;

        this.setState({
            loader : true
        })


        if(this.state.isDiscountApplicable === true){
            totalAmount = this.state.hackathonData.registration_fee - (this.state.hackathonData.sponsor_discount * 0.01 * this.state.hackathonData.registration_fee);
        } 
        else{
            totalAmount = this.state.hackathonData.registration_fee;
        }

        // var currentDate = new Date();
        // var month = currentDate.getUTCMonth() + 1; //months from 1-12
        // var day = currentDate.getUTCDate();
        // var year = currentDate.getUTCFullYear();

        // var currentDateString = year + "/" + month + "/" + day;

        var data = {
            team_id : this.props.match.params.teamId,
            member_id : this.props.match.params.memberId,
            email : localStorage.getItem('email'),
            totalAmount : totalAmount,
            time_stamp: new Date()
        }

        axios.post(rooturl + 'hackathon/process-payment', data)
            .then(response=>{
                console.log(response.data);
                if(response.status === 200){
                    axios.post(rooturl + 'hackathon/send-payment-invoice', data)
                    .then(responseData=>{
                        
                    });
                    this.setState({
                        redirectToSubmission : true
                    });
                }
                
            });
    }


    render(){

        var redirectVar = null;

        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }
        
        if(this.state.redirectToSubmission === true){
            redirectVar = <Redirect to={"/hackathon/submission/" + this.props.match.params.id + "/" + this.props.match.params.teamId} />
        }

        var loaderContent = null;

        if(this.state.loader === true){
            loaderContent = <div className="center-content loader-container">
            <ReactLoading type={'balls'} color={'#ffffff'} height={'75%'} width={'20%'} />
        </div>
        }

        return(
            <div>
               <Header/>
               {redirectVar}
               <div className="container">
                    <div className="pt-3 pb-3">
                        <h3><strong>{this.state.hackathonData.event_name} Payment Page</strong></h3>
                    </div> 
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Particulars</th>
                                    <th scope="col">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-color-green">
                                    <td>Registration Fee</td>
                                    <td>${this.state.hackathonData.registration_fee}</td>
                                </tr>
                                <tr className="text-color-red">
                                    <td>Discount</td>
                                    <td>${this.state.isDiscountApplicable === true ? this.state.hackathonData.sponsor_discount * 0.01 * this.state.hackathonData.registration_fee:0}</td>
                                </tr>
                                <tr className="text-color-green">
                                    <td>Total</td>
                                    <td>${this.state.isDiscountApplicable === true ? this.state.hackathonData.registration_fee - (this.state.hackathonData.sponsor_discount * 0.01 * this.state.hackathonData.registration_fee) : this.state.hackathonData.registration_fee}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="form-group float-right">
                        <button className="btn btn-lg pay-btn" onClick={this.processPayment}>Proceed to pay</button>
                        
                    </div>
                    {/* <div className="alert alert-payment" role="alert">
                        Hackathon Payment process is completed! Check your e-mail for invoice.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div> */}
                   
               </div>
            </div>
        )
    }
}

export default HackathonPayment;