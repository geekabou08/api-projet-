'use strict';
var db = require('./connexion.js').db;
var Prof = require('./professeurModel.js').Prof;


//Table des modules
var Cours = db.define('cours', {
    nom : String,
    niveau : String,
});
Cours.hasOne('professeur',Prof);
Cours.sync(function(err) {
    if (!err)
        console.log("Done!");
    else
        console.log(err);
});

exports.Cours = Cours;