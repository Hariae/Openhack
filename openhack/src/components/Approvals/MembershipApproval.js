import React, {Component} from 'react';
import Header from '../Header/Header';

class MembershipApproval extends Component{
    render(){
        return(
            <div>
            <Header/>
            <div className="container mt-5 center-content">
                <div className="mt-3 mb-3"> 
                    <div className="text-color-white">
                        <h4><strong>Do you want to approve the membership?</strong></h4>
                    </div>
                    <div className="mt-4">
                        <span className="col-lg-4 col-md-12 col-sm-12 col-xs-12 pad-bot-10">
                            <button className="btn btn-lg yes-btn">Yes</button>
                        </span>
                        <span className="col-lg-4 col-md-12 col-sm-12 col-xs-12 pad-bot-10 ml-2">
                            <button className="btn btn-lg no-btn">No</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default MembershipApproval;