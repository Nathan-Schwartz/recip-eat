var React = require('react');
var $ = require('jquery'); //I'm sorry


var RenderList = React.createClass({
  favourite: function(e){
    $.ajax({
      method: "POST",
      url: "http://localhost:1337/user/addfavourite",
      data: {"recipeId": grabID(e.target), "userId": parseCookie()}
    })
    .then(function(gotstuff){
      console.log("I think we just added a favourite", gotstuff);
    })


    function grabID(who, deep){
      if(!who || !who.tagName) return '';
      var txt, ax, el= document.createElement("div");
      el.appendChild(who.cloneNode(false));
      txt= el.innerHTML;
      if(deep){
          ax= txt.indexOf('>')+1;
          txt= txt.substring(0, ax)+who.innerHTML+ txt.substring(ax);
      }
      el= null;
      return parseID(String(txt));
    }
    function parseID(string) {
      return string.slice(string.indexOf('id="')).split('"')[1].slice(1);
    }
    function parseCookie(){
      return String(document.cookie).split("userId=")[1].split(";")[0];
    }
  },
  render: function() {
    var currentComponent = this;
    return (
      <div>
        <div className="Rlist_container">
          {this.props.list.map(function (recipe, index) {
            return (
              <span key={index} className="entry">
                <a className="Rthumb" src={recipe.image_url} href={recipe.source_url}>
                  <img className="Rthumb" src={recipe.image_url} />
                </a>
                <b className="Rtitle"> {recipe.title} </b>
                <button type="button" className="Rfav" id={"R" + String(recipe.id)} onClick={currentComponent.favourite}> Add to Favourites </button>
                <div className="Rpublisher"> {recipe.publisher} </div>
              </span>
            );
          })}
        </div>
      </div>
    )
  }
});

var App = React.createClass({
  recipes: [],
  handleIngredientChange: function(e) {
    this.setState({ingredients: e.target.value});
  },
  handleSearch: function() {

    var component = this;

    $.ajax({
      method: "POST",
      url: "http://localhost:1337/searchFood2Fork",
      data: {ingredients: this.state.ingredients}
    })
    .then(function(stuff){
      console.log("Food2Fork gave us stuff", stuff);
      component.recipes = Array.prototype.slice.call(JSON.parse(stuff));
      component.forceUpdate();
    })
    return false; //same as e.preventDefault
  },
  getFavourites: function(){

    var component = this;

    $.ajax({
      method: "GET",
      url: "http://localhost:1337/user/favourites",
      data: {"userId": parseCookie()}
    })
    .then(function(gotstuff){
      console.log("I think we just got some favourites:", gotstuff, typeof gotstuff);
      component.recipes = Array.prototype.slice.call(JSON.parse(gotstuff));
      component.forceUpdate();
    })

    function grabID(who, deep){
      if(!who || !who.tagName) return '';
      var txt, ax, el= document.createElement("div");
      el.appendChild(who.cloneNode(false));
      txt= el.innerHTML;
      if(deep){
          ax= txt.indexOf('>')+1;
          txt= txt.substring(0, ax)+who.innerHTML+ txt.substring(ax);
      }
      el= null;
      return parseID(String(txt));
    }
    function parseID(string) {
      return string.slice(string.indexOf('id="')).split('"')[1].slice(1);
    }
    function parseCookie(){
      if(String(document.cookie).indexOf("userId=") !== -1)
        return String(document.cookie).split("userId=")[1].split(";")[0];
    }
  },
  render: function() {
    return (
      <div>
        <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'/>
        <span id="headerImage">
          <span id="authPanel">
            <button type="button" onClick={this.getFavourites}> Favourites </button>
            <a id="login" href="http://localhost:1337/login"> Login </a>
            <a id="logout" href="http://localhost:1337/logout"> Logout </a>
          </span>
          <div id="searchContainer">
            <h2 id="searchBarText">Search by ingredients</h2>
            <form id="searchBar">
              <input type="text" className="searchBox" name="ingredients" id="test" placeholder="onions, garlic, cheese" onChange={this.handleIngredientChange} />
              <button type="button" className="searchButton" onClick={this.handleSearch}> Go </button>
            </form>
          </div>
        </span>
        <RenderList list={this.recipes}/>
      </div>
    );
  }
});

module.exports = App;
