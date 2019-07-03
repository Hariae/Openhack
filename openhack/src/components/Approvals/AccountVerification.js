import React, { Component } from "react";
import Header from "../Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { rooturl } from "../../config";
import { Redirect } from "react-router";

class AccountVerification extends Component {
 constructor(props) {
   super(props);
   console.log(props);

   this.state = {
     redirectToHome: false,
     redirectToLogin: false
   };
 }

 verifyComplete = () => {
   var data = {
     user_id: this.props.match.params.id
   };

   console.log(data);

   axios
     .post(rooturl + "user/process-verification", data, {
       headers: { "Access-Control-Allow-Origin": "*" }
     })
     .then(response => {
       if (response.status === 200) {
         console.log("signed up");
         this.setState({
           redirectToLogin: true
         });
       }
     });
 };

 verifyCancel = () => {
   this.state.redirectToHome = true;
 };

 render() {
   var redirectVar = null;

   if (this.state.redirectToHome === true) {
     redirectVar = <Redirect to="/" />;
   }
   if (this.state.redirectToLogin === true) {
     redirectVar = <Redirect to="/login" />;
   }

   return (
     <div>
       {redirectVar}
       <div>
         <Header />
         <div className="container mt-5 center-content">
           <div className="mt-3 mb-3">
             <div className="text-color-white">
               <h4>
                 <strong>Do you want to verify your account?</strong>
               </h4>
             </div>
             <div className="mt-4">
               <span className="col-lg-4 col-md-12 col-sm-12 col-xs-12 pad-bot-10">
                 <button
                   className="btn btn-lg yes-btn"
                   onClick={this.verifyComplete}
                 >
                   Yes
                 </button>
               </span>
               <span className="col-lg-4 col-md-12 col-sm-12 col-xs-12 pad-bot-10 ml-2">
                 <button
                   className="btn btn-lg no-btn"
                   onClick={this.verifyCancel}
                 >
                   No
                 </button>
               </span>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
}

export default AccountVerification;
