

var nano = require('nano')("http://localhost:5984", function(err, res){
  if ("err"){
    console.log(err);
  } else{
    console.log(res);
  }
});

function useDb(dbName, callback){
  console.log(dbName);
  callback(null, nano.db.use(dbName));
}


var chairsDb = nano.db.use("chairs", function(err, res){
  if (err){
    console.log(err);
  } else{
    console.log(res);
  }
})

//fill chairs db with randomly generated data;
//dbContents.initChairs(chairsDb);
var exports = module.exports = {};
exports.chairsDb = chairsDb;
exports.useDb = useDb;
exports.nano = nano;
