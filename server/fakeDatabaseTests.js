var db = require('./db/dbUtil');

module.exports = function(){
  // basic db method testing
  db.write({ testing: [1], "2": [3] });
  db.read()
  .then(function(res){
    console.log("test read & write, (should be: { testing: [1], \"2\": [3] }", res)
    return db.findById({"create": false},"testing");
  })
  .then(function(res){
    console.log("test find by id on existing (Should be 1 here)", res);
    return db.findById({"create": false},"didntexist")
  })
  .then(function(res){
    console.log("test find by id on non-existant (should be -1)", res);
    return db.findById({"create": true},"didntexist")
  })
  .then(function(res){
    console.log("test findOrCreate on non-existant (should be [])", res);
    return db.findById({"create": false},"didntexist")
  })
  .then(function(res){
    console.log("test find by id on newly existing (should be []", res);
    return db.addById("testing", 2);
  })
  .then(function(){
    return db.read()
  })
  .then(function(res){
    console.log("test add by id with numbers(should be [1,2]", res.testing);
    return db.findById({"create": false},"testing");
  })
  .then(function(res){
    return db.addById("testing", [3,4]);
  })
  .then(function(){
    return db.read()
  })
  .then(function(res){
    console.log("test add by id with arrays(should be [1,2,3,4]", res.testing);
    return db.updateCounter(2);
  })
  .then(function(res){
    console.log("test increment ID, should be 2", res);
    return db.write({ "_ALL_RECIPES": [], "_RECIPE_ID_COUNTER": 0 });
  })
}