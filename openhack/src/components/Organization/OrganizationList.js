import React, {Component} from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Redirect } from 'react-router';
import { rooturl } from "../../config";

class OrganizationList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OrganizationList: [],
            redirectToDetailsPage : false,
            hackathonSelected : 0,
            flag: true
        }
        this.handleViewDetails = this.handleViewDetails.bind(this);

    }
    componentDidMount(){
        console.log('Inside component did mount');
        axios.get(rooturl+'organizationCreation/getAllOrganizations')
            .then(response =>{
                console.log(this.state.organizationList==undefined);

                this.setState({
                    OrganizationList : response.data
                });
            });
    

    }
    handleViewDetails = (event)=>{

        const index = event.target.id;

        this.setState({
            redirectToDetailsPage : true,
            hackathonSelected : index,
        });
    }
    render(){
        var redirectVar = null;
        if(localStorage.getItem('email') == null){
            redirectVar = <Redirect to="/login"/>
          }

        var organizationList = null;
        var loader = null;
        var redirectVar = null;

        if(this.state.OrganizationList!=undefined){
            console.log('Data present',this.state.OrganizationList);
            organizationList = this.state.OrganizationList.map((organization, index)=>{
                 return (
                     <div className="display-hackathon-container mt-3 mb-5">
                    <div className="container mt-3 mb-5" key = {index}>
                        <div className="ml-3 mt-3">
                            <h4><strong>{organization.name}</strong></h4>
                            <div className="form-group mt-3">
                                <button className="btn btn-lg hack-view-btn" id={organization.id} onClick={this.handleViewDetails}>Join</button>
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

        if(this.state.redirectToDetailsPage === true){
            redirectVar = <Redirect to={"/hackathon/" + this.state.hackathonSelected} />
        }

        

        return(
            <div>
                <Header/>
                {redirectVar}
                <div className="container mt-5 text-color-white"> 
                    {loader}
                    {organizationList}
                </div>
            </div>
        )
    }
}
export default OrganizationList;