import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { Redirect } from 'react-router';
import {rooturl} from '../../config';

class Profile extends Component{

    constructor(props){
        super(props);
        var val = localStorage.getItem('email');
         this.state = {
            redirectToHome : false,
            email : val,
            searchorganization : "",
            searchSuggestions: [],
            searchResult : {},
            organizationList :[],
            redirectToCreateOrganization: false,
            redirectToMyOrganizations: false,
            searchSuggestionSelected : 0,
            organization :"",
            //fields
             name:"",
             loaded : false,
            portraiturl:"",
            // title:"",



        } 

        
        this.updateProfileHandler = this.updateProfileHandler.bind(this);
        this.myOrganizationHandler = this.myOrganizationHandler.bind(this);
        this.createOrganization = this.createOrganization.bind(this);
        //bind 
    }

    handleChangeHandler = (event)=>{
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleSearchChange = (event) =>{
        const target = event.target;
        const searchTerm = target.value;
        const name = target.name
 
        var searchResult= this.state.organizationList.filter(obj=>obj.name.includes(searchTerm));
        
         this.setState({
             searchSuggestions : searchResult,
             [name] : searchTerm
        });
     }

     isEmpty = (obj)=> {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    searchOrganization = () =>{
        console.log('inside search organization' , this.state.searchSuggestionSelected)
        this.setState({
            searchResult : this.state.organizationList.find(o=>o.id == this.state.searchSuggestionSelected)
        });


    }

    


   async componentDidMount(){
       await axios.get(rooturl+'user?email='+this.state.email)
        .then(response=>{
            console.log(response.data);            
            this.setState({
                name : response.data.name,
                portraiturl : response.data.portraitURL,
                title: response.data.businessTitle,
                aboutme: response.data.aboutMe,
                address:  response.data.address,
                organization : response.data.organization_id,
                loaded : true
            })
        }); 

        axios.get(rooturl+ 'organizationCreation?id=' +this.state.organization)
        .then(response=>{
            console.log(response.data);
            this.setState({
                organization: response.data.name
            })
        })

        axios.get(rooturl+'organizationCreation/getAllOrganizations')
        .then(response=>{
            console.log(response.data);
            this.setState({
                organizationList : response.data
            })
        });


       
        axios.get(rooturl+'organizationCreation/getAllOrganizations')
        .then(response=>{
            console.log(response.data);
            this.setState({
                organizationList : response.data
            })
        });
    }

    createOrganization() {
        this.setState({
            redirectToCreateOrganization: true
        })
    }
    myOrganizationHandler =()=> {
        this.setState({
            redirectToMyOrganizations: true
        })
    }

    
    handleSuggestionSelected = (event) =>{
        const target = event.target;
        const id = target.id;
        const name = target.name;
        console.log("id", id);
        this.setState({
            searchSuggestionSelected : id,
            searchorganization : name
        });
    }

    joinOrganization = () => {
        console.log('Inside join organization');
        console.log(this.state.searchResult);
         var data = {
           email :  this.state.email,
           organization_id : this.state.searchResult.id
        } 
         //console.log(data);
        axios.post(rooturl+'OrganizationRequests/joinOrganization', data, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
            .then(res => {
                if(res.status === 200){
                    console.log('Result : ', res);
                    alert("Request sent for joining the organization");
                    this.setState({
                        searchSugguestions : null,
                        searchResult : null  
                })
            }
        });
    }

    leaveOrganization = () => {
        console.log('Inside leave organization');
         var data = {
           email :  this.state.email,
        } 
        axios.post(rooturl+'/user/leaveOrganization', data, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
            .then(res => {
                if(res.status === 200){
                    console.log('Result : ', res);
                    alert("Leave Organisation successful. Search for a new organisation");
                    this.setState({
                        organization : null
                })
            }
        });
    }

    updateProfileHandler (){
        console.log('Inside profile');
        var data = {
            name : this.state.name,
            email : this.state.email,
            portraiturl : this.state.portraiturl,
            title : this.state.title,
            organization: this.state.organization_id,
            aboutme : this.state.aboutme,
            address : this.state.address
        }
        console.log(data);
        axios.post(rooturl + 'user/profile', data, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
            .then(res => {
                if(res.status === 200){
                    console.log('Result : ', res);
                    this.setState({
                        redirectToHome : true
                })
            }
        });
    }

    
    render(){
        var redrirectVar = null;
        if(this.state.redirectToCreateOrganization == true) {
            redrirectVar = <Redirect to="/Organization" />
        }
        if(this.state.redirectToHome === true){
            redrirectVar = <Redirect to="/" />
        }

        if(localStorage.getItem('email') == null){
            redrirectVar = <Redirect to="/login"/>
        }

        var searchSugguestions = null;
        searchSugguestions = this.state.searchSuggestions.map((item, index)=>{
            return (
                <li key={index}> <a  onClick={this.handleSuggestionSelected} id={item.id} name={item.name}>{item.name}</a></li>
            )
        });
    


        var searchResult = null;

        if(!this.isEmpty(this.state.searchResult)){
            searchResult =   <div className="mt-3 p-3">
            <div>
                <span><h4><strong>{this.state.searchResult.name}</strong></h4></span>
                <span><button className="btn btn-lg btn-add" onClick={this.joinOrganization}>Join</button></span>
            </div>
            </div>}
        if(this.state.redirectToMyOrganizations === true){
            redrirectVar = <Redirect to="/MyOrganization" />
        }
        var organization = null ;
        if(this.state.organization != null && this.state.loaded == true){
            console.log("inside");
            organization =  <div className="form-group">
            <input type="text" name="oraganization" id="oraganization" className="form-control form-control-lg" placeholder="Organization"  value= {this.state.organization} />
            <button className="btn btn-lg btn-leave mt-2" onClick={this.leaveOrganization}>Leave</button>
            </div>

            {/* organization = <div>  <h5>Organization</h5>
            <div className="mb-3 row">

            <p className="org-name col-lg-1 col-md-1 col-sm-12"> {this.state.organization}</p>
            <button className="btn btn-sm btn-leave mt-2" onClick={this.leaveOrganization}>Leave</button>
            </div>                         
            </div> */}
        }
        else{
            organization = <div className="form-group">
            <input type="text" name="searchorganization" id="searchorganization" className="form-control form-control-lg" placeholder="Organization"  value= {this.state.searchorganization} onChange = {this.handleSearchChange}  />
            <button className="btn btn-lg profile-join-btn mt-2" onClick={this.searchOrganization}>Search</button> <br/>

        </div>
        }
    
        return(
            <div>
                <Header/>
                <div className="container">
                {redrirectVar}
                    <div className="center-content profile-heading">
                            <img className="logo-profile" src={this.state.portraiturl != null ? this.state.portraiturl : "https://atlas-content-cdn.pixelsquid.com/stock-images/potato-clean-QJD27E3-600.jpg"}
                            //src={require('../../Static/Images/logo-profile-1.png')} 
                            alt="logo" />
                            <h3 className="mt-3 text-color-white">{this.state.name}</h3>
                            <p></p>
                    </div>
                    <div className="container profile-content">
                        <div className="row">
                            <div className="col-8">
                                <div className="headline-text text-color-white">
                                    <h4><strong>Profile Information</strong></h4>
                                </div>
                                <div className="profile-form-content">
                                    <div className="form-group">
                                        <input type="text" value = {this.state.name} name="name" id="name" className="form-control form-control-lg" placeholder="Name" onChange= {this.handleChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" value = {this.state.portraiturl} name="portraiturl" id="portraiturl" className="form-control form-control-lg" placeholder="Enter portrait URL" onChange= {this.handleChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" value = {this.state.title} name="title" id="title" className="form-control form-control-lg" placeholder="Buisness Title" onChange= {this.handleChangeHandler}  />
                                    </div> 
                                    {organization}
                                    
                                    <div className="">
                                    <ul className="search-suggestions"> 
                                       {searchSugguestions}
                                       </ul>
                                     </div>
                                     <div className="mt-5 text-color-white">
                                            {searchResult}
                                     </div>
                                    <div className="form-group">
                                        <input type="text" value = {this.state.aboutme} name="aboutme" id="aboutme" className="form-control form-control-lg" placeholder="About me" onChange= {this.handleChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" value = {this.state.address} name="address" id="address" className="form-control form-control-lg" placeholder="Address" onChange= {this.handleChangeHandler}  />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-lg profile-save-btn" onClick = {this.myOrganizationHandler}>My Organizations</button> <br/>
                                        <button className="btn btn-lg profile-join-btn mt-2" onClick={this.createOrganization}>Create Organization</button>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-lg profile-save-btn" onClick = {this.updateProfileHandler}>Save Changes</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;