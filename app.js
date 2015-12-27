// ===========================================================================
//
// SOCIS : Service d'Organisation et Calculs Inter-serveurs des Statistiques
//
// ===========================================================================


// ---------------------------------
// Partie initialisation de l'appli
// ---------------------------------

// Librairies
var fs = require('fs'),
    readline = require('readline'),
    mongoose = require("mongoose");

// -------------
// Controllers
// -------------
var debriefMissionController = require('./controllers/debriefMission');


// ----------------
// Base de donnée
// ----------------
var db = mongoose.connect("mongodb://localhost/socis");
mongoose.connection.on('error', function() {
  console.log('MongoDB Erreur de Connexion. Vérifiez que MongoDB est bien en fonctionnement.');
  process.exit(1);
});


// -----------------------------------------
// Détection d'un nouveau fichier à traiter
// -----------------------------------------
debriefMissionController.detectionFichier();


// ---------------------------------
// Traitement d'un fichier log
// ---------------------------------
debriefMissionController.analyseFichier('log1.lua');


// -----------------------------------
// Suppression du fichier log analysé
// -----------------------------------
debriefMissionController.suppressionFichier();


// -----------------------------------
// Diffusion des stats en format JSON
// -----------------------------------
// partie REST de l'appli via routes express


// fermeture de la db - à retirer
db.disconnect();
