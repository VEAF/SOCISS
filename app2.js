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

// Base de donnée
var db = mongoose.connect("mongodb://localhost/socis");
mongoose.connection.on('error', function () {
  console.log('MongoDB Erreur de Connexion. Vérifiez que MongoDB est bien en fonctionnement.');
  process.exit(1);
});


// =======================
//
// Models debriefMission
//
// =======================

var mongoose = require('mongoose');

var debriefMissionSchema = new mongoose.Schema({
  name: [String],
  id: [Number],
  // type weapons à affiner - besoin d'exemples avec de la data sur ce champ
  weapons: [String],
  kills: 
   { 'Ground Units': 
      { 'Arty/MLRS': [Number],
        SAM: [Number],
        Unarmored: [Number],
        IFVs: [Number],
        AAA: [Number],
        total: [Number],
        Other: [Number],
        EWR: [Number],
        Tanks: [Number],
        APCs: [Number],
        Forts: [Number],
        Infantry: [Number] },
     Planes: 
      { UAVs: [Number],
        Fighters: [Number],
        Bombers: [Number],
        total: [Number],
        Transports: [Number],
        Other: [Number],
        Support: [Number],
        Attack: [Number] },
     Helicopters: { Other: [Number], total: [Number], Utility: [Number], Attack: [Number] },
     Ships: { Warships: [Number], total: [Number], Unarmed: [Number], Subs: [Number], Other: [Number] },
     Buildings: { Other: [Number], Static: [Number], total: [Number] } },
  // type friendlyKills à affiner - besoin d'exemples avec de la data sur ce champ
  friendlyKills: [String],
  // type friendlyHits à affiner - besoin d'exemples avec de la data sur ce champ
  friendlyHits: [String],
  // type friendlyCollisionHits à affiner - besoin d'exemples avec de la data sur ce champ
  friendlyCollisionHits: [String],
  // type friendlyCollisionKills à affiner - besoin d'exemples avec de la data sur ce champ
  friendlyCollisionKills: [String],
  PvP: { losses: [Number], kills: [Number] },
  losses: { pilotDeath: [Number], crash: [Number], eject: [Number] } 
});

var debriefMissionModel = mongoose.model('debriefMission', debriefMissionSchema, 'stats_SLmod_missions');


// -------------------------------------
// Fonction Traitement d'un fichier log
// -------------------------------------
analyseFichier = function(req, res) {
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
            // C'est également le moment d'initialiser l'objet
            eval(nom_pilote+'["id"] = "0"');
            eval(nom_pilote+'["weapons"] = "0"');
            //eval(nom_pilote+'["kills"] = "0"');
            //eval(nom_pilote+'["kills"]["Ground Units"] = "0"');
            eval(nom_pilote+'["kills"] = {"Ground Units" : { "Arty/MLRS" : "0", "SAM" : 0, "Unarmored" : 0, "IFVs" : 0, "AAA" : 0, "total" : 0, "Other" : 0, "EWR" : 0, "Tanks" : 0, "APCs" : 0, "Forts" : 0, "Infantry" : 0 }}');
            eval(nom_pilote+'["kills"]["Planes"] = { "UAVs" : 0, "Fighters" : 0, "Bombers" : 0, "total" : 0, "Transports" : 0, "Other" : 0, "Support" : 0, "Attack" : 0 }');
            eval(nom_pilote+'["kills"]["Helicopters"] = { "Other" : 0, "total" : 0, "Utility" : 0, "Attack" : 0 }');
            eval(nom_pilote+'["kills"]["Ships"] = { "Warships" : 0, "total" : 0, "Unarmed" : 0, "Subs" : 0, "Other" : 0 }');
            eval(nom_pilote+'["kills"]["Buildings"] = { "Other" : 0, "Static" : 0, "total" : 0 }');
            eval(nom_pilote+'["friendlyKills"] = "0"');
            eval(nom_pilote+'["friendlyHits"] = "0"');
            eval(nom_pilote+'["friendlyCollisionHits"] = "0"');
            eval(nom_pilote+'["friendlyCollisionKills"] = "0"');
            eval(nom_pilote+'["PvP"] = { "losses" : 0, "kills" : 0 }');
            eval(nom_pilote+'["losses"] = { "pilotDeath" : 0, "crash" : 0, "eject" : 0 }');
            console.log(eval(nom_pilote));
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
        // si c'est vide on passe à la ligne suivante - ca fait gagner du temps
        if (partie_2 == "{ }") {return;};

		// on execute la commande correspondant à la définition de l'élément d'objet du débrief pilote
		var commande = partie_1 + " = " + partie_2;
		console.log(commande);
		eval(commande);

		// Détection de la ligne avec ID pour la création de l'entrée en BDD
		if (line.search("id") > -1) {
			// On prépare la requête de création
			commande = 'var debriefMission = new debriefMissionModel({ id : ' +
						nom_pilote + '["id"] , name : "'+
						nom_pilote + '" })';
			eval(commande);
			debriefMission.save(function (err) {
			  if (err) { throw err; }
			  console.log('Nouvelle entrée de débrief créée !');
			});
            
		    return;
		};

		// Update de l'entrée en BDD avec les infos collectées au fur et à mesure
		// on prépare la requête permettant d'identifier le document à retrouver
		// peut-être l'id peut suffir - besoin de plus de données exemples
		commande = 'var query = {"name" : "'+ nom_pilote +'", "id" : ' + nom_pilote + '["id"]}';
		eval(commande);
		commande = 'debriefMissionModel.findOneAndUpdate(query,';
					commande = commande + '{ weapons: ' + nom_pilote + '["weapons"],';
					  commande = commande + 'kills: ';
					   commande = commande + '{ "Ground Units": ';
						  commande = commande + '{ "Arty/MLRS": ' + nom_pilote + '["kills"]["Ground Units"]["Arty/MLRS"],';
							commande = commande + 'SAM: ' + nom_pilote + '["kills"]["Ground Units"]["SAM"],';
							commande = commande + 'Unarmored: ' + nom_pilote + '["kills"]["Ground Units"]["Unarmored"],';
							commande = commande + 'IFVs: ' + nom_pilote + '["kills"]["Ground Units"]["IFVs"],';
							commande = commande + 'AAA: ' + nom_pilote + '["kills"]["Ground Units"]["AAA"],';
							commande = commande + 'total: ' + nom_pilote + '["kills"]["Ground Units"]["total"],';
							commande = commande + 'Other: ' + nom_pilote + '["kills"]["Ground Units"]["Other"],';
							commande = commande + 'EWR: ' + nom_pilote + '["kills"]["Ground Units"]["EWR"],';
							commande = commande + 'Tanks: ' + nom_pilote + '["kills"]["Ground Units"]["Tanks"],';
							commande = commande + 'APCs: ' + nom_pilote + '["kills"]["Ground Units"]["APCs"],';
							commande = commande + 'Forts: ' + nom_pilote + '["kills"]["Ground Units"]["Forts"],';
							commande = commande + 'Infantry: ' + nom_pilote + '["kills"]["Ground Units"]["Infantry"] },';
						commande = commande + ' Planes: ';
						commande = commande + '  { UAVs: ' + nom_pilote + '["kills"]["Planes"]["UAVs"],';
							commande = commande + 'Fighters: ' + nom_pilote + '["kills"]["Planes"]["Fighters"],';
							commande = commande + 'Bombers: ' + nom_pilote + '["kills"]["Planes"]["Bombers"],';
							commande = commande + 'total: ' + nom_pilote + '["kills"]["Planes"]["total"],';
							commande = commande + 'Transports: ' + nom_pilote + '["kills"]["Planes"]["Transports"],';
							commande = commande + 'Other: ' + nom_pilote + '["kills"]["Planes"]["Other"],';
							commande = commande + 'Support: ' + nom_pilote + '["kills"]["Planes"]["Support"],';
							commande = commande + 'Attack: ' + nom_pilote + '["kills"]["Planes"]["Attack"] },';
						 commande = commande + 'Helicopters: { Other: ' + nom_pilote + '["kills"]["Helicopters"]["Other"], total: ' + nom_pilote + '["kills"]["Helicopters"]["total"], Utility: ' + nom_pilote + '["kills"]["Helicopters"]["Utility"], Attack: ' + nom_pilote + '["kills"]["Helicopters"]["Attack"] },';
						 commande = commande + 'Ships: { Warships: ' + nom_pilote + '["kills"]["Ships"]["Warships"], total: ' + nom_pilote + '["kills"]["Ships"]["total"], Unarmed: ' + nom_pilote + '["kills"]["Ships"]["Unarmed"], Subs: ' + nom_pilote + '["kills"]["Ships"]["Subs"], Other: ' + nom_pilote + '["kills"]["Ships"]["Other"] },';
						 commande = commande + 'Buildings: { Other: ' + nom_pilote + '["kills"]["Buildings"]["Other"], Static: ' + nom_pilote + '["kills"]["Buildings"]["Static"], total: ' + nom_pilote + '["kills"]["Buildings"]["total"] } },';
					  commande = commande + 'friendlyKills: ' + nom_pilote + '["friendlyKills"],';
					  commande = commande + 'friendlyHits: ' + nom_pilote + '["friendlyHits"],';
					  commande = commande + 'friendlyCollisionHits: ' + nom_pilote + '["friendlyCollisionHits"],';
					  commande = commande + 'friendlyCollisionKills: ' + nom_pilote + '["friendlyCollisionKills"],';
					  commande = commande + 'PvP: { losses: ' + nom_pilote + '["PvP"]["losses"], kills: ' + nom_pilote + '["PvP"]["kills"] },';
					  commande = commande + 'losses: { pilotDeath: ' + nom_pilote + '["losses"]["pilotDeath"], crash: ' + nom_pilote + '["losses"]["crash"], eject: ' + nom_pilote + '["losses"]["eject"] } },';
					commande = commande + 'function(err, doc){';
						commande = commande + 'if (err) return console.log(err);';
						commande = commande + 'return console.log("Mise à jour du document !");';
		commande = commande + "})";
		eval(commande);
        eval(nom_pilote);
	});
};


analyseFichier('log1.lua');



// fermeture de la db - à retirer
//db.disconnect();


