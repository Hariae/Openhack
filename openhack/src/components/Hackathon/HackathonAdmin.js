import React, { Component } from "react";
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { rooturl } from "../../config";
import { Redirect} from "react-router";
import { Link } from "react-router-dom";


class HackathonAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open_date: new Date(),
      close_date: new Date(),
      finalize_date : new Date(),
      current_date: new Date(),
      redirectToHome: false,
      hackathonData: "",
      openDateError : false,
      closeDateError : false,
      finalizeGradeError : false,
      reOpenError : false,
      hackathonSelectedForViewReport: 0,
      hackathonRegistrationAmount: 0,
      redirectToHackathonPaymentReportPage: false,
      redirectToHackathonEarningReportPage: false,
      finalizeDone : false,
      emailDeliveryDone : false,
      redirectToHackathonExpenseReportPage: false,
      invitee_email : "",
      showInvitePanel : false
    };

    //bind
    //this.handleChange = this.handleChange.bind(this);
    //this.createHackathon = this.createHackathon.bind(this);
  }
  componentDidMount(){
    axios.get(rooturl + 'hackathon?id=' + this.props.match.params.id)
            .then(response =>{
                if(response.status == 200){
                    this.setState({
                        hackathonData : response.data,
                        open_date : (response.data.open_date != null ? response.data.open_date : this.state.open_date),
                        close_date : (response.data.close_date != null ? response.data.close_date : this.state.close_date),
                        finalize_date : (response.data.finalize_date != null ? response.data.finalize_date : this.state.finalize_date)

                    });
                    console.log(response.data);
                }
            });
  }


  handleChangeHandler = (event) =>{
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
        [name]: value
    });

  }


  openHackathon = async () => {

    var isOpenAllowed = true;
    await axios.get(rooturl+'admin/isGradedHackathons?hackathonId='+this.props.match.params.id)
      .then(response =>{
          if(response.data == true){
            isOpenAllowed = false;
          }
      });

    if(isOpenAllowed === true){
      if(this.state.open_date > this.state.hackathonData.end_date){
        this.setState({
          openDateError : true
        });
      }
      else{
        
        
        var isStartDateChanged = false;
        if(this.state.open_date < this.state.hackathonData.start_date){
          isStartDateChanged = true;      
        } 
      
      var data = {
        hackathon_id: this.props.match.params.id,
        open_date: new Date(this.state.open_date),
        isStartDateChanged : isStartDateChanged,
        start_date : new Date(this.state.open_date)
      };
  
      console.log(data);
  
      axios
        .post(rooturl + "admin/open", data, {
          headers: { "Access-Control-Allow-Origin": "*" }
        })
        .then(response => {
          if (response.status === 200) {
            console.log("opened");
            this.setState({
              redirectToHome: true
            });
          }
        });
      }
   }
    else{
      this.setState({
        reOpenError : true
      });
    }

    

    
  };

  closeHackathon = () => {

    console.log(new Date(this.state.close_date) + 'date ' + this.state.open_date);
    console.log(this.state.close_date < this.state.open_date);


    if(this.state.close_date < this.state.open_date){
      this.setState({
        closeDateError : true
      });
    }
    else{
      var data = {
        hackathon_id: this.props.match.params.id,
        close_date: this.state.close_date
      };
  
      console.log(data);
      axios
        .post(rooturl + "admin/close", data, {
          headers: { "Access-Control-Allow-Origin": "*" }
        })
        .then(response => {
          if (response.status === 200) {
            console.log("closed");
            this.setState({
              redirectToHome: true
            });
          }
        });
    }

    
  };

  finalizeHackathon = () => {

    axios.get(rooturl + 'admin/isHackathonGraded?hackathonId=' + this.props.match.params.id)
      .then(responseData => {
        if(responseData.status === 200){
          console.log('reponse', );
          if(responseData.data == true){
            var data = {
              hackathon_id: this.props.match.params.id,
              finalize_date: this.state.finalize_date
            };
        
            console.log(data);
            axios
              .post(rooturl + "admin/finalize", data, {
                headers: { "Access-Control-Allow-Origin": "*" }
              })
              .then(response => {
                if (response.status === 200) {
                  var requestData = {
                    hackathon_id: this.props.match.params.id                    
                  };
                  
                  axios.post(rooturl + 'admin/send-leaderboard-emails', requestData)
                    .then(responseData =>{
                      if(responseData.status === 200){
                        console.log('respose+', response.data)
                        this.setState({
                          emailDeliveryDone : true
                        });
                      }
                    });

                  this.setState({
                    finalizeDone: true
                  });
                }
              });
          }
          else{
            this.setState({
              finalizeGradeError : true
            });
            
          }
        }
      });

    
  };

  paymentReport = (event) => {  
            this.setState({
                redirectToHackathonPaymentReportPage : true,
                hackathonSelectedForViewReport : this.props.match.params.id
            });
  }

  earningReport = (event) => {  
    this.setState({
        redirectToHackathonEarningReportPage : true,
        hackathonSelectedForViewReport : this.props.match.params.id,
    });
  }
expenseReport = (event) => {  
  this.setState({
      redirectToHackathonExpenseReportPage : true,
      hackathonSelectedForViewReport : this.props.match.params.id
  });
}

  
  handleOpenDateChange = (date) => {
    this.setState({
        open_date: date
    })
}

handleCloseDateChange = (date) => {
    this.setState({
        close_date: date
    })
}

handleFinalizeDateChange = (date) => {
  this.setState({
      finalize_date: date
  })
}


handleSendInvitation = () =>{

  var data = {
    hackathon_id : this.props.match.params.id,
    invitee_email : this.state.invitee_email
  }

  axios.post(rooturl + 'admin/send-hackathon-invitation', data)
    .then(response=>{
      if(response.status === 200){
        this.setState({
          invitationSent : true
        });
      }
    });
}

  render() {
    var redirectVar = null;
    
    if(localStorage.getItem('email') == null){
      redirectVar = <Redirect to="/login"/>
    }

    if (this.state.redirectToHome === true) {
      redirectVar = <Redirect to="/" />;
    }
    if(this.state.redirectToHackathonPaymentReportPage == true){
      redirectVar = <Redirect to={"/hackathon-payment-report/" + this.state.hackathonSelectedForViewReport }/>
  }
  if(this.state.redirectToHackathonEarningReportPage == true){
    redirectVar = <Redirect to={"/hackathon-earning-report/" + this.state.hackathonSelectedForViewReport}/> 
}
if(this.state.redirectToHackathonExpenseReportPage == true){
  redirectVar = <Redirect to={"/hackathon-add-expense/" + this.state.hackathonSelectedForViewReport }/>
}
    var openDateErrorPanel = null;

    if(this.state.openDateError === true){
      openDateErrorPanel = <div class="alert alert-danger">
      <a href="#" class="close" data-dismiss="alert" aria-label="close">
        &times;
      </a>
      <strong>Error!</strong> Open Date cannot be greater than End Date.
    </div>
    }

    var closeDateErrorPanel = null;

    if(this.state.closeDateError === true){
      openDateErrorPanel = <div class="alert alert-danger">
      <a href="#" class="close" data-dismiss="alert" aria-label="close">
        &times;
      </a>
      <strong>Error!</strong> Close Date cannot be before Open Date.
    </div>
    }

    var finalizeErrorPanel = null;

    if(this.state.finalizeGradeError === true){
      finalizeErrorPanel = <div class="alert alert-danger mt-3 col-lg-6 col-md-6 col-sm-12">
      <a href="#" class="close" data-dismiss="alert" aria-label="close">
        &times;
      </a>
      <strong>Error!</strong> Cannot finalize hackathon! Grading process incomplete.
    </div>
    }

    var reOpenErrorPanel = null;

    if(this.state.reOpenError === true){
      reOpenErrorPanel = <div class="alert alert-danger">
      <a href="#" class="close" data-dismiss="alert" aria-label="close">
        &times;
      </a>
      <strong>Error!</strong> Re-opening not allowed!
    </div>
    }
    var disabled = false;
    {(this.state.finalize_date >= this.state.current_date) ? disabled=false : disabled=true }

    var finalizeMessagePanel = null;

    if(this.state.finalizeDone === true){
      finalizeMessagePanel = <div class="alert alert-success mt-3 col-lg-6 col-md-6 col-sm-12">
      <a href="#" class="close" data-dismiss="alert" aria-label="close">
        &times;
      </a>
      <strong>Finalize Operation success! Sending leader Board emails</strong> 
    </div>
    }

    if(this.state.emailDeliveryDone === true){
      finalizeMessagePanel = <div class="alert alert-success mt-3 col-lg-6 col-md-6 col-sm-12">
      <a href="#" class="close" data-dismiss="alert" aria-label="close">
        &times;
      </a>
      <strong>Mails Delivered!</strong> 
      <button className="btn btn-lg btn-home col-lg-2 col-md-2 col-sm-12 ml-3" 
      onClick={()=> this.setState({
        redirectToHome : true
      })}
      >Home</button>
    </div>
    }

    var invitePanelContent = null;

    if(this.state.showInvitePanel === true){
      invitePanelContent =   <div>
      <div>
        <h3 className="text-color-white">Invite a non-member</h3> 
        <p>Enter email below to invite the person to participate in the hackathon.</p>                
      </div>
      <div>
        <div className="form-group mt-3">
            <input type="text" name="invitee_email" id="invitee_email" className="form-control form-control-lg col-lg-6 col-md-6 col-sm-12" 
            placeholder="Enter invitee email" value = {this.state.invitee_email} onChange={this.handleChangeHandler}/>
        </div>
        <div className="form-group">
          <button className="btn btn-lg btn-send-invite" onClick={this.handleSendInvitation}>Send Invite</button>
        </div>
      </div>
    </div>
    }
    else{
      invitePanelContent = <div className="text-color-white">
      <h2><Link onClick={()=>{
        this.setState({
          showInvitePanel : !this.state.showInvitePanel
        });
      }}>Invite someone to hackathon?</Link></h2>
    </div>
    }
    

    return (
      <div>
        {redirectVar}
        <div>
          <Header />
          <div className="container">
            <div className=" pt-3 pb-3">
              <h3>
                <strong>Hackathon: {this.state.hackathonData.event_name}</strong>
              </h3>
              <div className="form-group">
                  <button className="btn btn-lg col-lg-4 col-md-2 col-sm-12 ml-3"
                  onClick={this.paymentReport}>
                  Registration Fee Payment Report
                </button>
                  <button className="btn btn-lg col-lg-3 col-md-2 col-sm-12 ml-3"
                  onClick={this.earningReport}>
                  Hackathon Earning Report
                </button>
                  <button className="btn btn-lg col-lg-2 col-md-2 col-sm-12 ml-3"
                  onClick={this.expenseReport} disabled={disabled}>
                  Add Expense 
                </button>
              </div>
            </div>
            <div>
              <p>
              {this.state.hackathonData.description}
              </p>
            </div>
            <div>
              <p>Maximum Team Size: {this.state.hackathonData.max_size}</p> 
            </div>
            <div>
              <p>Minimum Team Size:  {this.state.hackathonData.min_size}</p> 
            </div>
            <div>
              <p>Registration Fee: $ {this.state.hackathonData.registration_fee}</p>
            </div>
            <div>
              <p>Sponsor Discount:  {this.state.hackathonData.sponsor_discount}%</p>
            </div>
            <div>
              <p>Start Date:  {new Date(this.state.hackathonData.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p>End Date:  {new Date(this.state.hackathonData.end_date).toLocaleDateString()}</p>
            </div>

            <div>
              <p>Open Date:  {this.state.hackathonData.open_date != null ? new Date(this.state.hackathonData.open_date).toLocaleDateString() : "NA"}</p>
            </div>
            
            <div>
              <p>Close Date:  {this.state.hackathonData.close_date != null ? new Date(this.state.hackathonData.close_date).toLocaleDateString() : "NA"}</p>
            </div>
            
            <div>
              <p>Finalize Date:  {this.state.hackathonData.finalize_date != null ? new Date(this.state.hackathonData.finalize_date).toLocaleDateString() : "NA"}</p>
            </div>

            <div className="mt-5">
              <div className="form-group">
                <DatePicker name="open_date" id="opendate" className="form-control form-control-lg" placeholder="Open date" selected={this.state.open_date} onChange={this.handleOpenDateChange} />
                <button
                  className="btn btn-lg btn-register col-lg-2 col-md-2 col-sm-12 ml-3"
                  onClick={this.openHackathon}>
                  Open
                </button>
                
                
              </div>
              <div className="form-group col-lg-6 col-md-6 col-sm-12">
                {openDateErrorPanel}  
                {reOpenErrorPanel}
              </div>
              <div className="form-group">
                  <DatePicker name="close_date" id="closedate" className="form-control form-control-lg" placeholder="Close date" selected={this.state.close_date} onChange={this.handleCloseDateChange} />
                  <button
                  className="btn btn-lg close-hack-btn col-lg-2 col-md-2 col-sm-12 ml-3"
                  onClick={this.closeHackathon}>
                  Close 
                </button>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-sm-12">
                {closeDateErrorPanel}
              </div>

              <div className="form-group">
                  <DatePicker name="finalize_date" id="finalizedate" className="form-control form-control-lg" placeholder="Finalize date" selected={this.state.finalize_date} onChange={this.handleFinalizeDateChange} />
                  <button className="btn btn-lg finalize-hack-btn col-lg-2 col-md-2 col-sm-12 ml-3"
                  onClick={this.finalizeHackathon}>
                  Finalize 
                </button>
                  {/* <div className="col-lg-6 col-md-6 col-sm-12"> */}
                  {finalizeErrorPanel}
                {/* </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                  */}{finalizeMessagePanel} 
                {/* </div> */}
              </div>
                      
              {/* <div className="form-group row">
                
                {/* <br />
                <br />
                <button
                  className="btn btn-lg close-hack-btn col-lg-3 col-md-3 col-sm-12 ml-5"
                  onClick={this.closeHackathon}
                >
                  Close Hackathon
                </button> */}
                {/* <button className="btn btn-lg finalize-hack-btn col-lg-3 col-md-3 col-sm-12 ml-5">
                  Finalize Hackathon
                </button>
              </div>
              <div className="form-group">
                
              </div> */}
              <div className="mt-5 mb-5">
                
                {invitePanelContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HackathonAdmin;
