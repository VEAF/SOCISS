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


// ----------------------------------
// Partie initialisation de l'appli
// ----------------------------------

// Librairies nécessaires au traitement d'un log
var fs = require('fs'),
    readline = require('readline'),
    mongoose = require("mongoose");

// Librairies pour la partie serveur
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');


// -------------
// Controllers
// -------------
var debriefMissionController = require('./controllers/debriefMission');
var homeController = require('./controllers/home');
var VEAF_FrenetiqueController = require('./controllers/VEAF_Frenetique');


// ----------------------------------
// Clés API et paramétrage Passport
// ----------------------------------
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');


// -----------------------------
// Création du serveur Express
// -----------------------------
var app = express();


// ----------------
// Base de donnée
// ----------------
var db = mongoose.connect("mongodb://localhost/socis");
mongoose.connection.on('error', function () {
  console.log('MongoDB Erreur de Connexion. Vérifiez que MongoDB est bien en fonctionnement.');
  process.exit(1);
});


// --------------------------------
// Paramétrage du serveur Express
// --------------------------------
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


// ---------------------------------------
// Les routes statiques de l'application
// ---------------------------------------
app.get('/', homeController.index);
// Route statique provisoire pour développement de l'export JSON des datas d'un pilote
app.get('/VEAF_Frenetique', VEAF_FrenetiqueController.index);


// ---------------------
// Gestion des erreurs
// ---------------------
app.use(errorHandler());


// ----------------------------------
// Mise en route du serveur Express
// ----------------------------------
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});


// -----------------------------
// Traitement d'un fichier log
// -----------------------------

// Détection d'un nouveau fichier à traiter
//debriefMissionController.detectionFichier();

// Analyse du log -> BDD
debriefMissionController.analyseFichier('log1.lua');

// Suppression du fichier log analysé - ou déplacement dans un répertoire des logs traités ?
//debriefMissionController.suppressionFichier();


// ------------------------------------
// Diffusion des stats en format JSON
// ------------------------------------
// partie REST de l'appli via routes express



module.exports = app;
