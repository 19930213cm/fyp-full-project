var async = require("async");
var wheelchairNumbers = require("./locationLevels.js");
var size = 8;

function initChairs(db){
  var totalChrairs = wheelchairNumbers.totalChairs
  db.get("countsDoc", function (err, countsDoc){
    for (var i = 0; i < totalChrairs; i++){

      var locationId = getRandomInt(1, size +1);
      var locationName;
      var subLocationId;

      var result = setLocation(locationId);
      locationName = result.locationName;
      subLocationId = result.subLocationId;

      var chairJson = {

        "locationName": locationName,
        "locationId": locationId,
        "subLocationId": subLocationId
      }
      if (countsDoc.actual[locationId] == null){
          countsDoc.actual[locationId] = 0;
      }
      countsDoc.actual[locationId] ++;
      db.insert(chairJson, function(err, res){
        if (err){
          console.log(err);
        }
      })
    }
    db.insert(countsDoc, function(err, res){
      if (err){
        console.log(err);
      }
    })
  })
  console.log("location levels is null?" + size);
  console.log(wheelchairNumbers);
}

function randomiseChairLocations(db, callback){
  db.list({include_docs: true}, function(error,body) {
    if (error){
      callback(error);
    } else {
      db.get("countsDoc", function(err, countsDoc){
        if (err){
          callback(err);
        } else {
          var docs = body.rows;
          var response;
          for (var i =0; i < docs.length; i++){
            if (docs[i].doc._id !== "countsDoc"){
              var locationId = getRandomInt(1, size +1);
              var subLocationId;
              var result = setLocation(locationId);

              countsDoc.actual[docs[i].doc.locationId] --;
              docs[i].doc.locationName = result.locationName;
              docs[i].doc.subLocationId = result.subLocationId;
              docs[i].doc.locationId = locationId;
              countsDoc.actual[docs[i].doc.locationId] ++;
              //console.log(docs[i].doc);
              db.insert(docs[i].doc, function(err, resp){
                if (err){
                  callback(err);
                }
              })
            }
          }
          db.insert(countsDoc, function(err, res){
            if (err){
              callback(err);
            } else {
              callback( null , res)
            }
          })
        }
      })
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function setDbDocLocation(db, id, newLocationId, callback){
  async.waterfall([
    function getDoc(asyncCb){
      db.get(id, function(err, doc){

        asyncCb(err, doc);
      })
    },
    function getCountsDoc(doc, asyncCb){
      db.get("countsDoc", function (err, countsDoc){

        countsDoc.actual[doc.LocationId].current --;

        //update current doc
        var result = setLocation(newLocationId);
        doc.LocationId = newLocationId;
        doc.locationName = result.locationName;
        doc.subLocationId = result.subLocationId;

        countsDoc.actual[doc.LocationId].current ++;

        asyncCb(err, doc, countsDoc);
      })
    },
    function insertUpdatedDoc(doc, countsDoc, asyncCb){
        db.insert(doc, function(err, resp){
          asyncCb(err, countsDoc)
        })
    },
    function insertUpdatedCountsDoc(countsDoc, asyncCb){
      db.insert(countsDoc, function(err, resp){
        asyncCb(err, resp)
      })
    }
  ], function(err, resp){
      if (err){
        callback(err);
      } else {
        callback(null, resp);
      }
  })
}

function getDepartments(){
  var locations = [];
  for (var i = 0; i < size+1; i++){
     locations[i] = setLocation(i).locationName;
  }
  return locations
}

function checkForWarnings(db, callback){
  db.get("countsDoc", function(err, countsDoc){
    if (err){
      callback(err);
    } else{
      var alerts = [];
      var alertMsg = {};
      var warningLevels = countsDoc.required;
      for( var locationId in warningLevels){
        var locationInfo = setLocation(parseInt(locationId));
          if (countsDoc.required[locationId].warning >= countsDoc.actual[locationId]){
            if (countsDoc.required[locationId].critical >= countsDoc.actual[locationId]){
                alertMsg = {
                  "locationName": locationInfo.locationName,
                  "locationId": locationId,
                  "critical": true,
                  "warningLvl": countsDoc.required[locationId].warning,
                  "criticalLvl": countsDoc.required[locationId].critical,
                  "required": countsDoc.required[locationId].critical - countsDoc.actual[locationId] + 1
                }
            } else{
              alertMsg = {
                "locationName": locationInfo.locationName,
                "locationId":  locationId,
                "critical": false,
                "warningLvl": countsDoc.required[locationId].warning,
                "criticalLvl": countsDoc.required[locationId].critical,
                "required": countsDoc.required[locationId].warning - countsDoc.actual[locationId] + 1
              }
            }
            alerts.push(alertMsg)
          }
      }
      callback(null, alerts);
    }
  })
}

function setLocation( locationId){
  var locationName;
  var subLocationId;
  switch (locationId) {
    case 6:
      locationName = "Reception";
      subLocationId = getRandomInt(1,4);
      break;
    case 1:
      locationName = "A&E";
      subLocationId = getRandomInt(1,2);
      break;
    case 2:
      locationName = "X-Ray";
      subLocationId = getRandomInt(1,2);
      break;
    case 3:
      locationName = "Ward 1";
      subLocationId = getRandomInt(1,3);
      break;
    case 4:
      locationName = "Ward 2";
      subLocationId = getRandomInt(1,3);
      break;
    case 5:
      locationName = "Optemetry";
      subLocationId = 1;
      break;
    case 7:
      locationName = "Surgery";
      subLocationId = 1;
      break;
    case 8:
      locationName = "Intensive Care Unit";
      subLocationId = 1;
      break;

  }

  var result = {
    "locationName": locationName,
    "subLocationId": subLocationId
  };
  return result;
}

var exports = module.exports = {};
exports.randomiseChairLocations = randomiseChairLocations;
exports.setDbDocLocation = setDbDocLocation;
exports.initChairs = initChairs;
exports.checkForWarnings = checkForWarnings;
exports.getDepartments = getDepartments;
exports.setLocation = setLocation ;
//exports.checkCorrectLevels = checkCorrectLevels;
