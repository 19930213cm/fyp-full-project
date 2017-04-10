var express = require('express');
var router = express.Router();
var userFunctions = require("../src/userFunctions.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route("/getAllUsers").get(function (req, res){
  userFunctions.findUserDoc( "users", "userName", function(error, response){
    if(error){
      console.log(error);
      res.status(error.statusCode).send(error);
    } else{
      res.status(200).send(response);
      console.log( response);
    }
  })
})

router.route("/checkUserLogin").get(function  (req, res){
  userFunctions.checkUserLogin(req.query.username, req.query.password, function(error, response){
    if (error){
      console.error(error);
      res.status(error.statusCode).send(error);
    } else {
      res.status(200).send(response);
    }
  })
})

router.route("/getUserDoc").get(function  (req, res){
  userFunctions.getUserDoc(req.query.username, function(error, response){
    if (error){
      console.error(error);
      res.status(error.statusCode).send(error);
    } else {
      res.status(200).send(response);
    }
  })
})

  router.route("/postFirebaseToken").get(function  (req, res){
    userFunctions.postFirebaseToken(req.query.username, req.query.token, function(error, response){
      if (error){
        console.log( error);
        res.status(error.statusCode).send(error);
      } else {
        res.status(200).send(response);
      }
    })
  //userFunctions.checkUserLogin()
})

router.route("/returnMyAlerts").get(function  (req, res){
  var username = [];
  username.push(req.query.username);
  userFunctions.returnMyAlerts(username, function(error, response){
    if (error){
      console.log( error);
      res.status(error.statusCode).send(error);
    } else {
      res.status(200).send(response);
    }
  })
//userFunctions.checkUserLogin()
})
router.route("/returnAllAlerts").get(function  (req, res){
  userFunctions.returnAllAlerts(function(error, response){
    if (error){
      console.log( error);
      res.status(error.statusCode).send(error);
    } else {
      res.status(200).send(response);
    }
  })
//userFunctions.checkUserLogin()
})


module.exports = router;
