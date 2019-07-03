import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Redirect } from 'react-router';
import { rooturl } from "../../config";

class MyOrganization extends Component {

    constructor() {
        super();
        this.state = {
            myOrganizationList: [],
            redirectToJoinOrganizationRequestsPage: false,
            organizationSelected: 0,
            flag: false
            // ownerName: "",
            // description: "",
            // address: ""
        }
        // this.organizationNameChangeHandler = this.organizationNameChangeHandler.bind(this);
        // this.ownerNameChangeHandler = this.ownerNameChangeHandler.bind(this);
        // this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        // this.addressChangeHandler = this.addressChangeHandler.bind(this);
    }
    componentDidMount(){
        console.log('Inside component did mount');
            var email = localStorage.getItem("email")
        //console.log(email);
        axios.get(rooturl+'organizationCreation/myOrganization?email='+email, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
        .then(response => {
            console.log(response.data);
            this.setState({
                myOrganizationList : response.data
            });
        })

    }
    handleViewJoinRequestDetails = (event)=>{

        const index = event.target.id;

        this.setState({
            redirectToJoinOrganizationRequestsPage : true,
            organizationSelected : index,
        });
    }
    render(){

        var myOrganizationList = null;
        var loader = null;
        var redirectVar = null;
        var redirectVar = null;
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
          }

        if(this.state.myOrganizationList!=undefined){
            console.log('Data present',this.state.myOrganizationList);
            myOrganizationList = this.state.myOrganizationList.map((organization, index)=>{
                 return (
                     <div className="display-hackathon-container mt-3 mb-5">
                    <div className="container mt-3 mb-5" key = {index}>
                        <div className="ml-3 mt-3">
                            <h4><strong>{organization.name}</strong></h4>
                            <div className="form-group mt-3">
                                <button className="btn btn-lg hack-view-btn" id={organization.id} onClick={this.handleViewJoinRequestDetails}>View Requests</button>
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

        if(this.state.redirectToJoinOrganizationRequestsPage === true){
            redirectVar = <Redirect to={{pathname:"/IndividualOrganizationDetails", state:{ referrer: this.state.organizationSelected} }} />
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

export default MyOrganization;