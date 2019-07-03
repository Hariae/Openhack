import React, {Component} from 'react';
import {Link} from 'react-router-dom';
class Header extends Component{

    constructor(props){
        super(props);
        console.log(props);

        this.state = {
            removeItem : false,
            isAdmin : false
        }

    }

    handleLogout = ()=>{
        localStorage.clear();
        this.setState({
            refresh : true
        });
    }

    componentDidMount(){
        if(localStorage.email == null){
            this.setState({
                removeItem : true
            });
        }

        if(localStorage.role == 'admin'){
            this.setState({
                isAdmin : true
            });
        }
    }

    render(){

        var adminContent = null;
        var hackerContent = null;

        if(this.state.isAdmin == true){
            adminContent = <Link className="flt-right mt-5 header-links mr-3" to="/hackathon-admin/create">CREATE HACKATHON</Link>
        }
        else {
            hackerContent = <Link className="flt-right mt-5 header-links mr-3" to="/hackathonstobegraded">GRADE HACKATHONS</Link>
        }

        if(this.state.isAdmin == false){
            hackerContent = <Link className="flt-right mt-5 header-links mr-3" to="/hackathonstobegraded">GRADE HACKATHONS</Link>
        }



        var headerContent = null;
        if(this.state.removeItem === true){
            headerContent = 
            <div className="header-bar" >
                <Link to="/"><img className="logo-openhack" src={require('../../Static/Images/openhack-logo.png')} alt="logo-openhack" /></Link>            
            </div>            
        }
        else{
            headerContent = 
        <div className="header-bar" >
                    <Link to="/"><img className="logo-openhack" src={require('../../Static/Images/openhack-logo.png')} alt="logo-openhack" /></Link>
                    <Link className="flt-right mt-5 ml-3 header-links" onClick={this.handleLogout}>LOGOUT</Link>
                <Link className="flt-right mt-5 header-links" to="/profile">PROFILE</Link>
                    {hackerContent}
                    {adminContent}
                    <Link className="flt-right mt-5 header-links mr-3" to="/hackathon-results">RESULTS</Link>
                </div>
        
        }
        
        return(
            <div className="container header-container">
                {headerContent}
            </div>
        )
    }
}

export default Header;