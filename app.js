// =========================================================================================================
//
//           _____         ____             _____     ____________             _____             _____   
//        _____\    \    ____\_  \__     _____\    \_  /            \       _____\    \       _____\    \  
//       /    / \    |  /     /     \   /     /|     ||\___/\  \\___/|     /    / \    |     /    / \    | 
//      |    |  /___/| /     /\      | /     / /____/| \|____\  \___|/    |    |  /___/|    |    |  /___/| 
//   ____\    \ |   |||     |  |     ||     | |____|/        |  |      ____\    \ |   || ____\    \ |   || 
//  /    /\    \|___|/|     |  |     ||     |  _____    __  /   / __  /    /\    \|___|//    /\    \|___|/ 
// |    |/ \    \     |     | /     /||\     \|\    \  /  \/   /_/  ||    |/ \    \    |    |/ \    \      
// |\____\ /____/|    |\     \_____/ || \_____\|    | |____________/||\____\ /____/|   |\____\ /____/|     
// | |   ||    | |    | \_____\   | / | |     /____/| |           | /| |   ||    | |   | |   ||    | |     
//  \|___||____|/      \ |    |___|/   \|_____|    || |___________|/  \|___||____|/     \|___||____|/      
//                     \|____|               |____|/                                                      
//
//         Service d'Organisation et Calculs Inter-serveurs des Statistiques pour la Simulation
//
// =========================================================================================================
//
// Un développement de la Virtual European Air Force - www.veaf.org
// Mis à disposition sous license GNU General Public License v3 (GPL-3) www.gnu.org/copyleft/gpl.html
//
// =========================================================================================================


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
mongoose.connection.on('error', function () {
  console.log('MongoDB Erreur de Connexion. Vérifiez que MongoDB est bien en fonctionnement.');
  process.exit(1);
});


// ---------------------------------
// Traitement d'un fichier log
// ---------------------------------

// Détection d'un nouveau fichier à traiter
//debriefMissionController.detectionFichier();

debriefMissionController.analyseFichier('log1.lua');

// Suppression du fichier log analysé
//debriefMissionController.suppressionFichier();


// -----------------------------------
// Diffusion des stats en format JSON
// -----------------------------------
// partie REST de l'appli via routes express


