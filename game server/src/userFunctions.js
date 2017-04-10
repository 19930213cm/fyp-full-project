var commonVariables = require("./userFunctionsVariables.js")
var initDb = require("./initDb.js");
var async = require("async");
function findUserDoc(dbName, userName, callback){
   initDb.useDb(dbName, function(err, db){
    if (err){
      callback(err);
    } else{
      console.log(commonVariables);
      db.view(commonVariables.designDocName, commonVariables.viewName, function(err, body) {
        if (err){
          callback(err);
        } else {
          callback(null, body);
        }
      });
    }
  })
}

function postFirebaseToken(username, token, callback){
  async.waterfall([
    function getDb(asyncCb){
      initDb.useDb(commonVariables.dbName, function( err, db){
        asyncCb(err, db)
      })
    },
    function getUserDocs(db, asyncCb){
      db.view(commonVariables.designDocName, commonVariables.viewName, {key: username}, function(err, body) {
        asyncCb(err, db, body.rows[0].id)
      })
    }, function getUserDoc(db, userDocId, asyncCb){
      db.get(userDocId, function (err, doc){
        asyncCb(err, db, doc);
      })
    }, function updateUserDocWithToken(db, doc, asyncCb){
      if (doc.token == null){
        doc.token = "";
      }
      doc.token = token;
      db.insert(doc, function(err, res){
        asyncCb(err, res);
      })
    }
  ], function(err, res){
    if (err){
      callback(err)
    } else{
      callback(null, res)
    }
  })
}

function getUserDoc(username, callback){
  initDb.useDb(commonVariables.dbName, function(err, db){
   if (err){
     console.error(err);
     callback(err);
   } else{
     db.view(commonVariables.designDocName, commonVariables.viewName,{key: username}, function(err, body) {
       if (err){
         callback(err);
       } else {
         db.get(body.rows[0].id, function(err, userDoc){
           if (err) {
             callback(err);
           } else {
             callback(null, userDoc)
           }
         })
       }
     });
   }
 })
}

function checkUserLogin(username, password, callback){
  async.waterfall([
    function getDb(asyncCb){
      initDb.useDb(commonVariables.dbName, function( err, db){
        asyncCb(err, db)
      })
    },
    function getUserDocs(db, asyncCb){
      db.view(commonVariables.designDocName, commonVariables.viewName, {key: username}, function(err, body) {
        console.log(body);
        if (body.rows[0] != null){
          asyncCb(err, db, body.rows[0].id)

        } else{
          err = {
            "statusCode": 404,
            "message": "user not found"
          }
          asyncCb(err)
        }
      })
    }, function getUserDoc(db, docId, asyncCb){
      db.get(docId, function (err, doc){
        asyncCb(err, doc);
      })
    }, function checkAgainstPassword(doc, asyncCb){
      if (doc.password == password){
        asyncCb(null, doc)
      } else{
        var error = {
          "statusCode" : 404,
          "message" : "user not found in database"
        }
        asyncCb(error);
      }
    }
  ], function(error, res){
    if (error){
      callback(error);
    } else{
      callback(null, res);
    }
  })
}

function returnAllAlerts(callback){
  initDb.useDb("alerts", function(err, db){
    if (!err){
      db.view(commonVariables.designDocName, "users", function (err, doc){
        if (!err){
          var results = [] ;

          for(var i = 0; i < doc.rows.length; i++){
            results.push(doc.rows[i].value);
          }
          callback(null, results);
        } else {
          callback(err);
        }
      })
    } else {
      callback(err);
    }
  })
}

function returnMyAlerts(username, callback){
  async.waterfall([
    function getUserDb(asyncCb){
      initDb.useDb("users", function(err, db){
      asyncCb(err, db);
      })
    },
    function getUserView(db, asyncCb){
    db.view(commonVariables.designDocName, commonVariables.viewName, {keys: username}, function (err, viewResults){
      console.log(viewResults);
      asyncCb(err, db, viewResults.rows[0])
    })
  },
  function getUserDoc(db, viewResults, asyncCb){
    db.get(viewResults.id, function(err, doc){
      asyncCb(err, doc);
    })
  },
  function getAlertsDb(userDoc, asyncCb){
    initDb.useDb("alerts", function( err, db){
      asyncCb(err, userDoc, db);
    })
  }, function getAlertsForUser(userDoc, db, asyncCb){
    db.view(commonVariables.designDocName, "users", function(err, view){
      var results = [];

      for(var i = 0; i < view.rows.length; i++){
        if (view.rows[i].value.requestedBy == userDoc._id){
          results.push(view.rows[i].value);
        } else if(view.rows[i].value.monitoredBy == userDoc._id){
          results.push(view.rows[i].value);
        } else if(view.rows[i].value.assignedto == userDoc._id){
          results.push(view.rows[i].value);
        }
      }
      asyncCb(err, results  );
    })
  }
  ], function(err, res){
    if (err){
      callback(err)
    } else {
      callback(null, res)
    }
  })
}
var exports = module.exports = {};
exports.findUserDoc = findUserDoc;
exports.checkUserLogin = checkUserLogin;
exports.postFirebaseToken = postFirebaseToken;
exports.getUserDoc = getUserDoc;
exports.returnMyAlerts = returnMyAlerts;
exports.returnAllAlerts = returnAllAlerts;
