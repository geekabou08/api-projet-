'use strict';

var db = require('./connexion.js').db;
var Etudiant = require('./etudiantModel.js').Etudiant;
var Cours = require('./coursModel.js').Cours;

//Definition de la table
var Absence= db.define('absences',{
    date: Date
});
Absence.hasOne('etudiant',Etudiant);
Absence.hasOne('cours',Cours);
Absence.sync(function(err) {
    if (!err)
        console.log("Done!");
    else
        console.log(err);
});
exports.Absence =Absence;