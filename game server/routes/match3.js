var express = require('express');
var router = express.Router();

var functions = require('../src/playerDatabaseFunctions');

router.route("/getPlayerDoc").get(function (req, res){
    functions.getPlayerDoc( req.query.playerId,function(error, response){
    if(error){
      console.log(error);
      res.status(error.statusCode).send(error);
    } else{
      res.status(200).send(response);
      console.log( response);
    }
  })
})

router.route("/postPlayerDoc").get(function (req, res){
  console.log(req.query.email);
    functions.postPlayerDoc(  req.query ,function(error, response){
    if(error){
      console.error(error);
      res.status(error.statusCode).send(error);
    } else{
      console.log(response);
      res.status(200).send(response);
    }
  })
})


router.route("/getFitnessData").get(function (req, res){
    functions.getPlayerDoc( req.query.email ,function(error, response){
    if(error){
      console.log(error);
      res.status(error.statusCode).send(error);
    } else{
      res.status(200).send(response);
      console.log( response);
    }
  })
})
router.route("/sendFitnessData").post(function (req, res){
  console.log(req.body);
  functions.sendFitnessData( req.body ,function(error, response){
  if(error){
    console.log(error);
    res.status(error.statusCode).send(error);
  } else{
    res.status(200).send(response);
    console.log( response);
  }
})
})

module.exports = router;
