import React, { Component } from 'react';
import Header from '../Header/Header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { rooturl } from '../../config';
import { Redirect } from 'react-router';

class HackathonCreation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start_date: new Date(),
            end_date: new Date(),
            open_date: new Date(),
            close_date: new Date(),
            redirectToHome: false,
            userList: [],
            searchSuggestions: [],
            searchSuggestionSelected: 0,
            searchResult: {},
            searchjudge: "",
            judgeList: [],
            searchSuggestionsOrg: [],
            searchSuggestionSelectedOrg: 0,
            searchResultOrg: {},
            searchorganization: "",
            organizationList: [],
            orgList : [],
            judgeString : "",
            organizationString :"",
            event_name: "", registration_fee: "", min_size: "", max_size: "",
            allFilled: true,
            onSubmit: false,
            organizationNameList: [],
            judgesNameList: [],
            sponsor_discount: 0

        }

        //bind
        this.handleChange = this.handleChange.bind(this);
        this.createHackathon = this.createHackathon.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }


    componentDidMount() {
        console.log('component did mount!');
        var userEmail = localStorage.getItem('email');

        axios.get(rooturl + 'user/getAllUsers')
            .then(response => {
                console.log(response);
                this.setState({
                    userList: response.data
                })
            });
       
     axios.get(rooturl+'organizationCreation/getAllOrganizations')
            .then(response=>{
                console.log(response.data);
                this.setState({
                    orgList : response.data
                })
            });


    }

    createHackathon = () => {
        console.log('Inside create hackathon',/^[A-Za-z0-9_]+$/.test(this.state.event_name));
        var data = {
            event_name: this.state.event_name,
            start_date: this.state.start_date.toISOString().split('T')[0],
            end_date: this.state.end_date.toISOString().split('T')[0],
            registration_fee: this.state.registration_fee,
            min_size: this.state.min_size,
            max_size: this.state.max_size,
            sponsor_discount: this.state.sponsor_discount,
            description: this.state.description,
            //open_date: this.state.open_date.toISOString().split('T')[0],
            //close_date: this.state.close_date.toISOString().split('T')[0],
            judgeList: this.state.judgeList,
            sponsorList : this.state.organizationList
        }
        if(/\S+/.test(this.state.event_name) && /\S+/.test(this.state.start_date) && /\S+/.test(this.state.end_date) && /^-?\d+\.?\d*$/.test(this.state.registration_fee)
            && /^-?\d+\.?\d*$/.test(this.state.min_size) && /^-?\d+\.?\d*$/.test(this.state.max_size) && /\S+/.test(this.state.description) && /\S+/.test(this.state.judgeList))
             {
            axios.post(rooturl + 'hackathon', data)
                .then(response => {
                    console.log(response);
                    if (response.status === 200) {
                        this.setState({
                            allFilled: true,
                            onSubmit: true,
                            redirectToHome: true
                        })
                    }
                });
        }
        else {
            this.setState({
                allFilled: false,
                onSubmit: true
            })
        }
        // if(this.state.allFilled==true) {
        //     alert("you can submit");
        //     var data = {
        //         event_name: this.state.event_name,
        //         start_date: this.state.start_date.toISOString().split('T')[0],
        //         end_date: this.state.end_date.toISOString().split('T')[0],
        //         registration_fee: this.state.registration_fee,
        //         min_size: this.state.min_size,
        //         max_size: this.state.max_size,
        //         sponsor_discount: this.state.sponsor_discount,
        //         description: this.state.description,
        //         //open_date: this.state.open_date.toISOString().split('T')[0],
        //         //close_date: this.state.close_date.toISOString().split('T')[0],
        //         judgeList: this.state.judgeList,
        //         sponsorList : this.state.organizationList
        //     }
        // axios.post(rooturl + 'hackathon', data)
        //     .then(response => {
        //         console.log(response);
        //         if (response.status === 200) {
        //             this.setState({
        //                 redirectToHome: true
        //             })
        //         }
        //     });
        // }
      
    }

    handleSuggestionSelected = (event) => {
        const target = event.target;
        const id = target.id;
        const name = target.name;
        this.setState({
            searchSuggestionSelected: id,
            searchjudge: name
        });
    }

    handleSuggestionSelectedOrg = (event) => {
        const target = event.target;
        const id = target.id;
        const name = target.name;
        this.setState({
            searchSuggestionSelectedOrg: id,
            searchorganization: name
        });
    }

    handleStartDateChange = (date) => {
        console.log(date);
        this.setState({
            start_date: date
        })
    }

    handleEndDateChange = (date) => {
        this.setState({
            end_date: date
        })
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

    handleSearchChange = (event) => {
        const target = event.target;
        const searchTerm = target.value;
        const name = target.name

        var searchResult = this.state.userList.filter(obj => obj.screen_name.includes(searchTerm));

        this.setState({
            searchSuggestions: searchResult,
            [name]: searchTerm
        });
    }

    searchJudge = () => {
        console.log('inside search judge', this.state.searchSuggestionSelected)
        this.setState({
            searchResult: this.state.userList.find(o => o.id == this.state.searchSuggestionSelected)
        });


    }

    addJudge = () => {
        this.updateJudgeList(this.state.searchResult.id, this.state.searchResult.screen_name);
    }

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    updateJudgeList = (newJudge, judgeName) => {

        this.state.judgeList.push(newJudge);
        this.state.judgesNameList.push(judgeName);
        // var tempList = this.state.teamList;
        this.setState({
            judgeList: this.state.judgeList,
            judgesNameList: this.state.judgesNameList
        });
        console.log('inside update', this.state.judgeList, this.state.judgesNameList);
    }


    handleSearchChangeOrg = (event) => {
        const target = event.target;
        const searchTermOrg = target.value;
        const name = target.name

        var searchResultOrg = this.state.orgList.filter(obj => obj.name.includes(searchTermOrg));

        this.setState({
            searchSuggestionsOrg: searchResultOrg,
            [name]: searchTermOrg
        });
    }

    searchOrganization = () => {
        console.log('inside search Organization', this.state.searchSuggestionSelected)
        this.setState({
            searchResultOrg: this.state.orgList.find(o => o.id == this.state.searchSuggestionSelectedOrg)
        });


    }

    addOrganization = () => {
        this.updateOrganizationList(this.state.searchResultOrg.id, this.state.searchResultOrg.name);
    }
    

    updateOrganizationList = (newOrg, newOrgName) => {

        this.state.organizationList.push(newOrg);
        this.state.organizationNameList.push(newOrgName);
        // var tempList = this.state.teamList;

        this.setState({
            organizationList: this.state.organizationList,
            organizationNameList: this.state.organizationNameList
        });
        console.log('inside update', this.state.organizationList, this.state.organizationNameList);
    }

    render() {
        var redirectVar = null;
        var validations = null;
        console.log(this.state.allFilled);
        if(this.state.allFilled==false && this.state.onSubmit==true) {
        validations = (<div class="alert alert-danger">
        <a href="#" data-dismiss="alert" aria-label="close">
          &times;
        </a>
        <strong>All details are mandatory. Sponsor is optional.</strong>
      </div>);
      }
        if (localStorage.getItem('email') == null) {
            redirectVar = <Redirect to="/login" />
        }

        if (this.state.redirectToHome === true) {
            redirectVar = <Redirect to="/" />
        }

        var searchSugguestions = null;

        searchSugguestions = this.state.searchSuggestions.map((item, index) => {
            return (
                <li key={index}> <a onClick={this.handleSuggestionSelected} id={item.id} name={item.screen_name}>{item.screen_name}</a></li>
            )
        });

        var searchResult = null;

        if (!this.isEmpty(this.state.searchResult)) {
            searchResult = <div className="mt-3 p-3">
                <div>
                    <span><h4><strong>{this.state.searchResult.screen_name}</strong></h4></span>
                    <span><button className="btn btn-lg btn-add" onClick={this.addJudge}>Add Judge</button></span>
                </div>
            </div>
        }
        

        var judges = null;
        if(this.state.judgeList.length > 0)
        var searchSugguestionsOrg = null;

        searchSugguestionsOrg = this.state.searchSuggestionsOrg.map((item, index) => {
            return (
                <li key={index}> <a onClick={this.handleSuggestionSelectedOrg} id={item.id} name={item.name}>{item.name}</a></li>
            )
        });

        var searchResultOrg = null;

        if (!this.isEmpty(this.state.searchResultOrg)) {
            searchResultOrg = <div className="mt-3 p-3">
                <div>
                    <span><h4><strong>{this.state.searchResultOrg.name}</strong></h4></span>
                    <span><button className="btn btn-lg btn-add" onClick={this.addOrganization}>Add Sponsor</button></span>
                </div>
            </div>
        }
        var sponsorListDisplay = null, judgesNameListDisplay = null;
        
        sponsorListDisplay = this.state.organizationNameList.map((sponsorList) => {
            return (
                <p>{sponsorList}</p>
            )
        });
        judgesNameListDisplay = this.state.judgesNameList.map((judgesNameListDisplay) => {
            return (
                <p>{judgesNameListDisplay}</p>
            )
        });
        

        return (
            <div>
                <Header />
                <div className="container mt-5">
                    {redirectVar}
                    <div className="pt-3 pb-3">
                        <h3><strong>Hackathon Creation Page</strong></h3>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <input type="text" name="event_name" id="eventname" placeholder="Event Name" className="form-control form-control-lg" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                            Start Date:  <DatePicker name="start_date" id="startdate" className="form-control form-control-lg" placeholder="Start date" selected={this.state.start_date} onChange={this.handleStartDateChange} />
                            </div>
                            <div className="form-group">
                            End Date:     <DatePicker name="end_date" id="enddate" className="form-control form-control-lg" placeholder="End date" selected={this.state.end_date} onChange={this.handleEndDateChange} />
                            </div>
                            {/* <div className="form-group">
                                <DatePicker name="open_date" id="opendate" className="form-control form-control-lg" placeholder="Open date" selected={this.state.open_date} onChange={this.handleOpenDateChange} />
                            </div>
                            <div className="form-group">
                                <DatePicker name="close_date" id="closedate" className="form-control form-control-lg" placeholder="Close date" selected={this.state.close_date} onChange={this.handleCloseDateChange} />
                            </div> */}
                            <div className="form-group">
                                <input type="text" name="description" id="description" className="form-control form-control-lg" placeholder="Description" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="registration_fee" id="registrationfee" className="form-control form-control-lg" placeholder="Registration Fee" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <input type="text" name="searchjudge" id="searchjudge" className="form-control form-control-lg col-lg-8 col-md-8 col-sm-8 ml-3" placeholder="Search Judge" value={this.state.searchjudge} onChange={this.handleSearchChange} />
                                    <button className="btn btn-lg add-judge-btn mt-2 ml-3" onClick={this.searchJudge} > Search Judge</button>
                                </div>
                                <div className="">
                                    <ul className="search-suggestions">
                                        {searchSugguestions}
                                    </ul>
                                </div>
                                <div className="mt-5 text-color-white">
                                    {searchResult}

                                </div>
                                
                                <div>
                                   
                                    {(judgesNameListDisplay.length==0) ? <p> No judges added until now </p> : <p>  Judges added for this Hackathon: {judgesNameListDisplay} </p> }
                                </div>
                            </div>
                            <div className="form-group">
                                <input type="text" name="min_size" id="minimalteamsize" className="form-control form-control-lg" placeholder="Minimal Team Size" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="max_size" id="maximumteamsize" className="form-control form-control-lg" placeholder="Maximum Team Size" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <input type="text" name="searchorganization" id="searchorganization" className="form-control form-control-lg col-lg-8 col-md-8 col-sm-8 ml-3" placeholder="Search Sponsor" value={this.state.searchorganization} onChange={this.handleSearchChangeOrg} />
                                    <button className="btn btn-lg add-sponsor-btn mt-2 ml-3" onClick={this.searchOrganization} >Search Sponsor</button>
                                </div>
                                <div className="">
                                    <ul className="search-suggestions">
                                        {searchSugguestionsOrg}
                                    </ul>
                                </div>
                                <div className="mt-5 text-color-white">
                                    {searchResultOrg}

                                </div>
                                <div>
                                   
                                    {(sponsorListDisplay.length==0) ? <p> No Sponsors added until now </p> : <p>  Sponsors added for this Hackathon: {sponsorListDisplay} </p> }
                                </div>
                            </div>
                            <div className="form-group">
                                <input type="text" name="sponsor_discount" id="sponsordiscount" className="form-control form-control-lg" placeholder="Sponsor Discount" onChange={this.handleChange} />
                            </div>
                            {validations}
                            <div className="form-group">
                                <button className="btn btn-lg create-hack-btn" onClick={this.createHackathon}>Create Hackathon</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default HackathonCreation;