(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{12:function(e,t,a){e.exports=a(30)},18:function(e,t,a){},20:function(e,t,a){},30:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),i=a(6),l=a.n(i),r=(a(18),a(7)),m=a(8),c=a(10),o=a(9),d=a(11),u=(a(20),a(2)),h=a.n(u),E=(a(23),a(1)),w=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(o.a)(t).call(this,e))).state={stats:{}},a}return Object(d.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){var e=this;fetch("/api/stats/hour").then(function(e){return e.json()}).then(function(t){e.setState({stats:t.stats})})}},{key:"getAmenities",value:function(e){var t=Object.keys(e).filter(function(e){return e.includes("amenity_")}).reduce(function(t,a){return t[a.split("amenity_")[1]]=e[a],t},{}),a=Object.keys(t).map(function(e,a){return s.a.createElement(E.TimelineEvent,{className:"timeline-content",title:e,key:a,icon:s.a.createElement("i",{className:"material-icons md-18"},"fiber_manual_record")},t[e]," of them were created")});return{amenities:t,amenitiesTemplate:a}}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-12"},s.a.createElement("h1",null,"a minute",s.a.createElement("strong",null,"*")," in OpenStreetMap"),this.state.stats&&this.state.stats.users&&s.a.createElement("div",{className:"prose"},s.a.createElement("span",{className:"timeStamp"}," ",s.a.createElement("strong",null,"*"),"considering a minute between ",h()(this.state.stats.createdDate).add("-1","minutes").format("HH:mm")," to ",h()(this.state.stats.createdDate).format("HH:mm")," ",h()(this.state.stats.createdDate).format("MMM DD, YYYY ")," "),s.a.createElement("br",null),s.a.createElement("span",{className:"remarks"}," ",s.a.createElement("strong",null,"**"),"way with tag building=yes"),s.a.createElement("br",null),s.a.createElement("span",{className:"remarks"}," ",s.a.createElement("strong",null,"***"),"way with tag amenity=... "),s.a.createElement("div",null,s.a.createElement(E.Timeline,{className:"timeline"},s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"timer")},"Within this one minute"),s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"people")},this.state.stats.users.length," people have contributed to ",s.a.createElement("a",{href:"http://osm.org",target:"_blank",rel:"noopener noreferrer"},"OSM")),s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"edit_location")},this.state.stats.changesets.length," changesets were made"),s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"place")},this.state.stats.createnode," nodes were created, ",this.state.stats.modifynode," were modified, ",this.state.stats.deletenode," were deleted"),s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"trending_up")},this.state.stats.createway," ways were created, ",this.state.stats.modifyway," were modified, ",this.state.stats.deleteway," were deleted"),s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"device_hub")},this.state.stats.createrelation," relations were created, ",this.state.stats.modifyrelation," were modified, ",this.state.stats.deleterelation," were deleted"),s.a.createElement(E.TimelineEvent,{className:"timeline-content",icon:s.a.createElement("i",{className:"material-icons md-18"},"home")},"This includes creation of ",this.state.stats.wayBuildings," buildings",s.a.createElement("strong",null,"**")))),s.a.createElement("br",null),Object.keys(this.getAmenities(this.state.stats).amenities).length>0&&s.a.createElement("div",null,"Also, this includes creation of following amenities",s.a.createElement("strong",null,"***"),s.a.createElement("div",{className:"amenities"},s.a.createElement("br",null),s.a.createElement(E.Timeline,{className:"timeline"},this.getAmenities(this.state.stats).amenitiesTemplate))),s.a.createElement("br",null)))))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(s.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[12,2,1]]]);
//# sourceMappingURL=main.852c5dde.chunk.js.map