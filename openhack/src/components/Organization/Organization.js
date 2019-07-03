import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { Redirect } from 'react-router';
import { rooturl } from "../../config";

class Organization extends Component {

    constructor() {
        super();
        this.state = {
            organizationName: "",
            ownerName: "",
            description: "",
            address: "",
            errorShow: false
        }
        this.organizationNameChangeHandler = this.organizationNameChangeHandler.bind(this);
        this.ownerNameChangeHandler = this.ownerNameChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.addressChangeHandler = this.addressChangeHandler.bind(this);
    }
    organizationNameChangeHandler = (e) => {
        this.setState({
            organizationName : e.target.value
        })
    }
    ownerNameChangeHandler = (e) => {
        this.setState({
            ownerName: e.target.value
        })
    }
    descriptionChangeHandler = (e) => {
        this.setState({
            description: e.target.value
        })
    }
    addressChangeHandler = (e) => {
        this.setState({
            address: e.target.value
        })
    }

    submitDetails = (e) => {
        var data = {
            organizationName: this.state.organizationName,
            ownerName: this.state.ownerName,
            description: this.state.description,
            address: this.state.address,
            email: localStorage.getItem('email'),
            owner: 1
        }
        if(this.state.organizationName==undefined || this.state.ownerName==undefined || this.state.description==undefined
            || this.state.address==undefined || this.state.organizationName.length==0 || this.state.ownerName.length==0 || 
        this.state.address.length==0 || this.state.description.length==0) {
            this.setState({
                errorShow: true
            })
        }
        else {
        axios.post(rooturl+'organizationCreation', data, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
        .then(response => {
            this.setState({
                errorShow: false
            })
        })
    }
    } 
    render() {
        var redirectVar = null;
        var errorPanel = null;

        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
          }
   if (this.state.errorShow === true) {
     errorPanel = (
       <div class="alert alert-danger">
         <a href="#" class="close" data-dismiss="alert" aria-label="close">
           &times;
         </a>
         <strong>Error!</strong> Fill all details.
       </div>
     );
   }
        
        return(
            <div>
                {redirectVar}
                 <Header/>
                 <br/>
                 <h2 className="inputSizingOrganization">ORGANIZATION</h2>
                 <form>
                 <div className="form-group row">
                     <div className="col-xs-4">
                     <label for="Organization Name"></label>
                     <input type = "text" onChange = {this.organizationNameChangeHandler} class="form-control inputSizingOrganization" placeholder="Enter your Organization Name"/>
                     </div>
                </div>
                <div className="form-group row">
                     <div className="col-xs-4">
                     <label for="Owner Name"></label>
                     <input type = "text" onChange = {this.ownerNameChangeHandler} class="form-control inputSizingOrganization" placeholder="Owner Name"/>
                     </div>
                </div>
                <div className="form-group row">
                     <div className="col-xs-4">
                     <label for="Description"></label>
                     <input type = "text" onChange = {this.descriptionChangeHandler} class="form-control inputSizingOrganization" placeholder="Description"/>
                     </div>
                </div>
                <div className="form-group row">
                     <div className="col-xs-4">
                     <label for="Address"></label>
                     <input type = "text" onChange = {this.addressChangeHandler} class="form-control inputSizingOrganization" placeholder="Address"/>
                     </div>
                </div>
                {errorPanel}
                <div className="form-group row">
                     <div className="col-xs-4">
                     <label for="Submit"></label>
                     <input type = "submit" onClick = {this.submitDetails} class="form-control inputSizingOrganization" placeholder="Submit"/>
                     </div>
                </div>
                </form>
            </div>
        )
    }
}

export default Organization;