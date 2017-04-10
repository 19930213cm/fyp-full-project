var express = require('express');
var router = express.Router();

var functions = require('../src/playerDatabaseFunctions');

router.route("/getPlayerDoc").get(function (req, res){
    functions.getPlayerDoc( "chris",function(error, response){
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
//test commen
