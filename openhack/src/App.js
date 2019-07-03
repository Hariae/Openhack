import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Main from './components/Main';
import './theme.css';

class App extends Component {
  render() {
    return (
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
    );
  }
}

export default App;
