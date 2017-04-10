var initDb = require("./initDb.js");
var initDbContents = require("./initDbContents.js");
var commonVariables = require("./userFunctionsVariables.js");
var async = require("async");
var FCM = require('fcm-node');
var firebaseCredentials = require("../utils/firebaseCredentials.js").credentials;
var fcm = new FCM(firebaseCredentials.serverKey);

// function sendRequest(request, callback){
//   async.waterfall([
//     function getPorterDocId(asyncCb){
//       findSuitablePorter( function(err, porterDocId){
//         asyncCb(err, porterDocId);
//       })
//     },
//     function getDb(porterDocId, asyncCb){
//       initDb.useDb("users", function(err, db){
//         asyncCb(err, porterDocId, db);
//       })
//     },
//     function getPorterDoc(id, db, asyncCb){
//       db.get(id, function(err, doc){
//         asyncCb(err, doc, db)
//       })
//     },
//     function updateDocAndSendNotification(doc, db, asyncCb){
//       doc.tasks.push(request);
//       var message = {
//         to: doc.token,
//
//         notification:{
//           title: "Wheelchair notification",
//           body: "some info"
//         }
//       }
//       fcm.send(message, function(err, response){
//         asyncCb(err, doc, db)
//       })
//   },
//   function postPortterDocToDb( doc, db, asyncCb){
//     db.insert(doc, function (err, res){
//       asyncCb(err, res)
//     })
//   },
//   function
//   ], function(err, res){
//     if (err){
//       callback(err)
//     } else {
//       callback(null, res)
//     }
//   })
// }

// returnOverdueAlerts(function( err , res){
//   if (err){
//     console.log(err);
//   } else {
//     console.log(res);
//   }
// })
function returnOverdueAlerts(callback){
  var viewResults;
  var adminDoc;

  async.waterfall([
    function getDb(asyncCb){
      initDb.useDb("alerts", function (err, db ){
          db.view(commonVariables.designDocName, "allAlerts", function(err, vr){
            viewResults = vr;
            asyncCb(err);
          })
      })
    },
    function getAdmin(asyncCb){
      initDb.useDb("users", function (err, db ){
        db.view(commonVariables.designDocName, "admins", function(err, vr){
          adminDoc = vr.rows[0].value;
          asyncCb(err);
        })
      })
    },
    function searchForOverdueAlerts(asyncCb){
      var alerts = viewResults.rows;
      var date = new Date();
      var overdueTime = 1800000;

      console.log(adminDoc.value);
      async.each(alerts, function(a, eachCb) {
        var alert = a.value;
        // console.log(alert.timestamp + overdueTime );
        // console.log(date.getTime());
        // console.log(date);
        // tmp = new Date(alert.timestamp + overdueTime);
        // console.log(tmp);
          if(alert.timestamp + overdueTime < date.getTime()){
            initDb.useDb("users", function(err, db){
              if (!err){
                console.log("sending notifion");
                db.get(alert.assignedto, function (err, doc){
                  if (!err){
                    var message = {
                      to: adminDoc.token,
                      collapse_key: "Unactioned alert",
                      data:{
                        type: "unactioned",
                        contact: doc.contact,
                        alert: alert.locationId
                      },
                      notification:{
                        title: "Unactioned alert",
                        body: "Alert has not been actioned",
                      }
                    }
                    fcm.send(message, function(err, response){
                      if (err){
                        eachCb(err);
                      } else{
                        eachCb();
                      }
                    })
                  }
                })
              }
            })
          } else {
            eachCb()
          }
      }, function(err) {
            asyncCb(err, "success");
      });
    }
  ], function( err, res){
    if (err){
      callback(err);
    } else {
      callback(null, res);
    }
  })
}

function getWheelchairCounts(callback){
  initDb.useDb("chairs", function(err, db){
    db.get("countsDoc", function( err, countsDoc){
      if (err){
        callback(err);
      } else{
        var counts = countsDoc.actual;
        var res = {};
        for (var key in counts) {
          var location = initDbContents.setLocation(parseInt(key))
          res[location.locationName] = counts[key]
        }
        callback(null, res);
      }
    })
  })
}

function updateUserWithRequest(request, username, role, callback){
  async.waterfall([
    function getDb(asyncCb){
      initDb.useDb("users", function(err, db){
        asyncCb(err, db);
      })
    },
    function getViewResults(db, asyncCb){
      var viewname;
      if (role == 1){
        viewname = commonVariables.porterView;
      } else if(role == 2){
        viewname = commonVariables.porterView;
      } else {
        viewname = commonVariables.porterView;
      }
        db.view(commonVariables.designDocName, viewname, function(err, viewResults){
          asyncCb(err, db, viewResults);
        })
    },
    function updateUserDoc(viewResults, asyncCb){
      for (var i = 0; i < viewResults.rows.length; i++){
        if (viewResults.rows[i].value.userName == username){
          viewResults.rows[i].value.alerts.push(request);
          db.insert(viewResults.rows[i].value, function( err, res){
            asyncCb(err, res);
          })
        }
      }
    }
  ], function(err, res){
    if (err){
      callback(err)
    } else {
      callback(null, res)
    }
  })
}
//searches user db to find the most suitable porter to assign a task to
function newAlert(req, callback){
  async.waterfall([
    function erwjkgfjw(asyncCb){
      makeAlert(req.location, req.amount, req.requestedBy, req.priority, function (err, alert){
        findSuitablePorter(function(err, porterId){
          alert.assignedto = porterId;

          asyncCb(err, alert);
          alert.requestedBy = req.requestedBy;
        });
      })
    },
    function getDb(alert, asyncCb){
      alert.requestedBy = req.requestedBy
      initDb.useDb("alerts", function(err, db){
        asyncCb(err, alert, db);
      })
    },
    function postAlert(alert, db, asyncCb){
      db.insert(alert, function( err, res){
        asyncCb(err, alert, res)
      })
    },
    function getUserDb(alert, res, asyncCb){
      initDb.useDb("users", function(err, db){
        asyncCb(err, db, alert, res);
      })
    },
    function sendNotifcation(db, alert, res, asyncCb){
      var toNotify = [alert.assignedto];
      if (alert.monitoredBy != ""){
        toNotify.push(alert.monitoredBy);
      }
      async.each(toNotify, function( user, asyncEachCb){

        db.get(user, function(err, doc){
          if (err){
            console.error(err);
            asyncEachCb(err);
          } else {
            doc.tasks++;
            db.insert(doc, function( err, res){
              if (err){
                asyncEachCb(err);
                console.error(err);
              } else {
                if (alert.amount > 1){
                  var notificationText = alert.amount + " wheelchairs required at " + alert.locationId;

                } else {
                  var notificationText = "Wheelchair required at " + alert.locationId;
                }
                var message = {
                  to: doc.token,
                  priority : "high",
                  collapse_key: "NotifyMe",
                  data:{
                    type: "newAlert"
                  },
                  notification:{
                    title: "New alert!",
                    body: notificationText,
                  }
                }
                fcm.send(message, function(err, response){
                  if (err){
                    asyncEachCb(err);
                  } else {
                    asyncEachCb();
                  }
                })
              }
            })
          }
        })
      }, function(err){
        if (err){
          asyncCb(err);
        } else{
          asyncCb(null, "Success")
        }
      })
    }], function(err, res){
      if (err){
        callback(err )
      } else {
        callback(null, err)
      }
    })
}

function completeAlert(alertId, callback){
  async.waterfall([
    function getAlertsDb(asyncCb){
      initDb.useDb("alerts", function(err, db){
        asyncCb(err, db);
      })
    },
    function getChairsDb(aDb, asyncCb){
      initDb.useDb("chairs", function(err, db){
        asyncCb(err, aDb, db);
      })
    },
    function getAlertDoc(aDb, cDb, asyncCb){
      aDb.get(alertId, function(err, doc){
        asyncCb(err, aDb, cDb, doc);
      })
    },
    function getChairCounts(aDb, cDb, doc, asyncCb){
      cDb.get("countsDoc", function (err, counts){
        asyncCb(err, aDb, doc);
      })
    },
    // function checkAlertCompleted(aDb, counts, alert, asyncCb){
    //   console.log(counts[alert.location]);
    //   console.log(alert.currentAmount);
    //   if (counts[alert.location] > alert.currentAmount){
    //     asyncCb(err, aDb, alert);
    //   } else{
    //     var err = {
    //       statusCode: 500,
    //       message: "Task has not been completed"
    //     }
    //     asyncCb(err);
    //   }
    // },
    function removeAlertFromDb(db, alert, asyncCb){
      db.destroy(alert._id, alert._rev, function(err, res){
        asyncCb(err, alert);
      })
    },
    function getHistoricalDb(alert, asyncCb){
      initDb.useDb("historical", function( err, db){
        asyncCb(err, db, alert);
      })
    },
    function addAlertToHistoricalDb(db, alert, asyncCb){
      delete alert._id;
      delete alert._rev;
      db.insert(alert, function(err, res){
        asyncCb(err, alert);
      })
    }, function getUserDb(alert, asyncCb){
      initDb.useDb("users", function (err, db){
          asyncCb(err, alert, db);
      })
    },
    function updateTasks (alert, db, asyncCb){
      db.get(alert.assignedto, function(err, doc){
        if (doc.tasks > 0){
          doc.tasks--;
        }
        db.insert(doc, function(err, res){
          asyncCb(err, alert, db, res)
        })
      })
    },
    function getRequesterDoc(alert, db, res, asyncCb){
      if (alert.requestedBy == "system"){
        asyncCb(null, null, res)
      } else {
        db.get(alert.requestedBy, function( err, doc){
          asyncCb(err, doc, null)
        })
      }
    }, function sendNotifcation(doc, res, asyncCb){
      if (doc != null){
      var message = {
        to: doc.token,
        collapse_key: "Request complete",
        data:{
          type: "complete"
        },
        notification:{
          title: "Wheelchair notification",
          body: "Your request for a wheelchair has been completed",
        }
      }
      fcm.send(message, function(err, response){
        console.log(response);
        asyncCb(err, response);
      })
    } else {
      asyncCb(null, res);
    }
    }
  ], function (err, complete){
    if (err){
      console.error(err);
      callback(err)
    } else {
      console.log(complete);
      callback(null, complete)
    }
  })
}

function findSuitablePorter( callback){
  async.waterfall([
      function getDb(asyncCb){
        initDb.useDb("users", function(err, db){
          asyncCb(err, db);
        })
      },
      function getViewResults(db, asyncCb){
          db.view(commonVariables.designDocName, commonVariables.porterView, function(err, viewResults){
            asyncCb(err, db, viewResults);
          })
      },
      function findSuitablePorter(db, viewResults, asyncCb){
          var date = new Date();
          var day = date.getDay();
          var hour = date.getHours();
          var suitablePorters = [];
          var docs = viewResults.rows;
          for (var i = 0; i < docs.length; i++){
            for(var j = 0; j < docs[i].value.schedule.days.length; j++){
              if (day == docs[i].value.schedule.days[j]){
                suitablePorters.push(docs[i].value)
              }
            }
          }
          var chosenPorter = suitablePorters[0];
          for (var i = 1; i < suitablePorters.length; i++){
            if (suitablePorters[i].tasks < chosenPorter.tasks){
              chosenPorter = suitablePorters[i];
            }
          }
          asyncCb(null, chosenPorter._id);
      }

  ], function(err ,res){
    if (err){
      callback(err)
    } else {
      callback(null ,res)
    }
  })
}

function makeAlert(location, amount, username, priority, callback){
  var alert = {
    "locationId": location,
    "amount": amount,
    "requestedBy": "",
    "assignedto": "",
    "monitoredBy": "",
    "timestamp" : new Date().getTime(),
    "priority": priority,
    "acknowledged": false,
    "whereFrom": []
  }

  initDb.useDb("chairs", function(err, db) {
    if (!err){
      db.view(commonVariables.designDocName, "availableChairs", function(err, results){
        if (!err){
          results = results.rows[0].value;

          for (var i = 0; i < results.length; i++){
            if (results[i].amount > amount){
              var loc = initDbContents.setLocation(parseInt(results[i].locationId))
              console.log(loc);
              alert.whereFrom.push(loc.locationName);
              break;
            }
      }
          callback(null, alert);
        } else {
          callback(err);
        }
      })
    } else {
      callback(err);
    }
  })
}

function acknowledgeAlert(alertId, username,  callback){
  initDb.useDb("alerts", function(err, db){
    if (!err){
      db.get(alertId, function (err, doc){
        if (!err){
          initDb.useDb("users", function(err, userDb){
            if(!err){
                  userDb.view(commonVariables.designDocName, "userNames", {keys: [username]}, function(err, viewResults){
                    if (!err){
                      console.log(username);
                      console.log(viewResults.rows[0]);
                        userDb.get(doc.assignedto, function(err, oldUser){
                          oldUser.tasks --;
                          userDb.get(viewResults.rows[0].id, function (err, newUser){
                            newUser.tasks++;
                            doc.assignedto = viewResults.rows[0].id;
                            doc.acknowledged = true;
                            console.log(doc.assignedto);
                            db.insert(doc, function(err, res){
                              console.log(doc);
                              if (doc.requestedBy != "system"){
                                userDb.get(doc.requestedBy, function(err, userDoc){
                                  if (!err){
                                    var message = {
                                      to: userDoc.token,
                                      collapse_key: "Request complete",
                                      data:{
                                        type: "acknowledged"
                                      },
                                      notification:{
                                        title: "Request acknowledged",
                                        body: "Your wheelchair should be with you soon",
                                      }
                                    }
                                    callback(err, res);

                                    fcm.send(message, function(err, response){
                                      if (err){
                                        console.log("fcm error");
                                        console.error(err);
                                      }
                                    })
                                  }
                                })
                              } else {
                                callback(err, res);
                              }

                        })
                      })
                    })
                  }
                })
                }
              })
            }
          })
        }
      })
    }


function automatedMonitoring(callback){
  initDb.useDb("chairs", function(err, db){
    if (!err){
      initDbContents.checkForWarnings(db, function(err, warnings){
        if (!err){
          async.eachSeries(warnings, function(warning, asyncCb) {
            // req.location, req.amount, req.requestedBy, req.priority
            var req = {
              location: warning.locationName,
              amount: warning.required,
              requestedBy: "system",
              priority: "3",
            }
            newAlert(req, function(err, res){
              if (err){
                asyncCb(err)
              } else{
                asyncCb()
              }
            })

          }, function(err) {
              // if any of the file processing produced an error, err would equal that error
              if( err ) {
                // One of the iterations produced an error.
                // All processing will now stop.
                callback(err);
              } else {
                callback(null, 200);
              }
          });
        }
      })
    }
  })
}

// automatedMonitoring(function(err, res){
//   if (err){
//     console.error(err);
//   } else{
//     console.log(res);
//   }
// })


var exports = module.exports = {};
exports.findSuitablePorter = findSuitablePorter;
exports.newAlert = newAlert;
exports.completeAlert = completeAlert;
exports.acknowledgeAlert = acknowledgeAlert;
exports.getWheelchairCounts = getWheelchairCounts;
exports.returnOverdueAlerts = returnOverdueAlerts;
exports.automatedMonitoring = automatedMonitoring;
