'use strict';

var db = require('./connexion.js').db;


//Creation de la table Professeur dans la base de données dans la base de donnée
var Prof = db.define('professeurs', {
    nom     : String,
    prenom  : String,
    email   : String,
    login   : String,
    resp_peda: Boolean //Responsable pédagogique
    //matieres : Object //Objet JSON qui permet de donner la liste des matieres
});
Prof.sync(function (err) {
    if (!err)
        console.log("Done!");
    else
        console.log(err);
});

exports.Prof = Prof;