// =============================
//
// Controllers VEAF_Frenetique
//
// =============================

// Librairies
var mongoose = require("mongoose");

// Models
var debriefMissionModel = require('../models/DebriefMission');


// =================================
//
// GET/
// Datas du pilote VEAF_Frenetique
//
// =================================

exports.index = function(req, res) {
  res.charset = "utf-8";
  // Définition de la requête pour les données que l'on souhaite agréger concernant le pilote
  var query = {"name" : "VEAF_Frenetique"}
  // Execution de la requête
  debriefMissionModel.findOne(query, function (err, res){
    if (err) return console.error(err);
  }).lean().exec(function (err, pilot_data) {
    return res.end(JSON.stringify(pilot_data));
  });
};
