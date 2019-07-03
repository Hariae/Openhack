import React, { Component } from "react";
import axios from "axios";
import Header from "../Header/Header";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router";
import { rooturl } from "../../config";

class Login extends Component {
 constructor(props) {
   super(props);
   this.state = {
     redirectToHome: false,
     errorPanel: false,
     errorPanelNot: false,
     loginFormError : false
   };

   //bind
   //this.handleGoogleSignin  = this.handleGoogleSignin.bind(this);
   this.loginHandler = this.loginHandler.bind(this);
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

   var data = {
     email: response.profileObj.email,
     password: ""
   };
   axios
     .post(rooturl+"user/login", data, {
       headers: { "Access-Control-Allow-Origin": "*" }
     })
     .then(res => {
       if (res.status === 200) {
         console.log("Result : ", res);
         localStorage.setItem("email", response.profileObj.email);
         if (res.data.role == true) {
           localStorage.setItem("role", "admin");
         } else {
           localStorage.setItem("role", "hacker");
         }
         this.setState({
           redirectToHome: true
         });
       }
     })
     .catch(error => {
       if (error.response.status === 401) {
         this.setState({
           errorPanel: true,
           errorPanelNot: false
         });
       }
       if (error.response.status === 404) {
         this.setState({
           errorPanelNot: true,
           errorPanel: false
         });
       }
     });

   // console.log(response);
   // localStorage.setItem("email", response.profileObj.email);
   // this.setState({
   //   redirectToHome: true
   // });
 };

 loginHandler = () => {
   console.log("Inside login");

   var data = {
     email: this.state.email,
     password: this.state.password
     //screen_name : 'Hariae'
   };
   if(this.state.email==undefined || this.state.password==undefined) {
    this.setState({
      loginFormError : true
    })
   }
   else {
   axios
     .post(rooturl+'user/login', data, {
       headers: { "Access-Control-Allow-Origin": "*" }
     })
     .then(res => {
       if (res.status === 200) {
         console.log("Result : ", res);
         localStorage.setItem("email", this.state.email);
         if (res.data.role == true) {
           localStorage.setItem("role", "admin");
         } else {
           localStorage.setItem("role", "hacker");
         }
         this.setState({
           redirectToHome: true
         });
       }
     })
     .catch(error => {
       if (error.response.status === 401) {
         this.setState({
           errorPanel: true,
           errorPanelNot: false
         });
       }
       if (error.response.status === 404) {
         this.setState({
           errorPanelNot: true,
           errorPanel: false
         });
       }
     });
    }
 };

 render() {
   var redrirectVar = null;

   if (this.state.redirectToHome === true) {
     redrirectVar = <Redirect to="/" />;
   }
   var errorPanel = null;
   if (this.state.errorPanel === true) {
     errorPanel = (
       <div class="alert alert-danger">
         <a href="#" class="close" data-dismiss="alert" aria-label="close">
           &times;
         </a>
         <strong>Error!</strong> You are either not registered yet or have not
         verified your email.
       </div>
     );
   }

   var errorPanelNot = null;
   if (this.state.errorPanelNot === true) {
     errorPanelNot = (
       <div class="alert alert-danger">
         <a href="#" class="close" data-dismiss="alert" aria-label="close">
           &times;
         </a>
         <strong>Error!</strong> User does not exist
       </div>
     );
   }

   var loginErroPanel = null;
   if(this.state.loginFormError === true){
    loginErroPanel = <div class="alert alert-danger">
    <a href="#" class="close" data-dismiss="alert" aria-label="close">
      &times;
    </a>
    <strong>Error!</strong> Email and Password cannot be empty
  </div>
   }

   return (
     <div>
       <Header />
       {redrirectVar}
       <div className="container fill-graywhite mt-5">
         {redrirectVar}
         <div className="container content">
           <div className="login-container">
             <div>
               <p className="text-color-white">Log in to OpenHack</p>
               <p className="text-color-white">
                 Need an account? <a href="/signup">Sign Up</a>
               </p>
             </div>
             <div className="login-form-container col-lg-4 col-md-4 col-sm-12 offset-lg-4 offset-md-4 border">
               <div className="login-form-heading input-group pad-top-10 input-group-lg mt-2">
                 Account login
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
               {errorPanel}
               {errorPanelNot}
               {loginErroPanel}
               <div className="form-group login-form-control">
                 <a href="" className="">
                   Forgot Password?
                 </a>
               </div>
               <div className="form-group login-form-control">
                 <button
                   className="btn btn-login col-lg-12 col-md-12 col-sm-12"
                   onClick={this.loginHandler}
                 >
                   Login{" "}
                 </button>
               </div>
               <hr />
               {/* <div className="form-group login-form-control">
                                   <button className="btn fb-btn col-lg-12 col-md-12 col-sm-12">
                                       <img className="fb-logo flt-left" src={require('../../Static/Images/584ac2d03ac3a570f94a666d.png')} alt="fb-logo"></img>
                                       Log in with Facebook</button>
                               </div>
                               <div className="form-group login-form-control">
                                   <button className="btn google-btn col-lg-12 col-md-12 col-sm-12">
                                       <span>
                                           <img className="google-logo flt-left" src={require('../../Static/Images/google-svg.svg')} alt="google-logo"></img></span>
                                       Log in with Google</button>
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
                   <b className="ml-5 google-btn-text">Log in With Google</b>
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

export default Login;


