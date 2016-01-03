// =================================
//
// GET/
// Datas du pilote VEAF_Frenetique
//
// =================================

exports.index = function(req, res) {
  // Définition de la requête pour les données que l'on souhaite agréger concernant le pilote
  // Execution de la requête
  // Besoin d'une manip pour la rendre en JSON ?

  res.render('VEAF_Frenetique', {
    title: 'VEAF_Frenetique'
    // contenu de la page = infos du pilote en JSON
  });
};
