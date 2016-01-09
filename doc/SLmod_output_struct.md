
SLmod Stats
================


Introduction 
--------------

Ce document tente de présenter la structure des données enregistrées par
SLmod stats.

Choses à savoir:

-   Un joueur est identifié par un numéro ID unique à son compte

-   Toutes les stats du joueur seront liés à son ID (et pas son pseudo)

-   SLmod ajoute une ligne au fichier pour chaque statistique nouvelle à
    un joueur

-   Quand un nouveau joueur se connecte pour la 1^ère^ fois à la
    mission, une entrée dédiée est générée et est écrite à la suite du
    fichier

Par conséquent un fichier stats de SLmod se lit comme un historique,
c'est en gros la **chronologie** des évènements liés aux joueurs.

Le nombre d'entrées/champs des stats de SLmod est conséquent, leur
présentation se fera donc par entrée/champs.

Structures et entrées 
-------------------------

Le premier niveau inclue en premier lieu l'ID unique du joueur sous la
forme d'une chaîne alphanumérique. Lors de la première connexion, son
pseudo sera enregistré dans le champ names ainsi qu'un ID.

Les autres champs seront initialisés si c'est la première fois qu'il se
connecte au serveur.

Toutes les entrées sont illustrées sur la Figure 1

Les entrées sont décrites dans les pages qui suivent.
A noter que tous les champs décrits sont liés à un joueur.

####["names"] ####


Cette entrée inclut les noms que le joueur possède sur le serveur,
chaque nom est indexé.

Exemple:

```lua
["names"] = { [1] = "Komodo", }
```

####["id"]####


Un identifiant numérique, utilité inconnu, possiblement un id objet
unique pour la mission en cours.

Exemple:
```lua
["id"] = 9
```
####["times"] ####

Ce champ comprend un temps d'utilisation par appareil. Il fait aussi la
distinction entre temps de vol et temps d'occupation total. La fréquence
de mise à jour semble être de 10 secondes.

Exemple d'un avion en vol:
```lua
["times"]["M-2000C"] = { ["inAir"] = 30.002, ["total"] = 940.816, }

["times"]["M-2000C"] = { ["inAir"] = 40.002, ["total"] = 950.816, }
```
Exemple d'un avion au sol n'ayant pas encore décollé ou ayant atteri:
```lua
["times"]["M-2000C"]["total"] = 870.813

["times"]["M-2000C"]["total"] = 880.813
```
####["weapons"] ####


Le champ weapons inclut toutes les informations relatives à l'armement
employé. Ce champ est branché par type d'armement et pour chacun de ces
derniers, diverse entrées sont fournies. Voyons l'exemple de l'emploi
d'un Magic 2 sur M2000-C.

Initialisation d'un armement (ici Magic 2) juste avant sa 1^ère^
utilisation pour un joueur donné:
```lua
["weapons"]["R-550 Magic 2"] = {["numHits"] = 0, ["kills"] = 0, ["shot"] = 0, ["hit"] = 0, }
```
Après avoir tiré un Magic 2:
```lua
["weapons"]["R-550 Magic 2"]["shot"] = 1
```
Au second tir d'un Magic 2:
```lua
["weapons"]["R-550 Magic 2"]["shot"] = 2
```
Cette structure est la même pour tous les armements employés jusqu'à
présent.

Note: seuls les champs "shot" ainsi que le type d'armement semblent être
mis à jour pour le moment.

####["kills"] ####


Le champ "kills" est très vaste et est séparé en plusieurs catégories en
fonction de la nature de la cible. Le champ est aussi initialisé pour un
joueur qui entre dans un avion pour la 1^ère^ fois.

Il existe 5 natures de cibles possibles: ["Ground Units"],
["Planes"], ["Helicopters"], ["Ships"],
["Buildings"]

Chacune de ces natures est séparé en fonction du type (SAM, IFVs,
Infantry etc...).
Toute la structure est visible à l'initialisation pour un joueur donné.

Exemples:

Cibles terrestres
```lua
["kills"]["Ground Units"] = {["Arty/MLRS"] = 0, ["SAM"] = 0, ["Unarmored"] = 0, ["IFVs"] = 0, ["AAA"] = 0, ["total"] = 0,
["Other"] = 0, ["EWR"] = 0, ["Tanks"] = 0, ["APCs"] = 0, ["Forts"] = 0, ["Infantry"] = 0, }
```
Cibles aériennes, ailes fixes:
```lua
["kills"]["Planes"] = { ["UAVs"] = 0, ["Fighters"] = 0, ["Bombers"] = 0, ["total"] = 0, ["Transports"] = 0, ["Other"] = 0, ["Support"] = 0, ["Attack"] = 0, }
```
Véhicules aériennes, ailes rotatives:
```lua
["Helicopters"] = { ["Other"] = 0, ["total"] = 0, ["Utility"] = 0, ["Attack"] = 0, }
```
Véhicules maritimes:
```lua
["Ships"] = { ["Warships"] = 0, ["total"] = 0, ["Unarmed"] = 0, ["Subs"] = 0, ["Other"] = 0, }
```
Bâtiments:
```lua
["Buildings"] = { ["Other"] = 0,
["Static"] = 0, ["total"] = 0, }
```
Lorsque le joueur détruit une cible, le champ relatif à cette cible pour
ce joueur sera incrémenté.

Note: Il semblerait que les frats ne soient pas pris en compte pour les
kills. Il faudra vérifier si c'est le cas pour un kill de joueur.

#### ["friendlyKills"] ####


Ce champ est réservé pour tout tirs de type "Blue on Blue sur une IA
(frat PVP non enregistré dans ce champ apparament). Les friendlyKills
sont stockés à la manière d'un tableau à plusieurs dimensions.

Exemple d'un avion allié contrôlé par l'IA détruit par un joueur du même
camp:
```lua
["friendlyKills"][1] = { ["objCat"] = "plane", ["weapon"] = "R-550 Magic 2", ["time"] = 1452097472, ["objTypeName"] =
"S-3B Tanker", }
```
On a donc l'indexage du kill fratricide (ici [1]), la catégorie ou
nature de la cible, le type d'armement employé, l'heure de l'incident
ainsi que le nom de la cible (son type). Ceci étant bien sûr lié à un
joueur.

####["friendlyHits"] ####


Le champ "friendlyHits inclut tout les évènements ou un armement allié à
toucher un autre allié, joueur ou non. Ils sont enregistrés à la manière
d'un tableau comme pour les "friendlyKills".

Exemple d'un tir missile qui a atteint un tanker allié:
```lua
["friendlyHits"][12] = { ["objCat"] = "plane", ["weapon"] = "R-550 Magic 2", ["time"] = 1452097434, ["objTypeName"] =
"S-3B Tanker", }
```
La lecture est la suivante: le 12ème friendlyHits du joueur est sur un
élément à voilure fixe (avion) avec un Magic 2 à l'heure 1452097434, sur
un S-3B Tanker.

Exemple d'un tir missile qui a atteint un joueur allié:
```lua
["friendlyHits"][1] = { ["time"] = 1452094948, ["objCat"] = "plane", ["human"] = "64x2630xx29584x77xx0x49x583a3xxx",
["weapon"] = "R-550 Magic 2", ["objTypeName"] = "M-2000C", }
```
Cette fois un champ "human" avec son ID unique (un fake pour l'exemple)
est present.

Note: le cas d'un frat provenant d'une IA n'a pas été testé. Il faut
encore interpréter le time correctement (format ?)

#### ["friendlyCollisionHits"] ####


Pas encore testé

####["friendlyCollisionKills"] ####


Pas encore testé

####["PvP"] ####


Le champ "PvP" inclut 2 entrées: ["losses"] et
["kills"]

Les stats "PvP" suivent une règle propre à SLmod et y sont décrites dans
le manuel relatif. Elle sont rappelés ici brièvement:

-   Un appareil de catégorie inférieure ou égale à sa cible gagnera un
    "PvP" "kills" en la détruisant (exemples: un A10C détruit un Su-27.
    Un M2000C détruit un M2000C).

-   Un appareil ne reçoit de pertes ("losses" ) que lorsqu'il est
    détruit par appareil inférieur ou égale (exemples: un Su-27 reçoit
    une perte si détruit par un A-10C, mais pas l'inverse).

Il existe 3 catégories avec le classement suivant: Fighters &gt; Attack
aircrafts &gt; Helicopters

Note: ce champ n'a pas encore pu être testé/observé dans un log.

####["losses"] ####


Le champ "losses" inclue les informations relatives à la perte d'un
appareil par le joueur et au statut du pilote. Il contient 3 entrées:
["pilotDeath"], ["crash"], ["eject"]

Ces entrées sont assez explicites. Des exemples sont fournis ci-dessous.

Exemple d'un crash joueur:

Note: les crashs ne sont pas enregistrés…

Exemple d'une éjection:
```lua
["losses"]["eject"] = 1
```
Exemple de la mort du pilote:
```lua
["losses"]["pilotDeath"] = 1
```

