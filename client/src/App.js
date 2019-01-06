import React, { Component } from 'react';
import './App.css';
import moment from "moment";
import {Timeline, TimelineEvent} from 'react-event-timeline';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      stats : {}
    };
  }

  componentDidMount(){
    fetch("/api/stats/hour")
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
        <TimelineEvent title={amenity} key={index} icon={<i className="material-icons md-18">fiber_manual_record</i>}>
              {amenities[amenity]} of them were created
          </TimelineEvent>
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
        <h1>a minute<strong>*</strong> in OpenStreetMap</h1>
        {
          this.state.stats && this.state.stats.users && 
          <div className="prose">
            <span className="timeStamp"> <strong>*</strong>considering a minute between {moment(this.state.stats.createdDate).add('-1','minutes').format("HH:mm")} to {moment(this.state.stats.createdDate).format("HH:mm")} {moment(this.state.stats.createdDate).format("MMM DD, YYYY ")} </span>
            <br/>
            <span className="remarks"> <strong>**</strong>way with tag building=yes</span>
            <br/>
            <span className="remarks"> <strong>***</strong>way with tag amenity=... </span>
            <div>
              <Timeline className="timeline">
                      <TimelineEvent icon={<i className="material-icons md-18">timer</i>}>
                          Within this one minute
                      </TimelineEvent>
                      <TimelineEvent icon={<i className="material-icons md-18">people</i>}>
                          {this.state.stats.users.length} people contributed in
                      </TimelineEvent>
                      <TimelineEvent icon={<i className="material-icons md-18">edit_location</i>}>
                          {this.state.stats.changesets.length} changesets where
                      </TimelineEvent>
                      <TimelineEvent icon={<i className="material-icons md-18">place</i>}>
                          {this.state.stats.createnode} nodes were created, {this.state.stats.modifynode} were modified, {this.state.stats.deletenode} were deleted
                      </TimelineEvent>
                      <TimelineEvent icon={<i className="material-icons md-18">trending_up</i>}>
                          {this.state.stats.createway} ways were created, {this.state.stats.modifyway} were modified, {this.state.stats.deleteway} were deleted
                      </TimelineEvent>
                      <TimelineEvent icon={<i className="material-icons md-18">device_hub</i>}>
                          {this.state.stats.createrelation} relations were created, {this.state.stats.modifyrelation} were modified, {this.state.stats.deleterelation} were deleted
                      </TimelineEvent>
                      <TimelineEvent icon={<i className="material-icons md-18">home</i>}>
                          This includes creation of {this.state.stats.wayBuildings} buildings<strong>**</strong>
                      </TimelineEvent>
              </Timeline>
            </div>
            <br/>
            {Object.keys(this.getAmenities(this.state.stats).amenities).length>0 &&
              <div>
                Also, this includes creation of following amenities<strong>***</strong>
                <div className="amenities">
                  <br/>
                  <Timeline className="timeline">
                    {this.getAmenities(this.state.stats).amenitiesTemplate}
                  </Timeline>
                </div>
              </div>
            } 
            <br/>
          </div>
        }
      </div>
    );
  }
}

export default App;
