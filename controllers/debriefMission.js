// ============================
//
// Controllers debriefMission
//
// ============================


var DebriefMission = require('../models/DebriefMission');


// Librairies
var fs = require('fs'),
    readline = require('readline'),
    mongoose = require("mongoose");


// ---------------------------------
// Traitement d'un fichier log
// ---------------------------------
exports.analyseFichier = function(req, res) {
	var rd = readline.createInterface({
		input: fs.createReadStream(req),
		output: process.stdout,
		terminal: false
	});

	rd.on('line', function(line) {
		// Détection ligne de définition objet inutile
		var count_brackets = (line.match(/"/g) || []).length;
		if (count_brackets == 2 || count_brackets == 0) {
		    return;
		};

		// On filtre les lignes qui contiennent times ou host - sans intérêt et on traite les autres
		if (line.search("times") > -1) {
		    return;
		};
		if (line.search("host") > -1) {
		    return;
		};
		
		// Détection du nom du pilote en cours de débrief dans la ligne - ligne avec names
		if (line.search("names") > -1) {
			// on repère le nom du pilote
		    pos_ref_1 = line.indexOf( '= "' );
		    pos_ref_2 = line.indexOf( '", }' );
		    nom_pilote = line.slice( pos_ref_1 + 3, pos_ref_2 );
		    // création de l'objet du nom du pilote - à garder ?
		    commande = nom_pilote + " = Object.create(Object.prototype)";
		    eval(commande);
			// On créée l'entrée en BDD pour la séquence de débrief à venir
			var debriefMission = new debriefMissionModel();
			debriefMission.save(function (err) {
			  if (err) { throw err; }
			  console.log('Nouvelle entrée de débrief créée !');
			});
		    return;
		};
		 
		// on modifie la ligne pour qu'elle ressemble à une ligne de définition d'objet
		var element = line.replace( 'misStats["', '' );
		// on remplace le nom d'objet par celui défini avec names
		var pos_ref_3 = element.indexOf( '"]' );
		var nom_a_remplacer = element.slice( 0, pos_ref_3 );
		element = element.replace( nom_a_remplacer, nom_pilote );
		
		// on repère la séparation = dans chaque ligne
		var pos_egal = element.indexOf( "=" );
		
		// on récupère la donnée - nom de l'élément - définie dans la ligne
		var partie_1 = element.slice( 0, pos_egal - 1 );
		// netoyage et mise en forme pour l'utiliser comme élément d'objet à définir
		partie_1 = partie_1.replace( '"]', '' );
		
		// on récupère la donnée à proprement parler
		var partie_2 = element.slice(pos_egal+2);
		// nettoyage des brackets
		partie_2 = partie_2.replace(/[\[\]]+/g, '');
		// on remplace les = par :
		partie_2 = partie_2.replace(/[=]+/g, ':');
		// on nettoie les , qui trainent en fin de liste
		partie_2 = partie_2.replace(', }', ' }');

		// on execute la commande correspondant à la définition de l'élément d'objet du débrief pilote
		var commande = partie_1 + " = " + partie_2;
		eval(commande);
		console.log(commande);


		//console.log(VEAF_Frenetique);
	});
};


// ---------------------------------
// Détection nouveau fichier
// ---------------------------------
exports.detectionFichier = function(req, res) {
};



// ---------------------------------
// Suppression fichier
// ---------------------------------
exports.suppressionFichier = function(req, res) {
};



