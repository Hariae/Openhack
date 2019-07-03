import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import {rooturl} from '../../config';
import ReactLoading from 'react-loading';
import { Redirect } from 'react-router';
import {Navbar, Button, Nav, Form, FormControl} from 'react-bootstrap';
import DatePicker from "react-datepicker";

class Home extends Component{

    constructor(props){
        super(props);
        var val = localStorage.getItem('email');
        this.state = { 
            hackathonData : [],
            redirectToDetailsPage : false,
            redirectToHackathonAdminPage : false,
            hackathonSelected : 0,
            search: '',
            currentHackathonSearch: '',
            pastHackathonSearch: '',
            value: '',
            registeredHackathons : [],
            redirectToHackathonSubmissionPage : false,
            hackathonTeamSelected : 0,
            hackathonsViewActive : false,
            registeredHackathonsViewActive : false,
            upcomingHackathonsViewActive: true,
            pastHackathonsViewActive: false,
            loader : false,
            registeredHackathonLoader : false,
            today: new Date,
            fromDate: "",
            toDate:"",
            buttonShow: false,
            email : val
        }

        //bind
        this.handleViewDetails = this.handleViewDetails.bind(this);   

    }
    updateSearch(event) {
        this.setState({search: event.target.value.substr(0,20)});
    }
    updateCurrentHackathonSearch(event) {
        this.setState({currentHackathonSearch: event.target.value.substr(0,20)});
    }
    updatePastHackathonSearch(event) {
        this.setState({pastHackathonSearch: event.target.value.substr(0,20)});
    }
    onChange1 = fromDate => this.setState({ fromDate });
    onChange2 = toDate => this.setState({ toDate });
    

    componentDidMount(){
        
        this.setState({
            today: new Date(this.state.today.setHours(0,0,0,0)),
                hackathonsViewActive : true,
                upcomingHackathonsViewActive: true,
                registeredHackathonsViewActive : false,
                pastHackathonsViewActive: false
        });   
        console.log('Inside component did mount');
        axios.get(rooturl + 'hackathon/gethackathonswherenotjudge?email=' +this.state.email)
            .then(response =>{
                console.log("notjudeg:", response.data);

                this.setState({
                    hackathonData : response.data,
                    loader : true
                });
            });

        //get registered-members
        axios.get(rooturl + '/hackathon/get-registered-hackathons?email=' + localStorage.getItem('email'))
            .then(response=>{
                console.log('Response reg: ', response.data);

                var result = response.data;
                var registeredHackathons = [];
                for(let i=0;i<result.length;i++){
                    axios.get(rooturl + '/hackathon?id='+ result[i].hackathon_id)
                        .then(response=>{
                            console.log('Hackathon data', response.data);
                            var resultData = response.data;
                            console.log(result[i]);
                            resultData.team_id = result[i].hackathonRegistrationId;
                            registeredHackathons.push(resultData);
                            this.setState({
                                registeredHackathons : registeredHackathons,
                                registeredHackathonLoader : true
                            });
                        })
                }
                
        });       
    }

    handleViewDetails = (event)=>{

        const index = event.target.id;
        var role = localStorage.getItem('role');
        if(role == 'admin'){
            this.setState({
                redirectToHackathonAdminPage : true,
                hackathonSelected : index
            });
        }
        else{
            this.setState({
                redirectToDetailsPage : true,
                hackathonSelected : index
            });
        }
        
    }


    handleViewRegisteredHackathonDetails = (event) =>{
        const index = event.target.id;
        const teamId = event.target.name;
        //console.log('Target', event.target);
        this.setState({
            redirectToHackathonSubmissionPage : true,
            hackathonSelected : index,
            hackathonTeamSelected : teamId
        });
    }

    // handle button click of upcoming and present hackatons

    handleHackthonsViewClick = () =>{
        this.setState({
            hackathonsViewActive : true,
            upcomingHackathonsViewActive: false,
            registeredHackathonsViewActive : false,
            pastHackathonsViewActive: false
        });
    }

    handleUpcomingHackthonsViewClick = () =>{
        this.setState({
            hackathonsViewActive : true,
            upcomingHackathonsViewActive: true,
            registeredHackathonsViewActive : false,
            pastHackathonsViewActive: false,
            buttonShow: true
        });
    }

    handleRegisteredHackthonsViewClick = () =>{
        this.setState({
            hackathonsViewActive : false,
            upcomingHackathonsViewActive: false,
            registeredHackathonsViewActive : true,
            pastHackathonsViewActive: false
        });
    }
    
    handlePastHackthonsViewClick = () =>{
        this.setState({
            hackathonsViewActive : true,
            upcomingHackathonsViewActive: false,
            registeredHackathonsViewActive : false,
            pastHackathonsViewActive: true,
            buttonShow: false
        });
    }


    render(){

        var hackathonData = null;
        var loader = null;
        var redirectVar = null;

        var registeredHackathonData = null;

        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }

        if(this.state.redirectToHackathonSubmissionPage == true){
            redirectVar = <Redirect to={"/hackathon/submission/" + this.state.hackathonSelected + "/" + this.state.hackathonTeamSelected }/>
        }

        if(this.state.loader === false){
            hackathonData = <div className="center-content loader-container">
                 <ReactLoading type={'balls'} color={'#ffffff'} height={'75%'} width={'20%'} />
             </div>
        }
        let filteredProperties = this.state.hackathonData.filter(
            (contact) => {
                return contact.event_name.indexOf(this.state.search) !== -1;
            }
        );

        var registeredHackathonTab = null;
        var hackathonButtonText = null;

        if(localStorage.getItem('role') != 'admin'){
            registeredHackathonTab = <Nav.Link className={this.state.registeredHackathonsViewActive === true ? 'nav-link active nav-link-view-active' : ''} onClick={this.handleRegisteredHackthonsViewClick}>REGISTERED HACKATHONS</Nav.Link>
            hackathonButtonText = "Register";
        }
        else{
            hackathonButtonText = "Manage Hackathon";
        }

        if(this.state.hackathonData.length > 0 && this.state.hackathonsViewActive === true){
            console.log('Data present');
            let filteredProperties = this.state.hackathonData.filter(
                (contact) => {
                   //console.log(new Date(contact.start_date));
                    //console.log(this.state.today);

                    return contact.event_name.indexOf(this.state.search) !== -1
                    && (this.state.pastHackathonsViewActive ? new Date(contact.start_date)<this.state.today: {})
                     && (this.state.upcomingHackathonsViewActive ? new Date(contact.start_date)>=this.state.today: {})
                }
            );
                let individualFilterHackathon = filteredProperties.filter(
                    (hackathonDates) => {
                        return hackathonDates.event_name.indexOf(this.state.currentHackathonSearch) !== -1
                        && (this.state.fromDate ? new Date(hackathonDates.start_date)<=this.state.fromDate: {})
               && (this.state.toDate ? new Date(hackathonDates.end_date)>=this.state.toDate: {});
                    }
                );
               
             
               var hackathonDataList = individualFilterHackathon.map((hackathon, index)=>{
                 return (
                     <div className="display-hackathon-container mt-3 mb-5" key = {index}>
                    <div className="container mt-3 mb-5" >
                        <div className="ml-3 mt-3">
                            <h4><strong>{hackathon.event_name}</strong></h4>
                            <div>
                                <p>{hackathon.description}</p>
                                </div>
                            <div>
                               Hackathon is from  {new Date(hackathon.start_date).toLocaleDateString()} to {new Date(hackathon.end_date).toLocaleDateString()}  
                            </div>
                            <div className="form-group mt-3" className={this.state.upcomingHackathonsViewActive ? "buttonShow" : "hide"} >
                            <button className="btn btn-lg hack-reg-btn" id={hackathon.id} onClick={this.handleViewDetails}>{hackathonButtonText}</button>
                            </div>
                            <div className="form-group mt-3" className={this.state.pastHackathonsViewActive ? "buttonShow" : "hide"} >
                            <button className="btn btn-lg hack-reg-btn btn-danger" id={hackathon.id}>Hackathon closed</button>
                            </div>
                        </div>
                       
                    </div>
                    </div>
                 )

                 
                
            });

            hackathonData = 
                <div>
                    <div className="form-group row ml-5 mb-5">
                        <input type="text" className="form-control form-control-lg col-lg-8 col-md-8 col-sm-12" placeholder="Search for a hackathon.." value = {this.state.currentHackathonSearch} onChange={this.updateCurrentHackathonSearch.bind(this)} />
                    </div>
                      {/* <input type = "text"  onChange={this.updateCurrentHackathonSearch.bind(this)} placeholder = "Filter by upcoming Hackathon Name" className="form-control form-control-sm col-sm-2"/> */}
                    {hackathonDataList}
                 </div>
        }
        else{
            if(this.state.hackathonData.length == 0 && this.state.loader === true){
                hackathonData = <div>No Hackathons available at this time</div>
            }
        //     loader =  <div className="center-content loader-container">
        //     <ReactLoading type={'balls'} color={'#ffffff'} height={'75%'} width={'20%'} />
        // </div>
        }


        if(this.state.registeredHackathons.length > 0 && this.state.registeredHackathonsViewActive === true ){
            console.log('Data present in reg hackathons');
            registeredHackathonData = this.state.registeredHackathons.map((hackathon, index)=>{
                 return (
                     <div className="display-hackathon-container mt-3 mb-5" key = {index}>
                    <div className="container mt-3 mb-5" >
                        <div className="ml-3 mt-3">
                            <h4><strong>{hackathon.event_name}</strong></h4>
                            <div>
                                <p>{hackathon.description}</p>
                                </div>
                            <div>
                               Hackathon is from  {new Date(hackathon.start_date).toLocaleDateString()} to {new Date(hackathon.end_date).toLocaleDateString()}  
                            </div>
                            <div className="form-group mt-3">
                                <button className="btn btn-lg hack-view-btn" id={hackathon.id} name = {this.state.registeredHackathons[index].team_id} onClick={this.handleViewRegisteredHackathonDetails}>View Details</button>
                            </div>
                        </div>
                       
                    </div>
                    </div>
                 )
                
            });
        }
        else{
            if(this.state.registeredHackathons.length == 0 && this.state.registeredHackathonLoader === true ){
                registeredHackathonData = <div>No Hackathons available at this time</div>
            }
        //     loader =  <div className="center-content loader-container">
        //     <ReactLoading type={'balls'} color={'#ffffff'} height={'75%'} width={'20%'} />
        // </div>
        }


        if(this.state.redirectToDetailsPage === true){
            redirectVar = <Redirect to={"/hackathon/" + this.state.hackathonSelected} />
        }

        if(this.state.redirectToHackathonAdminPage === true){
            redirectVar = <Redirect to={"/hackathon-admin/edit/" + this.state.hackathonSelected} />
        }

        return(
            <div>
                <Header/>
                {redirectVar}
                               
                <div className="container mt-5 text-color-white"> 
                <Navbar bg="dark" variant="dark">
                    {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
                    <Nav className="mr-auto home-page-nav-bar">
                        {/* <Nav.Link className={this.state.hackathonsViewActive === true ? 'nav-link active nav-link-view-active' : ''} onClick={this.handleHackthonsViewClick}>HACKATHONS</Nav.Link> */}
                        <Nav.Link className={this.state.upcomingHackathonsViewActive === true ? 'nav-link active nav-link-view-active' : ''} onClick={this.handleUpcomingHackthonsViewClick}>UPCOMING HACKATHONS</Nav.Link>
                        <Nav.Link className={this.state.pastHackathonsViewActive === true ? 'nav-link active nav-link-view-active' : ''} onClick={this.handlePastHackthonsViewClick}>PAST HACKATHONS</Nav.Link>                        
                        {registeredHackathonTab}                                                                        
                    </Nav>                    
                </Navbar>
                <br/>
               
                {/* <input type = "text" value = {this.state.currentHackathonSearch} onChange={this.updateCurrentHackathonSearch.bind(this)} placeholder = "Filter by Hackathon Name" className="form-control form-control-sm col-sm-2"/> */}
                {/* <input type = "text" value = {this.state.pastHackathonSearch} disabled = {(this.state.disabled2)? "disabled" : ""} onChange={this.updatePastHackathonSearch.bind(this)} placeholder = "Filter by past Hackathon Name" className="form-control form-control-sm col-sm-2"/> */}
                {/* <div className="form-group">
                  <DatePicker name="fromDate" id="fromDate" className="form-control form-control-lg" placeholder="From date" onChange={this.onChange1} name="fromDate" placeholder="From Date" selected={this.state.fromDate}  />
                </div>

                <div className="form-group">
                  <DatePicker name="toDate" id="toDate" className="form-control form-control-lg" placeholder="To date" onChange={this.onChange2}  placeholder="To Date" selected={this.state.toDate}  />
                </div> */}
{/*                 
                <DatePicker className="date" name="fromDate" onChange={this.onChange1} value={this.state.fromDate} name="fromDate" placeholder="From Date"/>
                <DatePicker className="date" name="toDate" onChange={this.onChange2} value={this.state.toDate} name="toDate" placeholder="To Date"/> */}
                    <div className="mt-5">                        
                        {loader}
                        {hackathonData}                    
                        {registeredHackathonData}
                    </div>
                   

                </div>
            </div>
        )
    }
}

export default Home;