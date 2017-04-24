var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require("request");



var initDb = require("./src/initDb");
var playerDatabaseFunctions = require("./src/playerDatabaseFunctions.js");

var match3 = require("./routes/match3")





// FOR ADDING VALUES TO THE HIGH SCORE DB
////////////////////////////////////////////////////////////////////////////////
var player = {
  level: "Level_0",
  score: 3000 ,
  name: "John",
  email: "blach"
}
// playerDatabaseFunctions.processPlayerScore(player , function(err, res){
//   if( err){
//     console.error(err);
//   }
// })
////////////////////////////////////////////////////////////////////////////////

// playerDatabaseFunctions.getTopScores("Level_0", 5, function(err, scores){
//     if (err){
//       console.error(err);
//     } else {
//       console.log(scores);
//     }
// })
//
// playerDatabaseFunctions.getScoresAroundPlayer (player, "Level_0",function(err, scores){
//     if (err){
//       console.error(err);
//     } else {
//       console.log(scores);
//     }
// })
var app = express();

var options = {
  headers: {
    "Accept": "application/json"
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var userdb = initDb.users;

app.use('/match3', match3)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
