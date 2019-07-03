import React, { Component } from "react";
import axios from "axios";
import Header from "../Header/Header";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router";
import { rooturl } from "../../config";

class Signup extends Component {
 constructor(props) {
   super(props);
   this.state = {
     redirectToLogin: false,
     errorPanel: false,
     errorPanelEmail: false,
     errorPanelScreenName: false
   };

   //bind
   //this.handleGoogleSignin  = this.handleGoogleSignin.bind(this);
   this.responseGoogle = this.responseGoogle.bind(this);
   this.signupHandler = this.signupHandler.bind(this);
 }

 handleChangeHandler = event => {
   const target = event.target;
   const name = target.name;
   const value = target.value;

   this.setState({
     [name]: value
   });
 };

 responseGoogle = response => {
   console.log("Inside response", response.profileObj.email);

   if (this.state.screen_name != null) {
     var data = {
       email: response.profileObj.email,
       password: "",
       screen_name: this.state.screen_name
     };
     console.log(data.screen_name);
     axios
       .post(rooturl + 'user/signup', data, {
         headers: { "Access-Control-Allow-Origin": "*" }
       })
       .then(res => {
         if (res.status === 200) {
           console.log("Result : ", res);
           this.setState({
             redirectToLogin: true
           });
         }
       });

     console.log(response);
   } else {
     this.setState({
       errorPanel: true
     });
   }
 };

 signupHandler() {
   console.log("Inside login");
   var data = {
     email: this.state.email,
     password: this.state.password,
     screen_name: this.state.screen_name
   };
   axios
     .post(rooturl + 'user/signup', data, {
       headers: { "Access-Control-Allow-Origin": "*" }
     })
     .then(res => {
       if (res.status === 200) {
         console.log("Result : ", res);
         this.setState({
           redirectToLogin: true
         });
       }
     })
     .catch(error => {
      if (error.response.status === 400) {
        this.setState({
          errorPanelEmail: true,
          errorPanelScreenName: false
        });
      }
      if (error.response.status === 412) {
        this.setState({
          errorPanelEmail: false,
          errorPanelScreenName: true
        });
      }
    });
};
     

 render() {
   var redrirectVar = null;

   if (this.state.redirectToLogin === true) {
     redrirectVar = <Redirect to="/login" />;
   }

  //  checking for valid email and screen name
   var emailValidation, passwordValidation, screenNameValidation = null;
   var signupButton = (<button className="btn btn-login col-lg-12 col-md-12 col-sm-12 disabled" role="button" aria-disabled="true">Signup{" "}</button>)
  
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)==false) {
    emailValidation = ( <p className="text-danger">Enter a valid email address</p>)
  }
   else {
     emailValidation = null;
     if(screenNameValidation==null) signupButton = (<button className="btn btn-login col-lg-12 col-md-12 col-sm-12" onClick={this.signupHandler}>Signup{" "}</button>)
   }
    if (/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){3,25}$/.test(this.state.screen_name)==false) {
    screenNameValidation = ( <p className="text-danger">Enter a valid screen name</p>)
    signupButton = (<button className="btn btn-login col-lg-12 col-md-12 col-sm-12 disabled" role="button" aria-disabled="true">Signup{" "}</button>)
  }
   else {
    screenNameValidation = null;
     signupButton = (<button className="btn btn-login col-lg-12 col-md-12 col-sm-12" onClick={this.signupHandler}>Signup{" "}</button>)
   }
   if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)==false || /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){3,25}$/.test(this.state.screen_name)==false) {
    signupButton = (<button className="btn btn-login col-lg-12 col-md-12 col-sm-12 disabled" role="button" aria-disabled="true">Signup{" "}</button>)
   }
   if(/^\s*$/.test(this.state.password)==true) {
    signupButton = (<button className="btn btn-login col-lg-12 col-md-12 col-sm-12 disabled" role="button" aria-disabled="true">Signup{" "}</button>)
   }
   else {
    passwordValidation = null;
   }
   if(this.state.email==undefined || this.state.email.length==0) emailValidation = null;
   if(this.state.screen_name==undefined || this.state.screen_name.length==0) screenNameValidation = null;
   var errorPanel = null;


   if (this.state.errorPanel === true) {
     errorPanel = (
       <div class="alert alert-danger">
         <a href="#" class="close" data-dismiss="alert" aria-label="close">
           &times;
         </a>
         <strong>Error!</strong> Enter a screen name.
       </div>
     );
   }

   var errorPanelEmail = null;
   if (this.state.errorPanelEmail === true) {
     errorPanelEmail = (
       <div class="alert alert-danger">
         <a href="#" class="close" data-dismiss="alert" aria-label="close">
           &times;
         </a>
         <strong>Error!</strong> Email Already Exists
       </div>
     );
   }

   var errorPanelScreenName = null;
   if (this.state.errorPanelScreenName === true) {
     errorPanelScreenName = (
       <div class="alert alert-danger">
         <a href="#" class="close" data-dismiss="alert" aria-label="close">
           &times;
         </a>
         <strong>Error!</strong> ScreenName already exists
       </div>
     );
   }


   return (
     <div>
       <Header />
       <div className="container fill-graywhite mt-5">
         {redrirectVar}
         <div className="container content">
           <div className="login-container">
             <div>
               <p className="text-color-white">
                 Create an account with Openhack
               </p>
               <p className="text-color-white">
                 Already have an account? <a href="/login">Login</a>
               </p>
             </div>
             <div className="login-form-container col-lg-4 col-md-4 col-sm-12 offset-lg-4 offset-md-4 border">
               <div className="login-form-heading input-group pad-top-10 input-group-lg mt-2">
                 Welcome to Openhack
               </div>
               <hr />
               {/* {errorPanel} */}
               {/* {formErrorPanel} */}
               <div className="form-group login-form-control">
                 <input
                   type="text"
                   name="email"
                   id="email"
                   className="form-control form-control-lg"
                   placeholder="Email Address"
                   onChange={this.handleChangeHandler}
                 />
               </div>
               {emailValidation}
               <div className="form-group login-form-control">
                 <input
                   type="password"
                   name="password"
                   id="password"
                   className="form-control form-control-lg"
                   placeholder="Password"
                   onChange={this.handleChangeHandler}
                 />
               </div>
               {passwordValidation}
               <div className="form-group login-form-control">
                 <input
                   type="text"
                   name="screen_name"
                   id="screen_name"
                   className="form-control form-control-lg"
                   placeholder="Enter a Screen Name"
                   onChange={this.handleChangeHandler}
                 />
               </div>
               {screenNameValidation}
               {errorPanel}
                 {errorPanelEmail}
                 {errorPanelScreenName}
               <div className="form-group login-form-control mt-5">
               {signupButton}
                 {/* <button
                   className="btn btn-login col-lg-12 col-md-12 col-sm-12"
                   onClick={this.signupHandler}
                 >
                   Signup{" "}
                 </button> */}
               </div>
               <hr />
               {/* <div className="form-group login-form-control">
                                   <button className="btn fb-btn col-lg-12 col-md-12 col-sm-12">
                                       <img className="fb-logo flt-left" src={require('../../Static/Images/584ac2d03ac3a570f94a666d.png')} alt="fb-logo"></img>
                                      Sign up with Facebook</button>
                               </div> */}
               {/* <div className="form-group login-form-control">
                                   <button className="btn google-btn col-lg-12 col-md-12 col-sm-12">
                                       <span>
                                           <img className="google-logo flt-left" src={require('../../Static/Images/google-svg.svg')} alt="google-logo"></img></span>
                                       Sign up with Google</button>
                               </div> */}
               <div className="form-group login-form-control">
                 <GoogleLogin
                   clientId="592718946214-f18slm9j7ik1ia0hpecmfh0mlvmqrefg.apps.googleusercontent.com"
                   onSuccess={this.responseGoogle}
                   onFailure={this.responseGoogle}
                   cookiePolicy={"single_host_origin"}
                   className="btn btn-google col-lg-12 col-md-12 col-sm-12"
                   buttonText="Sign up with Google"
                   icon={false}
                 >
                   <span>
                     <img
                       className="google-logo flt-left"
                       src={require("../../Static/Images/google-svg.svg")}
                       alt="google-logo"
                     />
                   </span>
                   <b className="ml-5 google-btn-text">Signup With Google</b>
                 </GoogleLogin>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
}

export default Signup;


