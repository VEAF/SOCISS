// ============================
// 
// GET/
// Page d'accueil
//
// ============================

exports.index = function(req, res) {
  res.render('accueil', {
    title: 'Accueil'
  });
};