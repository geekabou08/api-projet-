'use strict';
var db = require('./connexion.js').db;
var Classe=require('./classeModel.js').Classe;

var Etudiant = db.define('etudiants', {
    nom    : String,
    prenom : String,
    email  : String,
    login  : String,
    classe :String,
    responsable : Boolean,
    heure_absence : {type : 'integer',defaultValue: 0}
    });
Etudiant.hasOne('classe',Classe);
Etudiant.sync(function (err) {
    if (!err)
        console.log("Etudiant Done! ");
    else
        console.log(err);});

exports.Etudiant = Etudiant;