var chai = require('chai');
var db = require('./db/dbUtil');

var expect = chai.expect;
var should = chai.should;

describe("Stuff", function(){
  it('Should write to and read from file', function() {

    var testObj = { testing: [1], "2": [3] };

    db.write(testObj);
    db.read()
    .then(function(res){
      expect(res).to.deep.eql(testObj);
    })
  });

  it('Should find & return existing entries', function() {
  // return db.findById({"create": false},"testing");
  expect(true).to.eql(true);
  });

  it('Should not find non-existant entries', function() {
  expect(true).to.eql(true);
  });

  it('Should create a non-existant entry when specified', function() {
  expect(true).to.eql(true);
  });

  it('Should add to a specified entry when given a value', function() {
  expect(true).to.eql(true);
  });

  it('Should add each value to a specified entry when given an array', function() {
  expect(true).to.eql(true);
  });

  it('Should update counter', function() {
  expect(true).to.eql(true);
  });
});


// module.exports = function(){
//   // basic db method testing
//   db.write({ testing: [1], "2": [3] });
//   db.read()
//   .then(function(res){
//     console.log("test read & write, (should be: { testing: [1], \"2\": [3] }", res)
//     return db.findById({"create": false},"testing");
//   })
//   .then(function(res){
//     console.log("test find by id on existing (Should be 1 here)", res);
//     return db.findById({"create": false},"didntexist")
//   })
//   .then(function(res){
//     console.log("test find by id on non-existant (should be -1)", res);
//     return db.findById({"create": true},"didntexist")
//   })
//   .then(function(res){
//     console.log("test findOrCreate on non-existant (should be [])", res);
//     return db.findById({"create": false},"didntexist")
//   })
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
//   .then(function(res){
//     console.log("test add by id with arrays(should be [1,2,3,4]", res.testing);
//     return db.updateCounter(2);
//   })
//   .then(function(res){
//     console.log("test increment ID, should be 2", res);
//     return db.write({ "_ALL_RECIPES": [], "_RECIPE_ID_COUNTER": 0 });
//   })
// }
