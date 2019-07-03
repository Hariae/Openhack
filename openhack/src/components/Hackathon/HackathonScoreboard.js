import React, { Component } from 'react';
import Header from '../Header/Header';
import { rooturl } from '../../config';
import axios from 'axios';
import { Redirect } from 'react-router';

class HackathonScoreboard extends Component {

    constructor(props) {
        super(props);
        var val = localStorage.getItem('email');
        this.state = {
            email: val,
            teamList: [],
            teamMembers : []
            //hackathonName : this.props.match.params.event_name
        }
    }
    componentDidMount() {
        axios.get( rooturl + 'judge/getTeamScores?hackathonId=' + this.props.match.params.id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    teamList: response.data
                })
            });

    }

    handleViewTeamMembers = (event) =>{
        const team_id = event.target.id;

        axios.get(rooturl + 'hackathon/get-team-members?teamId='+team_id)
            .then(response=>{
                console.log('res', response.data);
                this.setState({
                    teamMembers : response.data
                });
            });
    }

    render() {
       
        var teamList = null;
        var redirectVar = null;
        
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }
        var teamMemberList = null;
        if(this.state.teamMembers.length > 0){
            teamMemberList = this.state.teamMembers.map((teamMember, index)=>{
                return (
                    <a className={index == 0 ? "list-group-item list-group-item-action active": "list-group-item list-group-item-action"} key={index} >
                    {teamMember}
                </a>
                
                )
                                        
            });
        }


        if (this.state.teamList.length > 0) {
            teamList = this.state.teamList.map((team, index) => {
                return (
                    <tr key={index} className={index < 3 ? "table-light text-color-black": ""}>
                        <th scope="row">{index + 1}</th>
                        <td>{team.team_name}</td>
                        <td>
                            <button onClick={this.handleViewTeamMembers} id={team.id} data-toggle="modal" data-target="#exampleModal" className="ml-3 btn btn-info">View</button>
                            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title text-white" id="exampleModalLabel">Team List</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                    <div className="list-group text-white">
                                        {teamMemberList}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-success" data-dismiss="modal">Close</button>                                        
                                    </div>
                                    </div>
                                </div>
                                </div>    
                        </td>
                        <td>{team.score}</td>     
                        
                    </tr>
                )
            })
        }

                        return(
            <div>
                            <Header />
                            {redirectVar}
                            <div className="container mt-5">
                                <div className="pt-3 pb-3">
                                    <h3><strong>{this.state.hackathonName}</strong></h3>
                                </div>
                                <div>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Team Name</th>
                                            <th scope="col">Team Members</th>
                                            <th scope="col">Score</th>
                                            <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                         {teamList}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                        )
                    }
                }
                
export default HackathonScoreboard;