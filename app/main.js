var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App.js');

document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
    setTitle();
    setParentDiv();
    ReactDOM.render(<App/>, document.getElementById("app"));
  }
}

function setTitle (){
  (document.head.getElementsByTagName("title").length > 0)
   ? [0].innerHTML = "RecipEat"
   : (function(){
       var head = document.createElement("title");
       head.innerHTML = "RecipEat";
       document.head.appendChild(head);
     })();
}

function setParentDiv (){
  var appDiv = document.createElement("DIV")
  appDiv.id = "app";
  document.body.appendChild(appDiv);
}
