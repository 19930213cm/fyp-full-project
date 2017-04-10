
var initDb = require("../src/initDb.js");
var initDbContents = require("../src/initDbContents.js");
var wheelchairMonitoringFunctions = require("../src/wheelchairMonitoringFunctions.js")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route("/randomiseChairLocations").get(function (req, res){
  initDbContents.randomiseChairLocations(initDb.chairsDb, function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})

router.route("/getCounts").get(function (req, res){
  wheelchairMonitoringFunctions.getWheelchairCounts(function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})

router.route("/triggerNotification").get(function (req, res){
  wheelchairMonitoringFunctions.returnOverdueAlerts(function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})


router.route("/setChairLocation").get(function (req, res){
  initDbContents.setDbDocLocation(initDb.chairsDb, req.params.docId, req.params.newLocationId, function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})

router.route("/sendRequest").get(function (req, res){
    wheelchairMonitoringFunctions.sendRequest(req.body , function(error, response){
    if(error){
      res.status(error.statusCode).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log("response: " + response);
    }
  })
})

router.route("/newAlert").post(function (req, res){

    wheelchairMonitoringFunctions.newAlert(req.body, function(error, response){
    if(error){
      res.status(500).send(error);
      console.log(error);
    } else{
      res.status(200).send(response);
      console.log(response);
    }
  })
})

router.route("/acknowledgeAlert").post(function(req, res){
  wheelchairMonitoringFunctions.acknowledgeAlert(req.query.alertId, req.query.username, function(err, response){
    if(err){
      res.status(500).send(err);
      console.error(err);
    } else{
      res.status(200).send(response);
      //console.log(response);
    }
  })
})

router.route("/completeAlert").post(function(req, res){
  wheelchairMonitoringFunctions.completeAlert(req.query.alertId, function(err, response){
    if(err){
      res.status(500).send(err);
      console.error(err);
    } else{
      res.status(200).send(response);
      console.log(response);
    }
  })
})

router.route("/getDepartments").get(function  (req, res){
  res.status(200).send(initDbContents.getDepartments())//userFunctions.checkUserLogin()
})

module.exports = router;
