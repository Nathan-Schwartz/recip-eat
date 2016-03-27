var chai = require('chai');
var db = require('./dbUtil');

var expect = chai.expect;
var should = chai.should;

describe("Pseudo-Database should work", function(){
  it('Should write to and read from file', function() {

    var testObj = { "_ALL_RECIPES": [], "_RECIPE_ID_COUNTER": 0 };

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
      expect(res).to.deep.equal(sampleNewRecipe);
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
    db.addById("_ALL_RECIPES", recipeArr)
    .then(function(){
      return db.findById({create:false}, "_ALL_RECIPES")
    })
    .then(function(res){
      expect(res).to.deep.equal(recipeArr);
    })
    .catch(function(err){
      throw err;
    })
  });

  it('Should add to a specified entry when given a value', function() {
    expect(true).to.equal(true);
  });

  it('test profiles, adding recipes, ', function() {
    expect(true).to.equal(true);
  });


  // it('Should not break database functionality', function(){
    var basicStructure = { "_ALL_RECIPES": [], "_RECIPE_ID_COUNTER": 0 };
    db.write(basicStructure)
    // .then(function(){
    //   return db.read();
    // })
    // .then(function(){
      //expect(basicStructure).to.deep.equal(basicStructure); //ASK JONOTHON
    // })
  // })
});
//   .then(function(res){
//     console.log("test find by id on newly existing (should be []", res);
//     return db.addById("testing", 2);
//   })
//   .then(function(){
//     return db.read()
//   })
//   .then(function(res){
//     console.log("test add by id with numbers(should be [1,2]", res.testing);
//     return db.findById({"create": false},"testing");
//   })
//   .then(function(res){
//     return db.addById("testing", [3,4]);
//   })
//   .then(function(){
//     return db.read()
//   })
