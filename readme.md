# SOCIS : Service d'Organisation et Calculs Inter-serveurs des Statistiques

![Logo SOCIS](public/logo/socis_big_logo.png)

## Prérequis
* MongoDB
* Node.js
* Installer mongoose `npm install mongoose` (sera plus tard dans le package avec npm install)

## Objet
Récupérer et analyser des logs de missions produits par des serveurs de simulation, pour ensuite les servir en format JSON.

## Status
Ca commence à fonctionner.
Le log est analysé et une entrée en BDD est créée avec les éléments récupérés.
Le code est réorganisé en architecture MVC.
La prochaine étape va consister à mettre en place la partie serveur de données.

## License
SOCIS est mis à disposition sous license GNU General Public License v3 (GPL-3) (http://www.gnu.org/copyleft/gpl.html).
