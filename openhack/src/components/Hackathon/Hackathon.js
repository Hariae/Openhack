import React,{Component} from "react";
import Header from "../Header/Header";
import axios from 'axios';
import {rooturl} from '../../config';
import { Redirect } from 'react-router';


class Hackathon extends Component{

    constructor(props){
        super(props);
        console.log(props);

        this.state = {
            teamList : [],
            userList : [],
            searchSuggestions: [],
            searchSuggestionSelected : 0,
            searchResult : {},
            searchhacker : "",
            hackathonData : "",
            showRegistrationContent : false,
            team_id : "",
            confirmed : false,
            redirectToSubmission : false,
            teamCount : 0,
            teamRegistrationMinError : false,
            teamRegistrationMaxError : false,
            teamMembersUpdated : false,
            teamEmailsDelivered : false,
            redirectToHome : false,
            teamNameUnavailableError : false
            
        }

        //bind
        this.updateTeam = this.updateTeam.bind(this);

    }

    componentDidMount(){
        console.log('component did mount!');
        var userEmail = localStorage.getItem('email');
      
        axios.get(rooturl+'user?email='+userEmail)
            .then(response => {
                console.log(response);
                //call update memberList
                this.updateTeam(response.data);
        });

        axios.get(rooturl+'user/getUsers?id=' + this.props.match.params.id)
            .then(response=>{
                console.log(response);
                this.setState({
                    userList : response.data
                })
            });
        
        axios.get(rooturl + 'hackathon?id=' + this.props.match.params.id)
            .then(response =>{
                if(response.status == 200){
                    this.setState({
                        hackathonData : response.data
                    });
                }
            });

       // this.checkForHackathonConfirmation();
                
        

    }

    handleChange = (event) =>{
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    updateTeam = (teamMemberData)=>{
        
        this.state.teamList.push(teamMemberData);
       // var tempList = this.state.teamList;

        this.setState({
            teamList : this.state.teamList,
            teamCount : (this.state.teamCount + 1)
        });
        console.log('inside update');
    }

    handleSearchChange = (event) =>{
       const target = event.target;
       const searchTerm = target.value;
       const name = target.name

       var searchResult= this.state.userList.filter(obj=>obj.screen_name.includes(searchTerm));
       
        this.setState({
            searchSuggestions : searchResult,
            [name] : searchTerm
       });
    }

    handleSuggestionSelected = (event) =>{
        const target = event.target;
        const id = target.id;
        const name = target.name;
        this.setState({
            searchSuggestionSelected : id,
            searchhacker : name
        });
    }

    searchHacker = () =>{
        console.log('inside search hacker' , this.state.searchSuggestionSelected)
        this.setState({
            searchResult : this.state.userList.find(o=>o.id == this.state.searchSuggestionSelected)
        });


    }

    isEmpty = (obj)=> {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    addHacker = () =>{
        if(this.state.teamCount == this.state.hackathonData.max_size){
            this.setState({
                teamRegistrationMaxError : true
            })
        }
        else{
            this.updateTeam(this.state.searchResult);
        }
        
    }

    submitRegistration = () =>{
        var teamListPromises = [];
        if(this.state.teamCount < this.state.hackathonData.min_size){
           this.setState({
            teamRegistrationMinError : true
           });
           
        }
        else{
            for(let i=0;i<this.state.teamList.length ;i++){

                var isTeamLead = i == 0 ? true : false;
    
            var data = {
                team_id : this.state.team_id,
                member_id : this.state.teamList[i].id,
                role : this.state.teamList[i].roleString,
                payment : false,
                team_lead : isTeamLead
            }
    
            // axios.post(rooturl + '/hackathon/team-member', data)
            //     .then(response=>{
            //         if(response.status === 200){                                
            //             var emailData = {
            //                 email : this.state.teamList[i].email,
            //                 hackathon_id : this.props.match.params.id,
            //                 teamMember_id : this.state.teamList[i].id,
            //                 team_id : this.state.team_id,
            //                 hackathon_name : this.state.hackathonData.event_name,
            //                 hackathon_details : this.state.hackathonData.description
            //             }
            //             axios.post(rooturl + '/hackathon/send-registration-mail', emailData)
            //                 .then(response=>{
            //                     console.log(response.data + 'email');
            //                     // this.setState({
            //                      //     confirmed : true
            //                     // });      
                               
            //                 });
            //         }
            //     });

            teamListPromises.push(axios.post(rooturl+'/hackathon/team-member', data));
            
            }
            
            var teamEmailListPromises = [];

            Promise.all(teamListPromises)
                .then(values =>{
                    this.setState({
                        teamMembersUpdated : true
                    });
                    //console.log(values.status + 'teams' + values);
                    for(let i=0;i<this.state.teamList.length ;i++){
                        var emailData = {
                                            email : this.state.teamList[i].email,
                                            hackathon_id : this.props.match.params.id,
                                            teamMember_id : this.state.teamList[i].id,
                                            team_id : this.state.team_id,
                                            hackathon_name : this.state.hackathonData.event_name,
                                            hackathon_details : this.state.hackathonData.description
                                        }
                        teamEmailListPromises.push(axios.post(rooturl + '/hackathon/send-registration-mail', emailData)); 
                    }

                    Promise.all(teamEmailListPromises)
                        .then(emailValues=>{
                            console.log(emailValues.status + 'teams' + emailValues);
                            this.setState({
                                teamEmailsDelivered : true
                            })
                        });

                });
        }
        
    }

    submitHacker = (event, teamMember) =>{
        
        
        var target = event.target;
        target.setAttribute("disabled", true);
        console.log('teamMember', teamMember);


        //add member to team members
        console.log('isTeamLead', target.id);
        var isTeamLead = target.id == 0 ? true : false;

        var data = {
            team_id : this.state.team_id,
            member_id : teamMember.id,
            role : teamMember.role,
            payment : false,
            team_lead : isTeamLead
        }

        axios.post(rooturl + '/hackathon/team-member', data)
            .then(response=>{
                if(response.status === 200){                                
                    var emailData = {
                        email : teamMember.email,
                        hackathon_id : this.props.match.params.id,
                        teamMember_id : teamMember.id,
                        team_id : this.state.team_id,
                        hackathon_name : this.state.hackathonData.event_name,
                        hackathon_details : this.state.hackathonData.description
                    }
                    axios.post(rooturl + '/hackathon/send-registration-mail', emailData)
                        .then(response=>{
                            console.log(response + target.email);
                            // this.setState({
                             //     confirmed : true
                            // });                            
                        });
                }
            });
        


    }

    checkForHackathonConfirmation = () => {
        console.log('Inside checkForHackathonConfirmation');
    }

    redirectToSubmission = () =>{
        this.setState({
            redirectToSubmission : true
        });
    }

    registerClicked = () =>{

        var data = {
            hackathon_id : this.props.match.params.id,
            team_name : this.state.team_name
        }

        axios.get(rooturl + 'hackathon/isTeamNameAvailable?teamName=' +this.state.team_name)
            .then(response=>{
                if(response.status === 200){
                    if(response.data == true){
                        axios.post(rooturl + 'hackathon/registration', data, {
                            headers: {"Access-Control-Allow-Origin": "*"}
                        })
                            .then(response =>{
                                if(response.status === 200){
                                    this.setState({
                                        showRegistrationContent : true,
                                        team_id : response.data
                                    });
                                }
                            });       
                    }
                    else{
                        this.setState({
                            teamNameUnavailableError : true
                        });
                    }
                    
                }
            });

        
    }
    handleTeamMemberChange = (event, teamMember, role) =>{
        const target = event.target;
        const name = target.name;
        const value = target.value;
        teamMember.roleString = role;
        console.log('Inside teamMemberChange role: ', teamMember.roleString);
        console.log(teamMember);
        this.setState({
            refresh : true
        });
    }

    render(){
        var teamList = null;
        var confirmationContent = null;
        var redirectVar = null;
        
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }
        
        if(this.state.redirectToSubmission === true){
            redirectVar = <Redirect to={"/hackathon/submission/" + this.props.match.params.id} />
        }

        if(this.state.redirectToHome === true){
            redirectVar = <Redirect to="/"/>
        }

        var teamNameUnavailableErrorPanel = null;

        if(this.state.teamNameUnavailableError === true){
            teamNameUnavailableErrorPanel = <div className="alert alert-danger mt-3 col-lg-6 col-md-6 col-sm-12">
            <a href="#" className="close" data-dismiss="alert" aria-label="close">
              &times;
            </a>
            <strong>Team Name unavailable! Try a different name</strong> 
          </div>
        }
        
       var teamMembersUpdatedMessage = null;



       if(this.state.teamMembersUpdated === true){
        teamMembersUpdatedMessage = <div class="alert alert-success mt-3 col-lg-6 col-md-6 col-sm-12">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">
          &times;
        </a>
        <strong>Team Members have been updated successfully!</strong> 
      </div>
       }

       if(this.state.teamEmailsDelivered === true){
        teamMembersUpdatedMessage = <div class="alert alert-success mt-3 col-lg-6 col-md-6 col-sm-12">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">
          &times;
        </a>
        <strong>Check your inbox for payment information! </strong> 
        <button className="btn btn-lg btn-home col-lg-2 col-md-2 col-sm-12 ml-3" 
      onClick={()=> this.setState({
        redirectToHome : true
      })}
      >Home</button>
      </div>
       }

        var minTeamSizeErrorPanel = null;
        var maxTeamSizeErrorPanel = null;

        if(this.state.teamRegistrationMinError === true){
            minTeamSizeErrorPanel = <div class="alert alert-danger">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">
              &times;
            </a>
            <strong>Error!</strong> Team size not meeting criteria! Add more members. 
          </div>
        }

        if(this.state.teamRegistrationMaxError === true){
            maxTeamSizeErrorPanel = <div class="alert alert-danger">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">
              &times;
            </a>
            <strong>Error!</strong> Team is full. Cannot add more members!
          </div>
        }


        if(this.state.teamList.length > 0){
            teamList = this.state.teamList.map((teamMember, index)=>{
                
                return (
                    <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{teamMember.screen_name}</td>
                    <td>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            value={teamMember.roleString != null ? teamMember.roleString : "Role" }
                            >
                                {teamMember.roleString != null ? teamMember.roleString : "Role" }
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" onClick={(event) => this.handleTeamMemberChange(event, teamMember, 'Product Manager')}>Product Manager</a>
                                <a className="dropdown-item" onClick={(event) => this.handleTeamMemberChange(event, teamMember, 'Engineer')}>Engineer</a>
                                <a className="dropdown-item" onClick={(event) => this.handleTeamMemberChange(event, teamMember, 'Full Stack Developer')}>Full Stack Developer</a>
                                <a className="dropdown-item" onClick={(event) => this.handleTeamMemberChange(event, teamMember, 'Designer')}>Designer</a>
                                <a className="dropdown-item" onClick={(event) => this.handleTeamMemberChange(event, teamMember, 'Other')}>Other</a>
                            </div>
                        </div>
                    </td>
                    {/* <td><button className="btn btn-md btn-add" id={index} onClick={(event) => this.submitHacker(event, teamMember)} email={teamMember.email}>Submit</button></td> */}
                </tr>
                )
            });
        }

        var searchSugguestions = null;

        searchSugguestions = this.state.searchSuggestions.map((item, index)=>{
            return (
                <li key={index}> <a  onClick={this.handleSuggestionSelected} id={item.id} name={item.screen_name}>{item.screen_name}</a></li>
            )
        });

        var searchResult = null;

        if(!this.isEmpty(this.state.searchResult)){
            searchResult =   <div className="mt-3 p-3">
            <div>
                <span><h4><strong>{this.state.searchResult.screen_name}</strong></h4></span>
                <span><button className="btn btn-lg btn-add" onClick={this.addHacker}>Add hacker</button></span>
                {maxTeamSizeErrorPanel}
            </div>
            </div>
        }

         //confirmation
        
        //  if(this.state.confirmed === true){
        //     confirmationContent =  <button className="btn col-lg-3 col-md-3 col-sm-12 ml-3 btn-submission flt-right">Go to submission</button>
        // }
        // else{
            //confirmationContent =  <button className="btn col-lg-3 col-md-3 col-sm-12 ml-3 btn-submission flt-right" onClick={this.redirectToSubmission}>Go to submission</button>
        //}

        var registrationContent = null;
        if(this.state.showRegistrationContent === true){
            registrationContent =  <div className="mt-5">
            <div>
                <p>Your team should have a minimum of {this.state.hackathonData.min_size} member and maximum of {this.state.hackathonData.max_size} members</p>
            </div>
            <div>
                <table className="table table-bordered table-striped text-color-white center-content">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Hacker Name</th>
                        <th scope="col">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {teamList}
                </tbody> 
                </table>
            </div>
            <div  className="form-group mt-3 mb-3 p-3">

            <button className="btn  btn-lg flt-right col-lg-2 col-md-2 col-sm-12 ml-3 btn-send-email" onClick={this.submitRegistration}>Submit team</button>

            </div>
            <div className="form-group mt-5">
                {teamMembersUpdatedMessage}
            </div>
            <div className="form-group mt-5">
                {minTeamSizeErrorPanel}
            </div>
            <div>
                <p className="text-color-white">Add team members</p>
            </div>
            <div className="ml-2">
                <div className="form-group row">
                    <input type="text" name="searchhacker" id="searchhacker" className="form-control form-control-lg col-lg-8 col-md-8 col-sm-12" placeholder="Search for a hacker.." value= {this.state.searchhacker} onChange = {this.handleSearchChange} />
                    <button className="btn col-lg-2 col-md-2 col-sm-12 ml-3 btn-search" onClick={this.searchHacker}>Search </button>
                </div>
                <div className="">
                <ul className="search-suggestions">
                    {searchSugguestions}
                    </ul>
                </div>
            </div>
            <div className="mt-5 text-color-white">
            {searchResult}
            
        </div>
        <div>
            {confirmationContent}
        </div>
        </div>
      
        }
        else{
            registrationContent = <div>
            <div>
                <p>Click on Register Button to add team members</p>
            </div>
            <div className="form-group">
                <input type="text" name="team_name" id="team_name" className="form-control form-control-lg col-lg-6 col-md-6" placeholder="Enter a team name"onChange={this.handleChange} />
            </div>
            <div className="form-group">
                <button className="btn btn-lg btn-register" onClick={this.registerClicked}>Register</button>
            </div>  
            <div className="mt-5">
            {teamNameUnavailableErrorPanel}
            </div>                                              
        </div>
        }

       

        
        return(
            <div>
                <Header/>
                {redirectVar}
                <div className="container">
                   <div className=" pt-3 pb-3">
                        <h3><strong>{this.state.hackathonData.event_name}</strong></h3>
                    </div>
                    <div>
                        <p>{this.state.hackathonData.description}</p>
                    </div>
                    {/**User Part */}
                    
                    {registrationContent}
                     {/**User Part */}

                 
                </div>
            </div>
        )
    }
}

export default Hackathon;