var async = require("async");
var  initDb = require("./initDb.js");

var nano = initDb.nano;


/*Functions around the creation of new lives based on a timer*/
function generateNewLife(playerId, callback){
  var playerDb = nano.db.use("match3players");
  playerDb.get(playerId, function(err, res){
    if (err){
      callback(err)
    } else {
      callback(null, res)
      setTimeout(function(){
        processNewLifeRequest(playerId);
      }, 1000 * 60 * 30 );
    }
  })
}
function processNewLifeRequest(playerId){
  var playerDb = nano.db.use("match3players");
  playerDb.get(playerId, function(err, doc){
    if (err){
      console.error(err);
    } else {
      var lives = parseInt(doc.lives);
      var maxLives = parseInt(doc.maxLives);
      lives ++;
      var livesString = lives.toString();
      doc.lives = livesString;
        playerDb.insert(doc, function(err, res){
          if (err){
            console.error(err);
          } else {
            if (lives < maxLives){
              setTimeout(function(){
                processNewLifeRequest(playerId);
              }, 1000 * 60 * 30 );
            } else {
              console.log(res);
            }
          }
        })
    }
  })
}
/*end of section*/


function sendFitnessData(data, callback){
  var playerDb = nano.db.use("match3players");

  async.waterfall([
    function getPlayerDoc(asyncCb){
      playerDb.get(data.email, function( err, doc){
        asyncCb(err, doc);
      })
    },
    function updateAndPostPlayerDoc( doc, asyncCb){
      doc.todaysSteps = data.steps;
      doc.lastLogin = new Date(data.date);
      playerDb.insert(doc, function( err, res){
        asyncCb(err, res);
      })
    }
  ], function (err, res ){
    if (err){
      callback(err);
    } else {
      callback( null, res);
    }
  })
}
function findPlayer(player, email) {
  return player.email === email;
}

function findIndex(key, value , myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][key] === value) {
          console.log("found in array");
            return i;
        }
    }
    console.log("reut null");
    return null;
}

function processPlayerScore(player, callback){

  var highscoresDb = nano.db.use("highscores");
  var playerDb = nano.db.use("match3players");

  async.waterfall([
    function getHighscoresForLevel (asyncCb){
      highscoresDb.get(player.levelName, function(err, doc){
        asyncCb(err, doc);
      })
    },
    function processHighScore(doc , asyncCb){
      var playerScore = {
        score: parseInt(player.score),
        email: player.playerId
      }

      //check if the player already exists
      //if true remove it

      var index = findIndex("email", player.playerId, doc.scores)
      console.log("index");
      console.log(index);
      if (index != null){
        console.log("player found in db");
        console.log(index);
        doc.scores.splice(index, 1);
        console.log(doc.scores);

      }

      if (player.score > doc.scores[0].score){
        //top highscore
        doc.scores.unshift(playerScore);
        console.log("adding score to start of list");

      } else if (player.score < doc.scores[doc.scores.length -1].score){
        //lowest score
        console.log("adding score to end of list");
        doc.scores.push(playerScore);
      } else {
        console.log("adding score to middle of list");

        //somewhere in the middle
        doc.scores.push(playerScore);

        doc.scores.sort(function(a, b) {
          return parseFloat(b.score) - parseFloat(a.score);
        });
        console.log(doc.scores);

      }

      highscoresDb.insert(doc, function( err, res){
        asyncCb(err, res)
      })
    }
  ], function( err, res){
    if (err){
      callback(err);
    } else {
      callback(null, res);
    }
  })
}

function getTopScores(level, numberToFetch ,callback){
  var highscoresDb = nano.db.use("highscores");
  highscoresDb.get(level, function(err, doc){
    if (err){
      callback(err);
    } else {
      var results = [];
      if (doc.scores.length <= numberToFetch){
        callback(null, doc.scores);
      } else {
        for (var i = 0; i < numberToFetch; i++) {
          results.push(doc.scores[i]);
        }
        callback(null, results);
      }
    }

  })
}

function getScoresAroundPlayer(player, level, callback){
  var highscoresDb = nano.db.use("highscores");
  highscoresDb.get(level, function(err, doc){
    if (err){
      callback(err);
    } else {
      var index = findIndex("email", player.email, doc.scores)
      var results = [];
      switch(index){
        case 1:
          for (var i = 1; i < 5; i++){
            results.push(doc.scores[i]);
          }
          break;

        case 2:
          results.push(doc.scores[0]);
          for (var i = 2; i < 4; i++){
            results.push(doc.scores[i]);
          }
          break;

        case doc.scores.length -1:
          results.push(doc.scores[doc.scores.length]);
          for (var i = doc.scores.length - 2; i < doc.scores.length-5 ; i--){
            results.push(doc.scores[i]);
          }
          break;

        case doc.scores.length:
          for (var i = doc.scores.length - 1; i < doc.scores.length-5 ; i--){
            results.push(doc.scores[i]);
          }
          break;
        default:
          results.push(doc.scores[index + 2]);
          results.push(doc.scores[index + 1]);
          results.push(doc.scores[index - 1]);
          results.push(doc.scores[index - 2]);
          break;

      }
      callback(err, results)
    }
})
}

function getPlayerDoc(playerId, callback){
  var playerDb = nano.db.use("match3players");
  playerDb.get(playerId, function(err, doc){
    if (err){
      if (err.statusCode == 404){
        var response = {
          statusCode: 200,
          message: "new player doc created",
          body: {
            email: playerId,
            name: "",
            lastLogin: new Date(),
            loginTally: 1,
            currentLevel: 1,
            currentCoins: 0,
            currentStars: 0,
            bonuses : {

            },
            levels: {

            },
            lives: 5,
            currentLevel: 1,
            dailyClaimed: false,
            maxLives: "5",
          }
        }
        playerDb.insert(response.body, playerId, function(err, res){
          if (err){
            callback(err)
          } else {
            callback(null, response)
          }
        })
      } else {
        callback(err)
      }
    } else {
      var d = new Date();
      var lastLogin = doc.lastLogin;
      var dailyClaimed = doc.dailyClaimed;
      if (dailyClaimed == true){
        if (lastLogin.getDate() != d.getDate()){
          dailyClaimed = false
        }
      }
      doc.lastLogin = d;
      callback(null, doc)
    }
  })

}

function postPlayerDoc(player, callback){
  var playerDb = nano.db.use("match3players");
  var historicalDb = nano.db.use("historical");
  playerDb.get(player.email, function( err, doc){
    if (err){
      callback(err );
    } else {
      player._rev = doc._rev;
      console.log(player);
      playerDb.insert(player, function( err, res){
        if (err){
          callback(err);
        } else {
          var historicalDoc = player;
          historicalDoc.email = historicalDoc._id;
          delete historicalDoc._rev;
          delete historicalDoc._id;
          historicalDb.insert(historicalDoc, function( err, res){
            if (err){
              callback(err);
            } else {
              callback(null, res);
            }
          })
        }
      })
    }
  })
}

var exports = module.exports = {};
exports.processPlayerScore = processPlayerScore;
exports.getTopScores = getTopScores;
exports.getScoresAroundPlayer = getScoresAroundPlayer;
exports.getPlayerDoc = getPlayerDoc;
exports.sendFitnessData = sendFitnessData;
exports.postPlayerDoc = postPlayerDoc;
exports.generateNewLife = generateNewLife;
