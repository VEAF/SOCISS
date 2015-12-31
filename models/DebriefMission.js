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

module.exports = mongoose.model('DebriefMission', debriefMissionSchema, 'stats_SLmod_missions');

