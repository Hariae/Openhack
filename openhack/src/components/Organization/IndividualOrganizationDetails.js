import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Redirect } from 'react-router';
import {rooturl} from '../../config';


class IndividualOrganizationDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organizationSelected: this.props.location.state && this.props.location.state.referrer,
            IndividualOrganizationPersonDetails: [],
            reloadPage: false
        }
    }
    componentDidMount() {
        console.log(this.state.organizationSelected);
        axios.get(rooturl + 'OrganizationRequests/' + this.state.organizationSelected)
            .then(response =>{
                if(response.status == 200){
                    console.log(response.data);
                    this.setState({
                        // hackathonData : response.data
                        IndividualOrganizationPersonDetails: response.data
                    });
                }
            });
    }
    handleOrganizationRequestDetails = (event)=>{

        const index = event.target.id;
        var data = {
            user_id: event.target.id,
            organization_id: this.state.IndividualOrganizationPersonDetails[0].organization_id 
        }
        console.log(data);
        // axios.post(rooturl + 'AddUserToOrganization'+)
        axios.post(rooturl +'OrganizationRequests/AcceptRequest', data, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
        .then(response => {
            this.setState({
                reloadPage: true
        });
    })
}
handleDeleteOrganizationRequestDetails = (event)=>{

    const index = event.target.id;
    var data = {
        user_id: event.target.id,
        organization_id: this.state.IndividualOrganizationPersonDetails[0].organization_id 
    }
    console.log(data);
    // axios.post(rooturl + 'AddUserToOrganization'+)
    axios.post(rooturl +'OrganizationRequests/deleteUserJoinRequest', data, {
        headers: {"Access-Control-Allow-Origin": "*"}
    })
    .then(response => {
        this.setState({
            reloadPage: true
    });
})
}


    render(){

        var myOrganizationList = null;
        var loader = null;
        var redirectVar = null;

        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }

        if(this.state.IndividualOrganizationPersonDetails!=undefined){
            console.log('Data present',this.state.IndividualOrganizationPersonDetails[0]);
            myOrganizationList = this.state.IndividualOrganizationPersonDetails.map((organization, index)=>{
                 return (
                     <div className="display-hackathon-container mt-3 mb-5">
                    <div className="container mt-3 mb-5" key = {index}>
                        <div className="ml-3 mt-3">
                            <h4><strong>The userId that has requested to join the organization is: {organization.user_id}</strong></h4>
                            <div className="form-group mt-3">
                                <button className="btn btn-lg hack-view-btn" id={organization.user_id} onClick={this.handleOrganizationRequestDetails}>Accept</button>
                                <button className="btn btn-lg hack-view-btn btn-danger ml-3" id={organization.user_id} onClick={this.handleDeleteOrganizationRequestDetails}>Delete</button>

                            </div>
                        </div>
                       
                    </div>
                    </div>
                 )
                
            });
        }
        else{
            loader =  <div className="center-content loader-container">
            <ReactLoading type={'balls'} color={'#ffffff'} height={'75%'} width={'20%'} />
        </div>
        }

        if(this.state.reloadPage === true){
            window.location.reload();
        }

        

        return(
            <div>
                <Header/>
                {redirectVar}
                <div className="container mt-5 text-color-white"> 
                    {loader}
                    {myOrganizationList}
                </div>
            </div>
        )
    }
}

export default IndividualOrganizationDetails;
