import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import {rooturl} from '../../config';
import { Redirect } from 'react-router';

class HackathonSubmission extends Component{

    constructor(props){
        super(props);
        console.log(props);

        this.state = {
            hackathonData : "",
            redirectToHome : false,
            isApproved : false, 
            isOpen : false,
            isClosed : false
        }
    }

    componentDidMount(){
        axios.get(rooturl + 'hackathon?id=' + this.props.match.params.id)
        .then(response =>{
            if(response.status == 200){
                
                console.log(new Date() >= new Date(response.data.open_date));
                if(new Date() >= new Date(response.data.open_date) && response.data.open_date != null){
                    if(response.data.close_date != null && new Date() > new Date(response.data.close_date)){
                        this.setState({
                            isClosed : true,
                            hackathonData : response.data                     
                        })
                    }
                    else{
                        
                        this.setState({
                            hackathonData : response.data,
                            isOpen : true                        
                        });
                        
                        
                    }
                    
                }
                else{
                    this.setState({
                        hackathonData : response.data
                    });
                }
                
                
            }
        });

        axios.get(rooturl + 'hackathon/get-hackathon-registration?team_id=' + this.props.match.params.teamId)
            .then(response=>{
                console.log(response.data);

                this.setState({
                    isApproved : response.data.approved
                });

            });
    }

    handleChange = (event) =>{
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = ()=>{
        var data = {
            team_id : this.props.match.params.teamId,
            submission_url : this.state.submission_url
        }

        console.log(data.team_id + ' ' + this.state.submission_url);
        axios.post(rooturl + 'hackathon/add-submission', data)
            .then(response =>{
                if(response.status === 200){
                    this.setState({
                        redirectToHome : true
                    })
                }
                
            });


    }

    render(){

        var redirectVar = null;

        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
        }
        
        if(this.state.redirectToHome === true){
            redirectVar = <Redirect to="/" />
        }

        var submissionViewContent = null;

        if(this.state.isApproved === true && this.state.isOpen === true){
            submissionViewContent = <div className="">
            <div className="mt-5">
                <div>
                    <h3><strong>Submission URL</strong></h3>
                </div>
                <div className="form-group mt-3">
                    <input type="text" name="submission_url" id="submission_url" className="form-control form-control-lg col-lg-6 col-md-6 col-sm-12" placeholder="Enter Submission URL" onChange={this.handleChange} />
                </div>

            </div>
            <div className="form-group">
                <button className="btn btn-lg hack-submit-btn" onClick={this.handleSubmit}>Submit</button>
            </div>
        </div>
        }
        else{
            if(this.state.isOpen === true){
                submissionViewContent = <div class="alert alert-danger alert-dismissible">
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Alert!</strong> Submission will be opened after all the team members have completed the payment process!
              </div>
            }
            else if(this.state.isClosed === true){
                submissionViewContent = <div class="alert alert-danger alert-dismissible">
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Alert!</strong> Hackathon is closed for submission! 
              </div>
            }
            else{
                submissionViewContent = <div class="alert alert-danger alert-dismissible">
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Alert!</strong> Hackathon is not open for submission! Contact the admin
              </div>
            }
            
        }

        return(
            <div>
                <Header/>
                {redirectVar}
                <div className="container">
                    <div className="pt-3 pb-3">
                        <h3><strong>{this.state.hackathonData.event_name}</strong></h3>
                    </div>
                    <div>
                        <p>{this.state.hackathonData.description}</p>
                    </div>
                    {submissionViewContent}
                    
                </div>
                
            </div>
        )
    }
} 

export default HackathonSubmission;