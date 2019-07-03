import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Profile from './Profile/Profile';
import Home from './Home/Home';
import Hackathon from './Hackathon/Hackathon';
import HackathonSubmission from './Hackathon/HackathonSubmission';
import HackathonPayment from './Hackathon/HackathonPayment';
import HackathonCreation from './Hackathon/HackathonCreation';
import HackathonGrading from './Hackathon/HackathonGrading';
import AccountVerification from './Approvals/AccountVerification';
import MembershipApproval from './Approvals/MembershipApproval';
import Organization from './Organization/Organization';
import OrganizationList from './Organization/OrganizationList';
import MyOrganization from './Organization/MyOrganization';
import HackathonAdmin from './Hackathon/HackathonAdmin';
import HackathonPaymentReport from './Hackathon/HackathonPaymentReport';
import HackathonEarningReport from './Hackathon/HackathonEarningReport';
import AddExpense from './Hackathon/AddExpense';
import IndividualOrganizationDetails from './Organization/IndividualOrganizationDetails';
import HackathonsToBeGraded from './Hackathon/HackathonsToBeGraded'
import HackathonScoreboard from './Hackathon/HackathonScoreboard'
import HackathonResults from './Hackathon/HackathonResults';

class Main extends Component{
    render(){
        return(
        <div>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/profile" component={Profile}/>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route exact path="/hackathon/:id" component={Hackathon} />
            <Route path="/hackathon/submission/:id/:teamId" component={HackathonSubmission} />
            <Route path="/hackathon/payment/:id/:teamId/:memberId" component={HackathonPayment} />

            {/* /**Admin */ }
            <Route path="/hackathon-admin/create" component={HackathonCreation} />
            <Route path="/hackathon-admin/edit/:id" component={HackathonAdmin} />
            <Route path="/hackathon-payment-report/:id" component={HackathonPaymentReport} />
            <Route path="/hackathon-earning-report/:id/" component={HackathonEarningReport} />
            <Route path="/hackathon-add-expense/:id/" component={AddExpense} />
            {/* /**Judge */ }
            <Route path="/hackathon-grading/:id" component={HackathonGrading} /> 
            <Route path="/hackathonstobegraded" component={HackathonsToBeGraded} /> 
            <Route path="/hackathon-scoreboard/:id" component={HackathonScoreboard} /> 
            {/* /**Approvals */ }
            <Route path="/verify-account/:id" component={AccountVerification} />
            <Route path="/membership-approval" component={MembershipApproval} />
            <Route path="/Organization" component={Organization}/>
            <Route path="/OrganizationList" component={OrganizationList}/>
            <Route path="/MyOrganization" component={MyOrganization}/>
            <Route path="/IndividualOrganizationDetails" component={IndividualOrganizationDetails}/>

            <Route path="/hackathon-results" component={HackathonResults} />

        </div>
        )
        
    }
}

export default Main;