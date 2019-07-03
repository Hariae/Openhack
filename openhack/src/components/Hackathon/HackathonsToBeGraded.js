import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import {rooturl} from '../../config';
import ReactLoading from 'react-loading';
import { Redirect } from 'react-router';

class HackathonsToBeGraded extends Component{

    constructor(props){
        super(props);
        var val = localStorage.getItem('email');
        this.state = {
            redirectToGradingPage : false,
            hackathonSelected : 0,
            hackathonData : [],
            email : val,
            scoreBoard : [],
            redirectToScoreboardPage : false
        }

        this.handleGradingPage = this.handleGradingPage.bind(this);
        this.handleScoreboardPage = this.handleScoreboardPage.bind(this);
    }

    componentDidMount() {
        console.log('Inside component did mount');
        axios.get(rooturl + 'judge/viewhackathonstobegraded?email=' + this.state.email)
            .then(response =>{
                console.log(response.data);

                this.setState({
                    hackathonData : response.data,
                });
            });

            axios.get(rooturl + '/judge/viewscoreboardhackathon?email=' + this.state.email)
            .then(response =>{
                console.log(response.data);

                this.setState({
                    scoreBoard : response.data,
                });
            });
        }



            
     handleGradingPage = (event)=>{

        const index = event.target.id;
            this.setState({
                redirectToGradingPage : true,
                hackathonSelected : index
            });
        }
    
        handleScoreboardPage = (event)=>{

            const index = event.target.id;
                this.setState({
                    redirectToScoreboardPage : true,
                    hackathonSelected : index
                });
            }

        

    render(){

        var hackathonData = null;
        var redirectVar = null;
        var scoreBoard = null;
        
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }


        if (this.state.hackathonData.length > 0) {
            hackathonData = this.state.hackathonData.map((hackathon, index) => {
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
                                        <button className="btn btn-lg hack-view-btn" id={hackathon.id} onClick={this.handleGradingPage}>View Teams</button>
                                    </div>
                                </div>
                               
                            </div>
                            </div>

                         )
                        });
                    }

                if (this.state.scoreBoard.length > 0) {
                    scoreBoard = this.state.scoreBoard.map((hackathon, index) => {
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
                                                    <button className="btn btn-lg hack-view-btn" id={hackathon.id} onClick={this.handleScoreboardPage}>View Scoreboard</button>
                                                </div>
                                            </div>
                                           
                                        </div>
                                        </div>
            
                                     )
                                    });
                                }

                    
        if(this.state.redirectToGradingPage === true){
            redirectVar = <Redirect to={"/hackathon-grading/" + this.state.hackathonSelected } />
        }

        if(this.state.redirectToScoreboardPage === true){
            redirectVar = <Redirect to={"/hackathon-scoreboard/" + this.state.hackathonSelected} />
        }

        
        return(
            <div>
                <Header/>
                {redirectVar}
                <br/>
                <div className="mt-5">
                        {hackathonData}  
                        {scoreBoard}                  
                    </div>
                   

                </div>
        )
    }
}

export default HackathonsToBeGraded;





