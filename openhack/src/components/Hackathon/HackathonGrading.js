import React, { Component } from 'react';
import Header from '../Header/Header';
import { rooturl } from '../../config';
import axios from 'axios';
import { Redirect } from 'react-router';
class HackathonGrading extends Component {

    constructor(props) {
        super(props);
        var val = localStorage.getItem('email');
        this.state = {
            email: val,
            teamList: []
        }
    }
    componentDidMount() {
        axios.get(   rooturl + 'judge/getTeams?email=' + this.state.email + '&hackathon_id=' + this.props.match.params.id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    teamList: response.data
                })
            });

    }

    handleScoreChange = (event, hackathon)=>{
        const target = event.target;
        const name = target.name;
        const value = target.value;
        hackathon.score = value;
        this.setState({
            score: this.state.score,
        }); 

    }
    
    
    submitScore = (event, hackathon) =>{
        var target = event.target;
        console.log(hackathon.score);
        if(hackathon.score <0 || hackathon.score >10){
            alert("Please enter a value between a and 10");   
          }
        else{
        var data = {
            team_name : hackathon.team_name,
            score : hackathon.score
        }
     
        axios.post(rooturl + 'hackathonregistration/updatescore', data)
        .then(response=>{
            if(response.status == 200){
                alert("Score Submitted");
            }
        }); 
    }
}
    render() {
       
        var teamList = null;
        var redirectVar = null;
        
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }

        if (this.state.teamList.length > 0) {
            teamList = this.state.teamList.map((hackathon, index) => {
                return (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{hackathon.team_name}</td>
                        <td>{hackathon.submission_url}</td>
                        <td>
                            <input type="text"  name = "score" id ="score" value = {this.state.score} className="form-control-sm" placeholder="0-10" onChange= {(event) => this.handleScoreChange(event, hackathon)}/>
                        </td>
                        <td>
                            <button className="btn btn-sm score-btn" onClick={(event) => this.submitScore(event, hackathon)} >Submit</button>
                        </td>
                    </tr>
                )
            })
        }

                        return(
            <div>
                            <Header />
                            {redirectVar}
                            <div className="container mt-5">
                              
                                <div>
                                    <table className="table">
                                        <thead>
                                            <th scope="col">#</th>
                                            <th scope="col">Team Name</th>
                                            <th scope="col">Submission URL</th>
                                            <th scope="col">Score</th>
                                            <th scope="col"></th>
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
                
export default HackathonGrading;