var async = require("async");
var  initDb = require("./initDb.js");

var nano = initDb.nano;

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
      highscoresDb.get(player.level, function(err, doc){
        asyncCb(err, doc);
      })
    },
    function processHighScore(doc , asyncCb){
      var playerScore = {
        score: player.score,
        name: player.name,
        email: player.email
      }

      //check if the player already exists
      //if true remove it

      var index = findIndex("email", player.email, doc.scores)
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
        asyncCb(err)
      })
    },
    function getPlayerDoc(asyncCb){
      playerDb.get(player.email, function( err, doc){
        asyncCb(err, doc)
      })
    },
    function updatePlayerDoc(doc , asyncCb){
      var obj = {
        score: player.score,
        stars: player.stars,
        complete: true
      }
      doc[player.level] = obj;
      doc.unlockedLevel ++;

      playerDb.insert(doc, function( err, res){
        asyncCb(err,res);
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

//currently retrievs the top 20 scores
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

            }
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
      callback(null, doc)
    }
  })

}


var exports = module.exports = {};
exports.processPlayerScore = processPlayerScore;
exports.getTopScores = getTopScores;
exports.getScoresAroundPlayer = getScoresAroundPlayer;
exports.getPlayerDoc = getPlayerDoc;
