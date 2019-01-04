import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      stats : {}
    };
  }

  componentDidMount(){
    fetch('/api/stats/hour')
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.setState({
          stats : response.stats
        })
      });
  }

  render() {
    return (
      <div className="App">
        <h1>What happened in the last one hour in OpenStreetMap?</h1>
        {
          this.state.stats && this.state.stats.users && 
          <div className="prose">
            {this.state.stats.users.length} people contributed in-
            <br/>
            creating {this.state.stats.changesets.length} changesets where;
            <br/>
            {this.state.stats.deletenode} nodes were deleted,
            <br/>
            {this.state.stats.createnode} nodes were created,
            <br/>
            and {this.state.stats.modifynode} nodes were modified.
            <br/>
            Similary, {this.state.stats.deleteway} ways were deleted,
            <br/>
            {this.state.stats.createway} ways were created,
            <br/>
            and {this.state.stats.modifyway} ways were modified.
            <br/>
            As for the relations, {this.state.stats.deleterelation} of them were deleted,
            <br/>
            {this.state.stats.createrelation} relations were created,
            <br/>
            and {this.state.stats.modifyrelation} relations were modified.
            <br/>
            <span className="timeStamp"> As of {this.state.stats.timeStamp} </span>
            <br/>
          </div>

        }
        
      </div>
    );
  }
}

export default App;
