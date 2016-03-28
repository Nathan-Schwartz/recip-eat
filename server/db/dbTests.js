var chai = require('chai');
var db = require('./dbUtil');

var expect = chai.expect;
var should = chai.should;

describe("Pseudo-Database should work", function(){
  it('Should write to and read from file', function() {
    var testObj = {"_ALL_RECIPES":[],"_RECIPE_ID_COUNTER":0};
    db.write(testObj);
    db.read()
    .then(function(res){
      expect(res).to.deep.equal(testObj);
    })
    .catch(function(err){
      throw err;
    })
  });

  it('Should find & return existing users', function() {
    db.findById({"create": false},"_RECIPE_ID_COUNTER")
    .then(function(res){
      expect(res).to.equal(0);
    })
    .catch(function(err){
      throw err;
    })
  });

  it('Should not find non-existant users', function() {
    db.findById({"create": false},"doesntExist")
    .then(function(res){
      expect(res).to.equal(-1);
    })
    .catch(function(err){
      throw err;
    })
  });

  it('Should create a non-existant user when specified', function() {
    var sampleNewRecipe = {"didntexist": {"recipes":[], "profile": "Bob"}};
    db.findById({"create": true},"didntexist", "Bob")
    .then(function(res){
      return db.findById({"create": false},"didntexist");
    })
    .then(function(res){
      expect(res).to.deep.equal(sampleNewRecipe);
    })
    .catch(function(err){
      throw err;
    })
  });

  it('Should update counter', function() {
    db.updateCounter(2)
    .then(function(res){
      return db.findById({}, "_RECIPE_ID_COUNTER");
    })
    .then(function(res){
      expect(res).to.equal(2);
    })
    .catch(function(err){
      throw err;
    })
  });


  it('Should add each "recipe" to the _ALL_RECIPES list when given an array', function() {
    var recipeArr = ["lots", "of", "recipes"];
    db.addById("didntexist", recipeArr)
    .then(function(res){
      expect(res).to.deep.equal(recipeArr);
    })
    .catch(function(err){
      throw err;
    })
  });

  it('Should add to a Users recipe list when given a recipe ID', function() {
    db.addById("didntexist", 0)
    .then(function(){
      return db.findById({create:false}, "didntexist")
    })
    .then(function(res){
      expect(res.recipes).to.deep.equal([0]);
    })
    .catch(function(err){
      throw err;
    })
  });
});
