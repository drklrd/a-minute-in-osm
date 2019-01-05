import React, { Component } from 'react';
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

  getAmenities(stats){
    const amenities = Object.keys(stats).filter((stat)=>{
      return stat.includes("amenity_");
    }).reduce((obj,value)=>{
      obj[value.split("amenity_")[1]] = stats[value];
      return obj;
    },{});
    const amenitiesTemplate = (Object.keys(amenities).map((amenity,index)=>{
      return(
          <div key={index}>
            {amenity} => {amenities[amenity]}
          </div>
      )
    }))
    return {
      amenities,
      amenitiesTemplate
    };
  }

  render() {
    return (
      <div className="App">
        <h1>a minute* in OpenStreetMap</h1>
        {
          this.state.stats && this.state.stats.users && 
          <div className="prose">
            {this.state.stats.users.length} people contributed in-
            <br/>
            creating {this.state.stats.changesets.length} changesets where;
            <br/>
            {this.state.stats.wayBuildings} buildings** were created,
            <br/>
            <div className="elements">
              {this.state.stats.deletenode} nodes were deleted, {this.state.stats.createnode} were created and {this.state.stats.modifynode} were modified.
              <br/>
              Similary, {this.state.stats.deleteway} ways were deleted, {this.state.stats.createway} were created and {this.state.stats.modifyway} were modified.
              <br/>
              As for the relations, {this.state.stats.deleterelation} of them were deleted, {this.state.stats.createrelation} were created and {this.state.stats.modifyrelation} were modified.
            </div>
            <hr/>
            {this.getAmenities(this.state.stats).amenities.length &&
              <div>
                Also, certain number of amenities*** were created with the following tags
                <br/>
                <div className="amenities">
                  {this.getAmenities(this.state.stats).amenitiesTemplate}
                </div>
                <br/>
                <span className="remarks"> ***way with tag amenity=... </span>
              </div>
            } 
            <br/>
            <span className="timeStamp"> *considering one minute before {this.state.stats.timeStamp} </span>
            <br/>
            <span className="remarks"> **way with tag building=yes</span>
            
            <br/>
          </div>
        }
      </div>
    );
  }
}

export default App;
