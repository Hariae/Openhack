import React,{Component} from "react";
import Header from "../Header/Header";
import axios from 'axios';
import {rooturl} from '../../config';
import { Redirect } from 'react-router';
import ReactLoading from 'react-loading';


class HackathonResults extends Component{

    constructor(props){
        super(props);
        console.log(props);

        this.state = {
            hackathonData : [],
            redirectToLeaderboard : false,
            selectedIndex : 0,
            loader : false
        }
    }

    componentDidMount(){
        axios.get(rooturl + 'hackathon/get-finalized-hackathons')
            .then(response=>{
                if(response.status === 200){
                    this.setState({
                        hackathonData : response.data,
                        loader : true
                    });
                    console.log('data' , response.data);
                }
            });
    }

    handleSearchChange = (event) =>{
        const target = event.target;
        const searchTerm = target.value;
        const name = target.name
 
        var searchResult= this.state.hackathonData.filter(obj=>obj.event_name.includes(searchTerm));
        
         this.setState({
             hackathonData : searchResult,
             [name] : searchTerm
        });
     }

     handleViewResultsClick = (event) =>{
        const index = event.target.id;

        this.setState({
            redirectToLeaderboard : true,
            selectedIndex : index
        })
     } 


    render(){
        var hackathonDataList = null;
        var redirectVar = null;
        if (localStorage.getItem('email') == null) {
            redirectVar = <Redirect to="/login" />
        }
        if(this.state.hackathonData.length > 0){
            hackathonDataList = this.state.hackathonData.map((hackathon, index)=>{
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
                               <button className="btn btn-lg hack-view-btn" id={hackathon.id} onClick={this.handleViewResultsClick}>View Results</button>
                           </div>
                       </div>
                      
                   </div>
                   </div>
                )
               
           });
        }


        if(this.state.redirectToLeaderboard === true){
            redirectVar = <Redirect to={"/hackathon-scoreboard/" + this.state.selectedIndex} />
        }

        if(this.state.loader === false){
            hackathonDataList = <div className="center-content loader-container">
                 <ReactLoading type={'balls'} color={'#ffffff'} height={'75%'} width={'20%'} />
             </div>
        }

        return(
            <div>
                <Header/>
                {redirectVar}
                <div className="container mt-5">
                    <div className="mb-5">
                        <h3>Hackathon Results Page</h3>
                    </div>
                    <div className="form-group mb-5">
                        <input type="text" className="form-control form-control-lg col-lg-8 col-md-8 col-sm-12" 
                        placeholder="Search for a hackathon.." alue= {this.state.searchhacker} onChange = {this.handleSearchChange} />
                    </div>
                    {hackathonDataList}
                </div>
               
            </div>
        )
    }
}

export default HackathonResults;
